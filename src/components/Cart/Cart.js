import Modal from '../UI/Modal';
import styles from './Cart.module.css';
import { useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import SubmitOrder from './SubmitOrder';
import React from 'react';

const Cart = props => {
  const [isSubmitOrderAvailable, setIsSubmitOrderAvailable] = useState(false);
  const [isDataSubmitting, setIsDataSubmitting] = useState(false);
  const [wasDataSendingSuccessful, setWasDataSendingSuccessful] =
    useState(false);

  const cartContext = useContext(CartContext);

  const totalAmount = `$${Math.abs(cartContext.totalAmount).toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  const removeCartItemHandler = id => {
    cartContext.removeItem(id);
  };

  const addCartItemHandler = item => {
    cartContext.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsSubmitOrderAvailable(true);
  };

  const submitOrderHandler = async userData => {
    setIsDataSubmitting(true);

    await fetch(
      'https://food-ordering-app-865c0-default-rtdb.europe-west1.firebasedatabase.app/orders.json',
      {
        method: 'POST',
        body: JSON.stringify({
          user: userData,
          orderedMeals: cartContext.items,
        }),
      }
    );
    setIsDataSubmitting(false);
    setWasDataSendingSuccessful(true);
    cartContext.clearCart();
  };

  const cartItems = (
    <ul className={styles['cart-items']}>
      {cartContext.items.map(item => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onAdd={addCartItemHandler.bind(null, item)}
          onRemove={removeCartItemHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalButtons = (
    <div className={styles.actions}>
      <button className={styles['button--alt']} onClick={props.onHideCart}>
        Закрити
      </button>
      {hasItems && (
        <button className={styles.button} onClick={orderHandler}>
          Замовити
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={styles.total}>
        <span>Разом</span>
        <span>{totalAmount}</span>
      </div>
      {isSubmitOrderAvailable && (
        <SubmitOrder
          onSubmit={submitOrderHandler}
          onCancel={props.onHideCart}
        />
      )}
      {!isSubmitOrderAvailable && modalButtons}
    </React.Fragment>
  );

  const dataSubmittingCartModalContent = <p>Надсилання даних замовлення...</p>;

  const dataWasSubmittedCartModalContent = (
    <React.Fragment>
      <p>Ваше замовлення успішно відправлено!</p>
      <div className={styles.actions}>
        <button className={styles['button--alt']} onClick={props.onHideCart}>
          Закрити
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onHideCart={props.onHideCart}>
      {!isDataSubmitting && !wasDataSendingSuccessful && cartModalContent}
      {isDataSubmitting && dataSubmittingCartModalContent}
      {wasDataSendingSuccessful && dataWasSubmittedCartModalContent}
    </Modal>
  );
};

export default Cart;
