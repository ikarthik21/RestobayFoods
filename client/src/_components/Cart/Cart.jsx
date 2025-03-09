import useCartStore from "../../store/use-cart";
import { memo } from "react";
import PropTypes from "prop-types";

const CartItem = memo(({ item, addToCart, removeFromCart }) => (
  <div className="flex items-center justify-between m-2 border-b pb-2">
    <div className="flex items-center">
      <img
        src="https://restobay.vercel.app/images/vt.jpg"
        className="h-12 w-12 object-cover rounded-xl transition-transform hover:scale-105"
        alt={item.name}
        loading="lazy"
      />
      <h2 className="ml-4">{item.name}</h2>
    </div>

    <div className="flex items-center">
      <p className="mr-4">Rs: {item.price}</p>

      <div className="flex items-center mx-4">
        <button
          className="quantity-btn"
          onClick={() => removeFromCart(item.id)}
        >
          -
        </button>
        <p className="mx-2">{item.quantity}</p>
        <button className="quantity-btn" onClick={() => addToCart(item)}>
          +
        </button>
      </div>

      <p>Rs: {item.price * item.quantity}</p>
    </div>
  </div>
));

CartItem.displayName = "CartItem";

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired
};

const Cart = () => {
  const { cart, addToCart, removeFromCart } = useCartStore();

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between m-2 border-b pb-2 font-bold">
            <div>Item</div>
            <div className="flex items-center">
              <div className="mr-4">Price</div>
              <div className="mx-4">Quantity</div>
              <div>Subtotal</div>
            </div>
          </div>

          {/* Cart Items */}
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          ))}

          {/* Total */}
          <div className="flex justify-end m-2 pt-2 border-t">
            <div className="font-bold mr-4">Total:</div>
            <div className="font-bold">Rs: {totalPrice}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
