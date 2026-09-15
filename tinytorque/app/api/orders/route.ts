import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = { productId: string; quantity: number };
type CheckoutBody = {
  contactEmail: string;
  shippingName: string;
  shippingPhone: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  items: CheckoutItem[];
};

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }

export async function POST(request: Request) {
  try {
    const body = await request.json() as CheckoutBody;
    const contactEmail = text(body.contactEmail);
    const shippingName = text(body.shippingName);
    const address1 = text(body.address1);
    const city = text(body.city);
    const postcode = text(body.postcode);
    const country = text(body.country) || "Australia";

    if (!contactEmail || !shippingName || !address1 || !city || !postcode || !body.items?.length) {
      return NextResponse.json({ error: "Please complete your contact, shipping, and cart details." }, { status: 400 });
    }

    const items = body.items.map((item) => {
      const product = catalog.find((candidate) => candidate.id === item.productId);
      const quantity = Number.isInteger(item.quantity) ? item.quantity : 0;
      if (!product || quantity < 1 || quantity > 20) throw new Error("Invalid cart item");
      return { product, quantity, unitPrice: product.price };
    });
    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const admin = createAdminClient();
    const orderNumber = "TT-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    const { data: order, error: orderError } = await admin.from("orders").insert({
      user_id: user?.id ?? null,
      order_number: orderNumber,
      contact_email: contactEmail,
      status: "pending",
      total,
      shipping_name: shippingName,
      shipping_phone: text(body.shippingPhone) || null,
      shipping_address_1: address1,
      shipping_address_2: text(body.address2) || null,
      shipping_city: city,
      shipping_state: text(body.state) || null,
      shipping_postcode: postcode,
      shipping_country: country,
    }).select("id, order_number").single();

    if (orderError || !order) throw new Error(orderError?.message || "Unable to create order");
    const { error: itemError } = await admin.from("order_items").insert(items.map((item) => ({
      order_id: order.id,
      product_id: null,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })));
    if (itemError) throw new Error(itemError.message);

    return NextResponse.json({ orderNumber: order.order_number }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
