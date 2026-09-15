export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
};

export const catalog: CatalogProduct[] = [
  { id: "dashbot", name: "DASH DOT", price: 69 },
  { id: "shift-light", name: "SHIFT SIGNAL", price: 45 },
  { id: "key-tag", name: "PARK TAG", price: 18 },
  { id: "air-freshener", name: "NIGHT DRIVE", price: 16 },
];
