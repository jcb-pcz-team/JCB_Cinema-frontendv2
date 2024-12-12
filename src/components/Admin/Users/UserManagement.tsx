import { useState } from "react";
import { TableLayout } from "../TableLayout/TableLayout";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    registrationDate: string;
    status: string;
    lastLogin: string;
}

const INITIAL_USER_FORM: Omit<User, 'id' | 'registrationDate' | 'lastLogin'> = {
    username: '',
    email: '',
    role: '',
    status: ''
};

interface SortOption {
    value: string;
    label: string;
}

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            username: 'john.doe',
            email: 'john@example.com',
            role: 'User',
            registrationDate: '2024-01-15',
            status: 'Active',
            lastLogin: '2024-03-19'
        },
        {
            id: 2,
            username: 'admin.user',
            email: 'admin@example.com',
            role: 'Admin',
            registrationDate: '2023-12-01',
            status: 'Active',
            lastLogin: '2024-03-20'
        },
    ]);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_USER_FORM);

    const sortOptions: SortOption[] = [
        { value: 'username', label: 'Username' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'registrationDate', label: 'Registration Date' },
        { value: 'status', label: 'Status' },
        { value: 'lastLogin', label: 'Last Login' }
    ];

    const handleSearch = (searchTerm: string) => {
        console.log('Searching users:', searchTerm);
    };

    const handleSort = (sortBy: string) => {
        console.log('Sorting users by:', sortBy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setUsers(prev => prev.map(user =>
                user.id === editingId ? {
                    ...formData,
                    id: editingId,
                    registrationDate: user.registrationDate,
                    lastLogin: user.lastLogin
                } : user
            ));
        } else {
            const newUser = {
                ...formData,
                id: users.length + 1,
                registrationDate: new Date().toISOString().split('T')[0],
                lastLogin: '-'
            };
            setUsers(prev => [...prev, newUser]);
        }
        handleCloseForm();
    };

    const handleEdit = (user: User) => {
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        });
        setEditingId(user.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        setUsers(prev => prev.filter(user => user.id !== id));
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_USER_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    return (
        <TableLayout
            title="User Management"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={sortOptions}
            onAddNew={handleAddNew}
        >
            {isFormVisible && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
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
                                    <option value="Blocked">Blocked</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="button button--primary">
                                {editingId ? 'Update User' : 'Add User'}
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.registrationDate}</td>
                        <td>{user.status}</td>
                        <td>{user.lastLogin}</td>
                        <td>
                            <div className="admin-table__actions">
                                <button
                                    className="button button--edit"
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button--delete"
                                    onClick={() => handleDelete(user.id)}
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