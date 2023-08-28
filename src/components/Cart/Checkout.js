import { useRef, useState } from 'react';
import classes from './Checkout.module.css';

const isEmpty = (value) => value.trim().length === 0;
const isSixChars = value => value.trim().length === 6;

const Checkout = (props) => {
    const [formIsValid, setFormIsValid] = useState({
        name: true,
        street: true,
        city: true,
        postal: true,
    })

    const nameInputRef = useRef();
    const streetInputRef = useRef();
    const cityInputRef = useRef();
    const postalInputRef = useRef();

    const confirmHandler = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredStreet = streetInputRef.current.value;
        const enteredCity = cityInputRef.current.value;
        const enteredPostal = postalInputRef.current.value;

        const enteredNameIsValid = !isEmpty(enteredName);
        const enteredStreetIsValid = !isEmpty(enteredStreet);
        const enteredCityIsValid = !isEmpty(enteredCity);
        const enteredPostalIsValid = isSixChars(enteredPostal);

        setFormIsValid({
            name: enteredNameIsValid,
            street: enteredStreetIsValid,
            city: enteredCityIsValid,
            postal: enteredPostalIsValid,
        });

        if (!formIsValid.name && !formIsValid.street && !formIsValid.city && !formIsValid.postal) {
            return;
        }

        props.onConfirm({
            name: enteredName,
            street: enteredStreet,
            city: enteredCity,
            postal: enteredPostal
        })
    };

    const nameInputClasses = `${classes.control} ${!formIsValid.name ? classes.invalid : ''}`;
    const streetInputClasses = `${classes.control} ${!formIsValid.street ? classes.invalid : ''}`;
    const cityInputClasses = `${classes.control} ${!formIsValid.city ? classes.invalid : ''}`;
    const postalInputClasses = `${classes.control} ${!formIsValid.postal ? classes.invalid : ''}`;

    return (
        <form className={classes.form} onSubmit={confirmHandler}>
            <div className={classes.address}>
                <div className={nameInputClasses}>
                    <label htmlFor='name'>Your Name</label>
                    <input type='text' id='name' ref={nameInputRef} />
                    {!formIsValid.name && <p className={classes["error-text"]}>Please enter a valid name!</p>}
                </div>
                <div className={streetInputClasses}>
                    <label htmlFor='street'>Street</label>
                    <input type='text' id='street' ref={streetInputRef} />
                    {!formIsValid.street && <p className={classes["error-text"]}>Please enter a valid street!</p>}
                </div>
                <div className={cityInputClasses}>
                    <label htmlFor='city'>City</label>
                    <input type='text' id='city' ref={cityInputRef} />
                    {!formIsValid.city && <p className={classes["error-text"]}>Please enter a valid city!</p>}
                </div>
                <div className={postalInputClasses}>
                    <label htmlFor='postal'>Postal Code</label>
                    <input type='text' id='postal' ref={postalInputRef} />
                    {!formIsValid.postal && <p className={classes["error-text"]}>Please enter a valid postal code!</p>}
                </div>
            </div>
            <div className={classes.actions}>
                <button type='button' onClick={props.onCancel}>
                    Cancel
                </button>
                <button className={classes.submit}>Confirm</button>
            </div>
        </form>
    );
};

export default Checkout;