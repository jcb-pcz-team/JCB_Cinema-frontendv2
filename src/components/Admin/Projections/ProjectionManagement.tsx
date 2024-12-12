import React, { useState } from 'react';
import { TableLayout } from "../TableLayout/TableLayout";

interface SortOption {
    value: string;
    label: string;
}

interface Projection {
    id: number;
    movie: string;
    hall: string;
    date: string;
    time: string;
    type: string;
    availableSeats: number;
}

const INITIAL_PROJECTION_FORM: Omit<Projection, 'id'> = {
    movie: '',
    hall: '',
    date: '',
    time: '',
    type: '',
    availableSeats: 0
};

export const ProjectionManagement = () => {
    const [projections, setProjections] = useState<Projection[]>([
        {
            id: 1,
            movie: 'Inception',
            hall: 'Hall 1',
            date: '2024-03-20',
            time: '18:00',
            type: '3D',
            availableSeats: 120
        }
    ]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_PROJECTION_FORM);

    const sortOptions: SortOption[] = [
        { value: 'movie', label: 'Movie' },
        { value: 'hall', label: 'Hall' },
        { value: 'date', label: 'Date' },
        { value: 'time', label: 'Time' },
        { value: 'type', label: 'Type' },
        { value: 'availableSeats', label: 'Available Seats' }
    ];

    const handleSearch = (searchTerm: string) => {
        console.log('Searching projections:', searchTerm);
    };

    const handleSort = (sortBy: string) => {
        console.log('Sorting projections by:', sortBy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'availableSeats' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setProjections(prev => prev.map(projection =>
                projection.id === editingId ? { ...formData, id: editingId } : projection
            ));
        } else {
            const newProjection = {
                ...formData,
                id: projections.length + 1
            };
            setProjections(prev => [...prev, newProjection]);
        }
        handleCloseForm();
    };

    const handleEdit = (projection: Projection) => {
        setFormData(projection);
        setEditingId(projection.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        setProjections(prev => prev.filter(projection => projection.id !== id));
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_PROJECTION_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    return (
        <TableLayout
            title="Movie Projections Management"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={sortOptions}
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
                                    <option value="Inception">Inception</option>
                                    <option value="The Godfather">The Godfather</option>
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
                                    <option value="Hall 1">Hall 1</option>
                                    <option value="Hall 2">Hall 2</option>
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
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="availableSeats">Available Seats</label>
                                <input
                                    id="availableSeats"
                                    name="availableSeats"
                                    type="number"
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
                    <th>Movie</th>
                    <th>Hall</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Available Seats</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {projections.map((projection) => (
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
                </tbody>
            </table>
        </TableLayout>
    );
};