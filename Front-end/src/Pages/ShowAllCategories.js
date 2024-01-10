// /src/pages/ShowAllCategories.css
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/ShowAllCategories.css'
import Header from '../Components/Header';

const ShowAllCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch all categories from the API endpoint
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/categories'
                );
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
                // Handle the error, e.g., show an error message
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
        <Header/>
        <div className="form-container">
        <div className="container mt-4">
            <h2>All Categories</h2>
            <ul className="list-group">
                {categories.map((category, index) => (
                    <li key={category.id} className="list-group-item">
                        {index + 1}. {category.name}
                    </li>
                ))}
            </ul>
        </div>
        </div>
        </>
    );
};

export default ShowAllCategories;
