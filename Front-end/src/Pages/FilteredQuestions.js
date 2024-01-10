// /src/pages/FilteredQuestions.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/FilteredQuestions.css';
import Header from '../Components/Header';

const FilteredQuestions = () => {
    const [formData, setFormData] = useState({
        categoryId: '',
        difficulty: '',
    });

    const [questions, setQuestions] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/questions/filteredquestions',
                formData
            );
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching filtered questions:', error.message);
            // Handle the error, e.g., show an error message
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <>
        <Header/>
        <div className="container mt-4">
            <div className="filter-form">
                <h2>Filter Questions</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="categoryId">Category ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="difficulty">Difficulty:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Filter
                    </button>
                </form>
            </div>
            {questions.length > 0 && (
                <div className="questions-container">
                    <h2>Filtered Questions</h2>
                    <div className="card-container">
                        {questions.map((question) => (
                            <div key={question.id} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Question ID: {question.id}</h5>
                                    <p className="card-text">Subject: {question.subject}</p>
                                    <p className="card-text">Options: {question.options.join(', ')}</p>
                                    <p className="card-text">Difficulty: {question.difficulty}</p>
                                    <p className="card-text">
                                        Categories: {typeof question.categories === 'string' ? question.categories : ''}
                                    </p>
                                    <p className="card-text">Correct Answer: {question.correctAns}</p>
                                    {/* Add other question details as needed */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default FilteredQuestions;
