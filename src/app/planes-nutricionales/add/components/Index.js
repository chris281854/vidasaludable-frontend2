// pages/index.js
import React, { useState } from 'react';
import Header from '../components/Header';
import NutritionalPlan from '../components/NutritionalPlan';
import FoodSearch from '../components/FoodSearch';
import MacronutrientProjection from '../components/MacronutrientProjection';
import DailyKcal from '../components/DailyKcal';
import FoodInfoInput from '../components/FoodInfoInput';

const Home = () => {
    const [foodList, setFoodList] = useState([]);

    const handleAddFood = (food) => {
        setFoodList((prev) => [...prev, food]);
    };

    return (
        <div className="relative w-full h-screen bg-white">
            <Header />
            <NutritionalPlan />
            <FoodSearch />
            <FoodInfoInput onAddFood={handleAddFood} />
            <MacronutrientProjection />
            <DailyKcal />
            <div className="absolute left-0 top-1/4 w-full">
                {foodList.map((food, index) => (
                    <div key={index} className="flex justify-between bg-gray-200 p-2 rounded mb-2">
                        <span>{food.foodName}</span>
                        <span>{food.frequency}</span>
                        <span>{food.calories} Kcal</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;