import { useEffect, useState } from 'react';
import Card from '../UI/Card';
import classes from './AvailableMeals.module.css';
import MealItem from './MealItem/MealItem';

const AvailableMeals = () => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("https://react-http-16739-default-rtdb.firebaseio.com/Meals.json");

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const responseData = await response.json();

            const loadedTasks = [];

            for (const key in responseData) {
                loadedTasks.push({
                    id: key,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    price: responseData[key].price,
                })
            }

            setMeals(loadedTasks);
            setIsLoading(false);
        }

        fetchData().catch((error) => {
            setError(error.message);
            setIsLoading(false);
        });
    }, []);

    const mealsList = meals.map(meal => {
        return <MealItem key={meal.id}
            id={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price} />
    })

    if (isLoading) {
        return <p className={classes.mealsLoading}>Loading...</p>;
    }

    if (error) {
        return <p className={classes.mealsError}>{error}</p>
    }

    return (
        <section className={classes.meals}>
            <Card>
                <ul>
                    {mealsList}
                </ul>
            </Card>
        </section>
    );
}

export default AvailableMeals;