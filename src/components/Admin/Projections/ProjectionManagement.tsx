/**
 * Movie projection management module
 * Handles scheduling and management of movie screenings
 * @module ProjectionManagement
 */
import React, { useState, useMemo } from 'react';
import { TableLayout } from "../TableLayout/TableLayout";
import { useMutation, useQuery } from '@tanstack/react-query';
import { sortItems, type SortConfig } from '../../../utils/sorting.ts';

/**
 * Movie genre data structure
 * @interface
 * @property {number} genreId - Unique identifier of the genre
 * @property {string} genreName - Name of the genre
 */
interface Genre {
    genreId: number;
    genreName: string;
}

/**
 * Movie data structure for projections
 * @interface
 * @property {number} movieId - Unique identifier of the movie
 * @property {string} title - Movie title
 * @property {string} description - Movie description
 * @property {number} duration - Movie duration in minutes
 * @property {string} releaseDate - Release date
 * @property {Genre} genre - Movie genre information
 * @property {string} normalizedTitle - Normalized version of the title
 * @property {string} release - Release information
 */
interface Movie {
    movieId: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: Genre;
    normalizedTitle: string;
    release: string;
}

interface CinemaHall {
    cinemaHallId: number;
    name: string;
}

interface Price {
    ammount: number;
    currency: string;
}

interface ProjectionResponse {
    movie: Movie;
    screeningTime: string;
    screenType: string;
    cinemaHall: CinemaHall;
    normalizedMovieTitle: string;
    price: Price;
    occupiedSeats: number;
    availableSeats: number;
}

/**
 * API validation error structure
 * @interface
 * @property {string} type - Error type
 * @property {string} title - Error title
 * @property {number} status - HTTP status code
 * @property {Record<string, string[]>} errors - Validation errors by field
 * @property {string} traceId - Trace ID for debugging
 */
interface ApiValidationError {
    type: string;
    title: string;
    status: number;
    errors: Record<string, string[]>;
    traceId: string;
}

interface Projection {
    id: number;
    movie: string;
    hall: string;
    date: string;
    time: string;
    type: string;
    availableSeats: number;
    normalizedMovieTitle: string;
    cinemaHallId: number;
}

const INITIAL_PROJECTION_FORM: Omit<Projection, 'id'> = {
    movie: '',
    hall: '',
    date: '',
    time: '',
    type: '',
    availableSeats: 0,
    normalizedMovieTitle: '',
    cinemaHallId: 0
};

const fetchMovies = async (): Promise<Movie[]> => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('https://localhost:7101/api/movies', {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    return response.json();
};

const fetchProjections = async (): Promise<Projection[]> => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('https://localhost:7101/api/moviesprojection', {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch projections');
    }

    const data: ProjectionResponse[] = await response.json();

    return data.map((item, index) => {
        const screeningDateTime = new Date(item.screeningTime);
        const date = screeningDateTime.toISOString().split('T')[0];
        const time = screeningDateTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return {
            id: index,
            movie: item.movie.title,
            hall: item.cinemaHall.name,
            date: date,
            time: time,
            type: item.screenType,
            availableSeats: item.availableSeats,
            normalizedMovieTitle: item.normalizedMovieTitle,
            cinemaHallId: item.cinemaHall.cinemaHallId
        };
    });
};

const api = {
    /**
     * Adds a new movie projection
     * @async
     * @param {Object} projectionData - Projection data
     * @param {string} projectionData.screeningTime - Screening time in ISO format
     * @param {string} projectionData.screenType - Type of screening
     * @param {number} projectionData.cinemaHallId - ID of the cinema hall
     * @param {string} projectionData.movieNormalizedTitle - Normalized movie title
     * @throws {Error} When validation fails or creation fails
     */
    addProjection: async (projectionData: {
        screeningTime: string;
        screenType: string;
        cinemaHallId: number;
        movieNormalizedTitle: string;  // Ensure correct casing
    }) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        try {
            // Convert the data to match API expectations
            const apiData = {
                screeningTime: projectionData.screeningTime,
                screenType: projectionData.screenType,
                cinemaHallId: projectionData.cinemaHallId,
                movieNormalizedTitle: projectionData.movieNormalizedTitle // Ensure correct casing
            };

            console.log('Sending data to API:', JSON.stringify(apiData, null, 2));

            const response = await fetch('https://localhost:7101/api/moviesprojection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });

            const responseData = await response.json() as ApiValidationError;
            console.log('API Response:', responseData);

            if (!response.ok) {
                if (responseData.errors && typeof responseData.errors === 'object') {
                    const validationErrors = Object.entries(responseData.errors)
                        .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
                        .join('\n');
                    throw new Error(`Validation errors:\n${validationErrors}`);
                }
                throw new Error(responseData.title || 'Failed to add projection');
            }

            return responseData;
        } catch (error) {
            console.error('API Error details:', error);
            throw error;
        }
    }
};

/**
 * Movie projection management component
 * Provides interface for creating and managing movie projections
 * @component
 */
export const ProjectionManagement = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_PROJECTION_FORM);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: movies = [] } = useQuery({
        queryKey: ['movies'],
        queryFn: fetchMovies,
    });

    const { data: projections = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['projections'],
        queryFn: fetchProjections,
    });

    const filteredProjections = useMemo(() => {
        if (!searchTerm) return projections;

        return projections.filter(projection => {
            const searchStr = searchTerm.toLowerCase();
            return (
                projection.movie.toLowerCase().includes(searchStr) ||
                projection.hall.toLowerCase().includes(searchStr) ||
                projection.date.includes(searchStr) ||
                projection.time.toLowerCase().includes(searchStr) ||
                projection.type.toLowerCase().includes(searchStr) ||
                projection.availableSeats.toString().includes(searchStr)
            );
        });
    }, [projections, searchTerm]);

    const sortedProjections = sortItems(filteredProjections, sortConfig);

    const handleSort = (sortKey: string) => {
        setSortConfig(current => {
            if (!current || current.key !== sortKey) {
                return { key: sortKey, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key: sortKey, direction: 'desc' };
            }
            return null;
        });
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'availableSeats' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            console.log('Editing projection:', { ...formData, id: editingId });
        } else {
            try {
                const selectedMovie = movies.find(m => m.title === formData.movie);
                const hall = projections.find(p => p.hall === formData.hall);

                if (!selectedMovie || !hall) {
                    alert('Invalid movie or hall selection');
                    return;
                }

                const localDate = new Date(`${formData.date}T${formData.time}`);
                const utcDate = new Date(Date.UTC(
                    localDate.getFullYear(),
                    localDate.getMonth(),
                    localDate.getDate(),
                    localDate.getHours(),
                    localDate.getMinutes()
                ));

                // Ensure correct field names and casing
                const projectionData = {
                    screeningTime: utcDate.toISOString(),
                    screenType: formData.type,
                    cinemaHallId: hall.cinemaHallId,
                    movieNormalizedTitle: selectedMovie.normalizedTitle // Ensure correct casing
                };

                console.log('Prepared projection data:', projectionData);
                addProjectionMutation.mutate(projectionData);
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Error preparing projection data. Check console for details.');
            }
        }
    };

    const handleEdit = (projection: Projection) => {
        setFormData(projection);
        setEditingId(projection.id);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this projection?')) {
            console.log('Deleting projection:', id);
            await refetch();
        }
    };

    const addProjectionMutation = useMutation({
        mutationFn: api.addProjection,
        onSuccess: (data) => {
            console.log('Mutation success response:', data);
            refetch();
            handleCloseForm();
            alert('Projection added successfully!');
        },
        onError: (error: Error) => {
            console.error('Mutation error:', error);
            alert(error.message);
        }
    });

    const handleCloseForm = () => {
        setFormData(INITIAL_PROJECTION_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {(error as Error).message}</div>;
    }

    return (
        <TableLayout
            title="Movie Projections Management"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={[
                { value: 'movie', label: 'Movie' },
                { value: 'hall', label: 'Hall' },
                { value: 'date', label: 'Date' },
                { value: 'time', label: 'Time' },
                { value: 'type', label: 'Type' },
                { value: 'availableSeats', label: 'Available Seats' }
            ]}
            onAddNew={handleAddNew}
        >
            {isFormVisible && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Projection' : 'Add New Projection'}</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="movie">Movie</label>
                                <select
                                    id="movie"
                                    name="movie"
                                    value={formData.movie}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select movie</option>
                                    {movies.map(movie => (
                                        <option key={movie.movieId} value={movie.title}>
                                            {movie.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="hall">Hall</label>
                                <select
                                    id="hall"
                                    name="hall"
                                    value={formData.hall}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select hall</option>
                                    {Array.from(new Set(projections.map(p => p.hall))).map(hall => (
                                        <option key={hall} value={hall}>
                                            {hall}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">Time</label>
                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select type</option>
                                    {Array.from(new Set(projections.map(p => p.type))).map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="availableSeats">Available Seats</label>
                                <input
                                    id="availableSeats"
                                    name="availableSeats"
                                    type="number"
                                    min="0"
                                    value={formData.availableSeats}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="button button--primary">
                                {editingId ? 'Update Projection' : 'Add Projection'}
                            </button>
                            <button
                                type="button"
                                className="button button--secondary"
                                onClick={handleCloseForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <table className="admin-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort('movie')} style={{cursor: 'pointer'}}>
                        Movie {sortConfig?.key === 'movie' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('hall')} style={{cursor: 'pointer'}}>
                        Hall {sortConfig?.key === 'hall' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('date')} style={{cursor: 'pointer'}}>
                        Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('time')} style={{cursor: 'pointer'}}>
                        Time {sortConfig?.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('type')} style={{cursor: 'pointer'}}>
                        Type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('availableSeats')} style={{cursor: 'pointer'}}>
                        Available Seats {sortConfig?.key === 'availableSeats' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedProjections.map((projection) => (
                    <tr key={projection.id}>
                        <td>{projection.movie}</td>
                        <td>{projection.hall}</td>
                        <td>{projection.date}</td>
                        <td>{projection.time}</td>
                        <td>{projection.type}</td>
                        <td>{projection.availableSeats}</td>
                        <td>
                            <div className="admin-table__actions">
                                <button
                                    className="button button--edit"
                                    onClick={() => handleEdit(projection)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button--delete"
                                    onClick={() => handleDelete(projection.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {sortedProjections.length === 0 && (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center' }}>
                            No projections found{searchTerm ? ` matching "${searchTerm}"` : ''}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </TableLayout>
    );
};