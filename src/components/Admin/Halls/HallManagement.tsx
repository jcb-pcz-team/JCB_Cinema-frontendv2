import { useState, useMemo } from "react";
import { TableLayout } from "../TableLayout/TableLayout";
import { useQuery } from "@tanstack/react-query";

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

interface Hall {
    id: number;
    name: string;
}

interface HallResponse {
    cinemaHallId: number;
    name: string;
}

const INITIAL_HALL_FORM: Omit<Hall, 'id'> = {
    name: ''
};

const sortItems = <T extends Record<string, any>>(
    items: T[],
    config: SortConfig | null
): T[] => {
    if (!config) return items;

    return [...items].sort((a, b) => {
        const aValue = a[config.key];
        const bValue = b[config.key];

        if (aValue === bValue) return 0;

        const multiplier = config.direction === 'asc' ? 1 : -1;
        return String(aValue).localeCompare(String(bValue)) * multiplier;
    });
};

const api = {
    fetchHalls: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('https://localhost:7101/api/cinemahalls', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch halls');

        const data: HallResponse[] = await response.json();
        return data.map(hall => ({
            id: hall.cinemaHallId,
            name: hall.name
        }));
    }
};

export const HallManagement = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_HALL_FORM);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const { data: halls = [], isLoading, error } = useQuery({
        queryKey: ['halls'],
        queryFn: api.fetchHalls
    });

    const filteredHalls = useMemo(() => {
        if (!searchTerm) return halls;

        const searchStr = searchTerm.toLowerCase();
        return halls.filter(hall =>
            hall.name.toLowerCase().includes(searchStr)
        );
    }, [halls, searchTerm]);

    const sortedHalls = useMemo(() =>
            sortItems(filteredHalls, sortConfig),
        [filteredHalls, sortConfig]
    );

    const sortOptions = [
        { value: 'name', label: 'Name' }
    ];

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const handleSort = (sortKey: string) => {
        setSortConfig((current: SortConfig | null) => {
            if (!current || current.key !== sortKey) {
                return { key: sortKey, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key: sortKey, direction: 'desc' };
            }
            return null;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            console.log('Updating hall:', editingId, formData);
        } else {
            console.log('Adding new hall:', formData);
        }
        handleCloseForm();
    };

    const handleEdit = (hall: Hall) => {
        setFormData(hall);
        setEditingId(hall.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        console.log('Deleting hall:', id);
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_HALL_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

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
                    <th onClick={() => handleSort('name')}>
                        Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedHalls.map((hall) => (
                    <tr key={hall.id}>
                        <td>{hall.name}</td>
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
                {sortedHalls.length === 0 && (
                    <tr>
                        <td colSpan={2} style={{textAlign: 'center'}}>
                            No halls found{searchTerm ? ` matching "${searchTerm}"` : ''}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </TableLayout>
    );
};