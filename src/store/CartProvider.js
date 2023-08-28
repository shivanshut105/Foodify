import { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
    items: [],
    totalAmount: 0
}

const cartReducer = (state, action) => {
    if (action.type === 'ADD') {
        const updatedTotalAmount = state.totalAmount + action.item.amount * action.item.price;
        const existingCartItemIndex = state.items.findIndex(item => {
            return item.id === action.item.id;
        })
        const existingCartItem = state.items[existingCartItemIndex];

        let updatedItems;

        if (existingCartItem) {
            const updatedCartItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount,
            }
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedCartItem;
        }
        else {
            updatedItems = state.items.concat(action.item);
        }
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }
    if (action.type === 'REMOVE') {
        const existingCartItemIndex = state.items.findIndex(item => {
            return item.id === action.id;
        });
        const existingCartItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingCartItem.price;

        let updatedItems;
        
        if (existingCartItem.amount === 1) {
            updatedItems = state.items.filter(item => item.id !== action.id);
        } else {
            const updatedCartItem = {...existingCartItem, amount: existingCartItem.amount - 1};
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedCartItem;
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount,
        }
    }
    if(action.type === "CLEAR") return defaultCartState;
    return defaultCartState;
}

const CartProvider = (props) => {
    const [cartState, dispatchCartState] = useReducer(cartReducer, defaultCartState);

    const addItemHandler = (item) => {
        dispatchCartState({ type: 'ADD', item: item });
    };

    const removeItemHandler = (id) => {
        dispatchCartState({ type: 'REMOVE', id: id });
    };

    const clearCartHandler = ()=>{
        dispatchCartState({type: "CLEAR"});
    }

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemHandler,
        removeItem: removeItemHandler,
        clearCart: clearCartHandler,
    }
    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartProvider;