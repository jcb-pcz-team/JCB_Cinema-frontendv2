import { useState } from "react";
import { TableLayout } from "../TableLayout/TableLayout";

interface Ticket {
    id: number;
    movie: string;
    user: string;
    date: string;
    time: string;
    hall: string;
    seat: string;
    status: string;
    price: string;
}

const INITIAL_TICKET_FORM: Omit<Ticket, 'id'> = {
    movie: '',
    user: '',
    date: '',
    time: '',
    hall: '',
    seat: '',
    status: '',
    price: ''
};

export const TicketManagement = () => {
    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: 1,
            movie: 'Inception',
            user: 'john.doe',
            date: '2024-03-20',
            time: '18:00',
            hall: 'Hall 1',
            seat: 'A12',
            status: 'Paid',
            price: '$15.00'
        },
        {
            id: 2,
            movie: 'The Godfather',
            user: 'jane.smith',
            date: '2024-03-21',
            time: '20:30',
            hall: 'Hall 2',
            seat: 'B15',
            status: 'Reserved',
            price: '$12.00'
        },
    ]);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_TICKET_FORM);

    const sortOptions = [
        { value: 'movie', label: 'Movie' },
        { value: 'user', label: 'User' },
        { value: 'date', label: 'Date' },
        { value: 'time', label: 'Time' },
        { value: 'hall', label: 'Hall' },
        { value: 'status', label: 'Status' },
        { value: 'price', label: 'Price' }
    ];

    const handleSearch = (searchTerm: string) => {
        console.log('Searching tickets:', searchTerm);
    };

    const handleSort = (sortBy: string) => {
        console.log('Sorting tickets by:', sortBy);
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
            setTickets(prev => prev.map(ticket =>
                ticket.id === editingId ? { ...formData, id: editingId } : ticket
            ));
        } else {
            const newTicket = {
                ...formData,
                id: tickets.length + 1
            };
            setTickets(prev => [...prev, newTicket]);
        }
        handleCloseForm();
    };

    const handleEdit = (ticket: Ticket) => {
        setFormData(ticket);
        setEditingId(ticket.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        setTickets(prev => prev.filter(ticket => ticket.id !== id));
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_TICKET_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    return (
        <TableLayout
            title="Booking Tickets Management"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={sortOptions}
            onAddNew={handleAddNew}
        >
            {isFormVisible && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Ticket' : 'Add New Ticket'}</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="movie">Movie</label>
                                <input
                                    id="movie"
                                    name="movie"
                                    type="text"
                                    value={formData.movie}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="user">User</label>
                                <input
                                    id="user"
                                    name="user"
                                    type="text"
                                    value={formData.user}
                                    onChange={handleInputChange}
                                    required
                                />
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
                                <label htmlFor="seat">Seat</label>
                                <input
                                    id="seat"
                                    name="seat"
                                    type="text"
                                    value={formData.seat}
                                    onChange={handleInputChange}
                                    required
                                />
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
                                    <option value="Reserved">Reserved</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="text"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="button button--primary">
                                {editingId ? 'Update Ticket' : 'Add Ticket'}
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
                    <th>User</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Hall</th>
                    <th>Seat</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                        <td>{ticket.movie}</td>
                        <td>{ticket.user}</td>
                        <td>{ticket.date}</td>
                        <td>{ticket.time}</td>
                        <td>{ticket.hall}</td>
                        <td>{ticket.seat}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.price}</td>
                        <td>
                            <div className="admin-table__actions">
                                <button
                                    className="button button--edit"
                                    onClick={() => handleEdit(ticket)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button--delete"
                                    onClick={() => handleDelete(ticket.id)}
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