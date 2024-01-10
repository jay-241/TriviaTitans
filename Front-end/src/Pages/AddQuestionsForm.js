// /src/pages/AddQuestionsForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddQuestionsForm.css';
import Header from '../Components/Header';

const AddQuestionsForm = () => {
    const [subject, setSubject] = useState('');
    const [options, setOptions] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [categories, setCategories] = useState('');
    const [correctAns, setCorrectAns] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/questions',
                {
                    subject,
                    options: options.split(',').map((option) => option.trim()),
                    difficulty,
                    categories: categories.split(',').map((category) => category.trim()),
                    correctAns,
                }
            );
            const questionsId = response.data.QuestionsId;
            console.log('New questions ID:', questionsId);
            // Add any further handling for success here (e.g., show a success message)
        } catch (error) {
            console.error('Error adding questions:', error.message);
            // Add any error handling here (e.g., show an error message)
        }
    };

    return (
        <>
        <Header/>
        <div className="container mt-4 add-questions-form">
            <div className="form-header">
                <h2>Add Questions</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="options">Options (comma-separated):</label>
                    <input
                        type="text"
                        className="form-control"
                        id="options"
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="difficulty">Difficulty:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categories">Categories (comma-separated):</label>
                    <input
                        type="text"
                        className="form-control"
                        id="categories"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="correctAns">Correct Answer:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="correctAns"
                        value={correctAns}
                        onChange={(e) => setCorrectAns(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Questions
                </button>
            </form>
        </div>
        </>
    );
};

export default AddQuestionsForm;
