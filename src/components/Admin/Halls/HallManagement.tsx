import { useState } from "react";
import { TableLayout } from "../TableLayout/TableLayout";

interface SortOption {
    value: string;
    label: string;
}

interface Hall {
    id: number;
    name: string;
    capacity: number;
    type: string;
    status: string;
    facilities: string;
}

const INITIAL_HALL_FORM: Omit<Hall, 'id'> = {
    name: '',
    capacity: 0,
    type: '',
    status: '',
    facilities: ''
};

export const HallManagement = () => {
    const [halls, setHalls] = useState<Hall[]>([
        {
            id: 1,
            name: 'Hall 1',
            capacity: 150,
            type: '3D',
            status: 'Active',
            facilities: 'Wheelchair access'
        },
        {
            id: 2,
            name: 'Hall 2',
            capacity: 200,
            type: 'IMAX',
            status: 'Active',
            facilities: 'VIP seats'
        },
    ]);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_HALL_FORM);

    const sortOptions: SortOption[] = [
        { value: 'name', label: 'Name' },
        { value: 'capacity', label: 'Capacity' },
        { value: 'type', label: 'Type' },
        { value: 'status', label: 'Status' }
    ];

    const handleSearch = (searchTerm: string) => {
        console.log('Searching halls:', searchTerm);
    };

    const handleSort = (sortBy: string) => {
        console.log('Sorting halls by:', sortBy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setHalls(prev => prev.map(hall =>
                hall.id === editingId ? { ...formData, id: editingId } : hall
            ));
        } else {
            const newHall = {
                ...formData,
                id: halls.length + 1
            };
            setHalls(prev => [...prev, newHall]);
        }
        handleCloseForm();
    };

    const handleEdit = (hall: Hall) => {
        setFormData(hall);
        setEditingId(hall.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        setHalls(prev => prev.filter(hall => hall.id !== id));
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_HALL_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    return (
        <TableLayout
            title="Cinema Halls Management"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={sortOptions}
            onAddNew={handleAddNew}
        >
            {isFormVisible && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Hall' : 'Add New Hall'}</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="capacity">Capacity</label>
                                <input
                                    id="capacity"
                                    name="capacity"
                                    type="number"
                                    value={formData.capacity}
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
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="facilities">Facilities</label>
                                <input
                                    id="facilities"
                                    name="facilities"
                                    type="text"
                                    value={formData.facilities}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="button button--primary">
                                {editingId ? 'Update Hall' : 'Add Hall'}
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
                    <th>Name</th>
                    <th>Capacity</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Facilities</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {halls.map((hall) => (
                    <tr key={hall.id}>
                        <td>{hall.name}</td>
                        <td>{hall.capacity}</td>
                        <td>{hall.type}</td>
                        <td>{hall.status}</td>
                        <td>{hall.facilities}</td>
                        <td>
                            <div className="admin-table__actions">
                                <button
                                    className="button button--edit"
                                    onClick={() => handleEdit(hall)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button--delete"
                                    onClick={() => handleDelete(hall.id)}
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