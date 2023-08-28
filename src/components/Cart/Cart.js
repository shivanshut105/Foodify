import { useContext, useState } from 'react';
import Modal from '../UI/Modal';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import Checkout from './Checkout';
import { Oval } from 'react-loader-spinner';
import { Checkmark } from 'react-checkmark'


const Cart = (props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const cartCtx = useContext(CartContext);

    const hasItems = cartCtx.items.length > 0;
    let total = `$${cartCtx.totalAmount.toFixed(2)}`;

    const addItemHandler = (item) => {
        cartCtx.addItem({
            ...item,
            amount: 1,
        });
    }

    const removeItemHandler = (id) => {
        cartCtx.removeItem(id);
    }

    const showCheckoutHandler = () => {
        setShowCheckout(true);
    }

    const onConfirmHandler = async (userData) => {
        setIsSubmitting(true);
        await fetch("https://react-http-16739-default-rtdb.firebaseio.com/orders.json", {
            method: "POST",
            body: JSON.stringify({
                user: userData,
                orderItems: cartCtx.items,
            })
        })
        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    }

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map(item => {
                return <CartItem
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    amount={item.amount}
                    onAdd={addItemHandler.bind(null, item)}
                    onRemove={removeItemHandler.bind(null, item.id)} />
            })}
        </ul>
    )

    const modalActions = (
        <div className={classes.actions}>
            <button className={classes['.button--alt']} onClick={props.onHide}>Close</button>
            {hasItems && <button className={classes.button} onClick={showCheckoutHandler}>Order</button>}
        </div>
    )

    const cartModalContent = <>
        {cartItems}
        <div className={classes.total}>
            <span>Total amount</span>
            <span>{total}</span>
        </div>
        {showCheckout && <Checkout onConfirm={onConfirmHandler} onCancel={props.onHide} />}
        {!showCheckout && modalActions}
    </>

    const isSubmittingModalContent = <div className={classes.loadingSpinner}>
        <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}

        />
        <p>Placing your order...</p>
    </div>

    const didSubmitModalContent = <>
        <div className={classes.loadingSpinner}>
            <Checkmark size='50px'/>
            <p>Successfully placed your order!</p>
        </div>
        <div className={classes.actions}>
            <button className={classes.button} onClick={props.onHide}>Close</button>
        </div>
    </>

    return (
        <Modal onClick={props.onHide}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    );
}

export default Cart;