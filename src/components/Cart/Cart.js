import { useContext } from 'react';
import Modal from '../UI/Modal';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';


const Cart = (props) => {
    const cartCtx = useContext(CartContext);

    const hasItems = cartCtx.items.length > 0;
    let total = `$${cartCtx.totalAmount.toFixed(2)}`;

    const addItemHandler = (item)=>{
        cartCtx.addItem({
            ...item,
            amount: 1,
        });
    }

    const removeItemHandler = (id)=>{
        cartCtx.removeItem(id);
    }

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map(item => {
                return <CartItem
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    amount={item.amount}
                    onAdd ={addItemHandler.bind(null, item)}
                    onRemove={removeItemHandler.bind(null, item.id)}/>
            })}
        </ul>
    )

    return (
        <Modal onClick={props.onHide}>
            {cartItems}
            <div className={classes.total}>
                <span>Total amount</span>
                <span>{total}</span>
            </div>
            <div className={classes.actions}>
                <button className={classes['.button--alt']} onClick={props.onHide}>Close</button>
                {hasItems && <button className={classes.button}>Order</button>}
            </div>
        </Modal>
    );
}

export default Cart;