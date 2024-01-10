// /src/pages/AddCategoryForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddCategoryForm.css'
import Header from '../Components/Header';


const AddCategoryForm = () => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/categories/add',
                { name: categoryName }
            );
            const categoryId = response.data.categoryId;
            console.log('New category ID:', categoryId);
            // Add any further handling for success here (e.g., show a success message)
        } catch (error) {
            console.error('Error adding category:', error.message);
            // Add any error handling here (e.g., show an error message)
        }
    };

    return (
        <>
        <Header/>
        <div className= "form-container">
        <div className="container mt-4 add-category-form">
            <div className="form-header">
                <h2>Add Category</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="categoryName">Category Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Category
                </button>
            </form>
        </div>
        </div>
        </>
    );
    
};

export default AddCategoryForm;
