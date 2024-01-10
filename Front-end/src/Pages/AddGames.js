// /src/pages/AddGames.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddGames.css';
import Header from '../Components/Header';

const AddGames = () => {
    const [formData, setFormData] = useState({
        questions: '',
        difficulty: 'easy',
        categoryId: '',
        startTime: '',
        participants: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let estimatedTime;
            if (formData.difficulty === 'easy') {
                estimatedTime = formData.questions.length * 10;
            } else if (formData.difficulty === 'medium') {
                estimatedTime = formData.questions.length * 20;
            } else if (formData.difficulty === 'hard') {
                estimatedTime = formData.questions.length * 30;
            }

            const response = await axios.post(
                'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/games',
                {
                    questions: formData.questions.split(',').map((question) => question.trim()),
                    difficulty: formData.difficulty,
                    categoryId: formData.categoryId,
                    startTime: formData.startTime,
                    participants: formData.participants,
                }
            );

            const gamesId = response.data.gamesId;
            console.log('New game ID:', gamesId);
            // Add any further handling for success here (e.g., show a success message)
        } catch (error) {
            console.error('Error adding game:', error.message);
            // Add any error handling here (e.g., show an error message)
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
            <div className="add-games-form">
                <h2>Add Game</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="questions">Questions (comma-separated IDs):</label>
                        <input
                            type="text"
                            className="form-control"
                            id="questions"
                            name="questions"
                            value={formData.questions}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="difficulty">Difficulty:</label>
                        <select
                            className="form-control"
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryId">Category ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startTime">Start Time:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Add Game
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default AddGames;
