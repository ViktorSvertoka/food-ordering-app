import { useEffect, useState } from 'react';
import styles from './MealList.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpErrorMessage, setHttpErrorMessage] = useState();

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      const response = await fetch(
        'https://food-ordering-app-865c0-default-rtdb.europe-west1.firebasedatabase.app/meals.json'
      );

      if (!response.ok) {
        throw new Error('Щось пішло не так');
      }

      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch(err => {
      setIsLoading(false);
      setHttpErrorMessage(err.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={styles.loading}>
        <p>Вилучення даних із сервера...</p>
      </section>
    );
  }

  if (httpErrorMessage) {
    return (
      <section className={styles.error}>
        <p>{httpErrorMessage}</p>
      </section>
    );
  }

  const mealList = meals.map(meal => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={styles.meals}>
      <Card>
        <ul>{mealList}</ul>
      </Card>
    </section>
  );
};

export default MealList;
