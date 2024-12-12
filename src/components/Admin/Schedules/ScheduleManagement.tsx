import { useState } from "react";
import { TableLayout } from "../TableLayout/TableLayout";

interface Schedule {
    id: number;
    date: string;
    hall: string;
    startTime: string;
    endTime: string;
    numberOfScreenings: number;
    status: string;
}

const INITIAL_SCHEDULE_FORM: Omit<Schedule, 'id'> = {
    date: '',
    hall: '',
    startTime: '',
    endTime: '',
    numberOfScreenings: 0,
    status: ''
};

export const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: 1,
            date: '2024-03-20',
            hall: 'Hall 1',
            startTime: '09:00',
            endTime: '23:00',
            numberOfScreenings: 6,
            status: 'Published'
        },
        {
            id: 2,
            date: '2024-03-21',
            hall: 'Hall 2',
            startTime: '10:00',
            endTime: '22:00',
            numberOfScreenings: 5,
            status: 'Draft'
        },
    ]);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_SCHEDULE_FORM);

    const sortOptions = [
        { value: 'date', label: 'Date' },
        { value: 'hall', label: 'Hall' },
        { value: 'startTime', label: 'Start Time' },
        { value: 'numberOfScreenings', label: 'Screenings' },
        { value: 'status', label: 'Status' }
    ];

    const handleSearch = (searchTerm: string) => {
        console.log('Searching schedules:', searchTerm);
    };

    const handleSort = (sortBy: string) => {
        console.log('Sorting schedules by:', sortBy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'numberOfScreenings' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setSchedules(prev => prev.map(schedule =>
                schedule.id === editingId ? { ...formData, id: editingId } : schedule
            ));
        } else {
            const newSchedule = {
                ...formData,
                id: schedules.length + 1
            };
            setSchedules(prev => [...prev, newSchedule]);
        }
        handleCloseForm();
    };

    const handleEdit = (schedule: Schedule) => {
        setFormData(schedule);
        setEditingId(schedule.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_SCHEDULE_FORM);
        setEditingId(null);
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        setIsFormVisible(true);
    };

    return (
        <TableLayout
            title="Schedules Management"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={sortOptions}
            onAddNew={handleAddNew}
        >
            {isFormVisible && (
                <div className="form-container">
                    <h3>{editingId ? 'Edit Schedule' : 'Add New Schedule'}</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
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
                                <label htmlFor="startTime">Start Time</label>
                                <input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endTime">End Time</label>
                                <input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="numberOfScreenings">Number of Screenings</label>
                                <input
                                    id="numberOfScreenings"
                                    name="numberOfScreenings"
                                    type="number"
                                    value={formData.numberOfScreenings}
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
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="button button--primary">
                                {editingId ? 'Update Schedule' : 'Add Schedule'}
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
                    <th>Date</th>
                    <th>Hall</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Screenings</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                        <td>{schedule.date}</td>
                        <td>{schedule.hall}</td>
                        <td>{schedule.startTime}</td>
                        <td>{schedule.endTime}</td>
                        <td>{schedule.numberOfScreenings}</td>
                        <td>{schedule.status}</td>
                        <td>
                            <div className="admin-table__actions">
                                <button
                                    className="button button--edit"
                                    onClick={() => handleEdit(schedule)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button button--delete"
                                    onClick={() => handleDelete(schedule.id)}
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