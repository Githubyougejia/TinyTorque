const cart = [];
const cartCount = document.querySelector('#cartCount');
const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.querySelectorAll('.quick-add').forEach((button) => {
  button.addEventListener('click', () => {
    cart.push(button.dataset.product);
    cartCount.textContent = cart.length;
    showToast(`${button.dataset.product} added to cart.`);
  });
});
document.querySelector('#cartButton').addEventListener('click', () => showToast(cart.length ? `${cart.length} item${cart.length === 1 ? '' : 's'} in your cart.` : 'Your cart is empty. Time for an upgrade?'));
document.querySelector('#searchButton').addEventListener('click', () => document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('#signupForm').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('You’re on the Tiny Torque list.');
  event.currentTarget.reset();
});
