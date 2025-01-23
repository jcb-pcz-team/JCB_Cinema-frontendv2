import React, { useState, useMemo } from 'react';
import { TableLayout } from '../TableLayout/TableLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sortItems, type SortConfig } from '../../../utils/sorting';

interface Movie {
    id: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: {
        genreId: number;
        genreName: string;
    };
    posterUrl?: string;
}

interface MovieFormData {
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: string;
    posterDescription: string;
    posterFile?: File;
}

const INITIAL_FORM_STATE: MovieFormData = {
    title: '',
    description: '',
    duration: 120,
    releaseDate: new Date().toISOString().split('T')[0],
    genre: '',
    posterDescription: '',
};

const api = {
    fetchMovies: async (): Promise<Movie[]> => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('https://localhost:7101/api/movies', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        return await response.json();
    },

    addMovie: async (formData: MovieFormData): Promise<void> => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const movieData = {
            Title: formData.title,
            Description: formData.description,
            Duration: formData.duration,
            ReleaseDate: formData.releaseDate,
            Genre: formData.genre
        };

        if (formData.posterFile) {
            const posterFormData = new FormData();
            posterFormData.append('File', formData.posterFile);
            posterFormData.append('Description', formData.posterDescription);
            posterFormData.append('Title', formData.title);

            const posterResponse = await fetch('https://localhost:7101/api/photos/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: posterFormData
            });

            if (!posterResponse.ok) {
                throw new Error('Failed to upload poster image');
            }
        }

        const movieResponse = await fetch('https://localhost:7101/api/movies', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });

        if (!movieResponse.ok) {
            const errorData = await movieResponse.json();
            throw new Error(errorData.message || 'Failed to add movie');
        }

    },


    deleteMovie: async (title: string): Promise<void> => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const normalizedTitle = title.toLowerCase().replace(/\s+/g, '-');
        const response = await fetch(`https://localhost:7101/api/movies/delete/${encodeURIComponent(normalizedTitle)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete movie');
        }
    }
};

export const MovieManagement: React.FC = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState<MovieFormData>(INITIAL_FORM_STATE);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const queryClient = useQueryClient();

    const { data: movies = [], isLoading, error } = useQuery({
        queryKey: ['movies'],
        queryFn: api.fetchMovies
    });

    const addMovieMutation = useMutation({
        mutationFn: api.addMovie,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            setIsFormVisible(false);
            setFormData(INITIAL_FORM_STATE);
            alert('Movie added successfully!');
        },
        onError: (error: Error) => {
            alert(error.message);
        }
    });

    const deleteMovieMutation = useMutation({
        mutationFn: api.deleteMovie,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            alert('Movie deleted successfully!');
        }
    });

    const filteredMovies = useMemo(() => {
        if (!searchTerm) return movies;
        const searchLower = searchTerm.toLowerCase();
        return movies.filter(movie =>
            movie.title.toLowerCase().includes(searchLower) ||
            movie.description.toLowerCase().includes(searchLower) ||
            movie.genre.genreName.toLowerCase().includes(searchLower)
        );
    }, [movies, searchTerm]);

    const sortedMovies = useMemo(() =>
            sortItems(filteredMovies, sortConfig),
        [filteredMovies, sortConfig]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        addMovieMutation.mutate(formData);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' ? parseInt(value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                posterFile: file
            }));
        }
    };

    const handleDelete = (title: string) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            deleteMovieMutation.mutate(title);
        }
    };

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (!current || current.key !== key) {
                return { key, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return null;
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <TableLayout
            title="Movies Management"
            onSearch={setSearchTerm}
            onSort={handleSort}
            sortOptions={[
                { value: 'title', label: 'Title' },
                { value: 'releaseDate', label: 'Release Date' },
                { value: 'genre', label: 'Genre' },
                { value: 'duration', label: 'Duration' }
            ]}
            onAddNew={() => setIsFormVisible(true)}
        >
            {isFormVisible && (
                <div className="form-container">
                    <h3>Add New Movie</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration (minutes)</label>
                                <input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="releaseDate">Release Date</label>
                                <input
                                    id="releaseDate"
                                    name="releaseDate"
                                    type="date"
                                    value={formData.releaseDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="genre">Genre</label>
                                <select
                                    id="genre"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select genre</option>
                                    <option value="Action">Action</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Thriller">Thriller</option>
                                    <option value="Science Fiction">Science Fiction</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Animation">Animation</option>
                                    <option value="War">War</option>
                                    <option value="Spy">Spy</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="posterDescription">Poster Description</label>
                                <textarea
                                    id="posterDescription"
                                    name="posterDescription"
                                    value={formData.posterDescription}
                                    onChange={handleInputChange}
                                    required={!!formData.posterFile}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="posterFile">Poster Image</label>
                                <input
                                    id="posterFile"
                                    name="posterFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button
                                type="button"
                                className="button button--secondary"
                                onClick={() => setIsFormVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button button--primary"
                                disabled={addMovieMutation.isPending}
                            >
                                {addMovieMutation.isPending ? 'Adding...' : 'Add Movie'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('title')}>
                            Title {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Description</th>
                        <th onClick={() => handleSort('duration')}>
                            Duration {sortConfig?.key === 'duration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('releaseDate')}>
                            Release Date {sortConfig?.key === 'releaseDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('genre')}>
                            Genre {sortConfig?.key === 'genre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedMovies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.title}</td>
                            <td>{movie.description}</td>
                            <td>{movie.duration} min</td>
                            <td>{movie.releaseDate}</td>
                            <td>{movie.genre.genreName}</td>
                            <td>
                                <div className="admin-table__actions">
                                    <button
                                        className="button button--delete"
                                        onClick={() => handleDelete(movie.title)}
                                        disabled={deleteMovieMutation.isPending}
                                    >
                                        {deleteMovieMutation.isPending ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {sortedMovies.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>
                                No movies found{searchTerm ? ` matching "${searchTerm}"` : ''}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </TableLayout>
    );
};