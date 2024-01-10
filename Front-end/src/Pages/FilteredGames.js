// /src/pages/FilteredGames.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/FilteredGames.css';
import Header from '../Components/Header';

const FilteredGames = () => {
    const [formData, setFormData] = useState({
        categoryId: '',
        difficulty: '',
        startTime: '',
        duration: '',
    });

    const [games, setGames] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/filteredgames',
                formData
            );

            setGames(response.data.response);
        } catch (error) {
            console.error('Error fetching filtered games:', error.message);
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
            <div className="filter-games-form">
                <h2>Filter Games</h2>
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
                    <div className="form-group">
                        <label htmlFor="startTime">Start Time:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Filter
                    </button>
                </form>
            </div>
            {games.length > 0 && (
                <div className="games-container">
                    <h2>Filtered Games</h2>
                    <div className="card-container">
                        {games.map((game) => (
                            <div key={game.gameId} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Game ID: {game.gameId}</h5>
                                    <p className="card-text">Category ID: {game.categoryId}</p>
                                    <p className="card-text">Category Name: {game.categoryName}</p>
                                    <p className="card-text">Difficulty: {game.difficulty}</p>
                                    <p className="card-text">Start Time: {game.startTime}</p>
                                    <p className="card-text">Duration: {game.duration}</p>
                                    {/* Add other game details as needed */}
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

export default FilteredGames;
