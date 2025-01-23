import { useState } from "react";
import { TableLayout } from "../TableLayout/TableLayout";

/**
 * Represents a ticket with all its details
 */
interface Ticket {
    /** Unique identifier for the ticket */
    id: number;
    /** Movie title */
    movie: string;
    /** Username of the ticket owner */
    user: string;
    /** Date of the movie screening */
    date: string;
    /** Time of the movie screening */
    time: string;
    /** Cinema hall for the screening */
    hall: string;
    /** Seat number */
    seat: string;
    /** Current status of the ticket (e.g., Paid, Reserved) */
    status: string;
    /** Price of the ticket */
    price: string;
}

/**
 * Initial form state for creating or editing a ticket
 * Omits the 'id' field as it's auto-generated
 */
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


/**
 * Ticket Management component for administering movie tickets
 *
 * @returns A React component for managing ticket bookings
 */
export const TicketManagement = () => {

    /**
     * State to store the list of tickets
     * Initialized with some sample tickets
     */
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

    /**
     * Handles searching through tickets
     * @param searchTerm - The search query entered by the user
     */
    const handleSearch = (searchTerm: string) => {
        console.log('Searching tickets:', searchTerm);
    };

    /**
     * Handles sorting tickets
     * @param sortBy - The field to sort tickets by
     */
    const handleSort = (sortBy: string) => {
        console.log('Sorting tickets by:', sortBy);
    };


    /**
     * Handles input changes in the ticket form
     * @param e - The input change event
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Submits the ticket form, either adding a new ticket or updating an existing one
     * @param e - The form submission event
     */
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

    /**
     * Prepares a ticket for editing
     * @param ticket - The ticket to be edited
     */
    const handleEdit = (ticket: Ticket) => {
        setFormData(ticket);
        setEditingId(ticket.id);
        setIsFormVisible(true);
    };

    /**
     * Deletes a ticket from the list
     * @param id - The ID of the ticket to delete
     */
    const handleDelete = (id: number) => {
        setTickets(prev => prev.filter(ticket => ticket.id !== id));
    };

    /** Closes the ticket form and resets form state */
    const handleCloseForm = () => {
        setFormData(INITIAL_TICKET_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    /** Opens the form for adding a new ticket */
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