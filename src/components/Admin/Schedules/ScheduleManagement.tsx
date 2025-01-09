import {useMemo, useState} from "react";
import { TableLayout } from "../TableLayout/TableLayout";
import { useQuery } from "@tanstack/react-query";

interface Movie {
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: {
        genreId: number;
        genreName: string;
    };
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

interface Screening {
    movieProjectionId: number;
    movie: Movie;
    screeningTime: string;
    screenType: string;
    cinemaHall: CinemaHall;
    normalizedMovieTitle: string;
    price: Price;
    occupiedSeats: number;
    availableSeats: number;
}

interface ScheduleDay {
    date: string;
    screenings: Screening[];
}

interface Schedule {
    id: number;
    date: string;
    hall: string;
    movieTitle: string;
    startTime: string;
    endTime: string;
    numberOfScreenings: number;
    availableSeats: number;
    status: string;
}

const INITIAL_SCHEDULE_FORM: Omit<Schedule, 'id'> = {
    date: '',
    hall: '',
    movieTitle: '',
    startTime: '',
    endTime: '',
    numberOfScreenings: 0,
    availableSeats: 0,
    status: ''
};

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

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

        // Handle numeric values
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return (aValue - bValue) * multiplier;
        }

        // Handle string values
        return String(aValue).localeCompare(String(bValue)) * multiplier;
    });
};

const api = {
    fetchSchedules: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('https://localhost:7101/api/schedules', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch schedules');

        const data: ScheduleDay[] = await response.json();

        // Transform the data into the format expected by the table
        const transformedSchedules: Schedule[] = data.flatMap((day) => {
            return day.screenings.map(screening => ({
                id: screening.movieProjectionId,
                date: day.date,
                hall: screening.cinemaHall.name,
                movieTitle: screening.movie.title,
                startTime: new Date(screening.screeningTime).toLocaleTimeString(),
                endTime: calculateEndTime(screening.screeningTime, screening.movie.duration),
                numberOfScreenings: day.screenings.length,
                availableSeats: screening.availableSeats,
                status: screening.availableSeats > 0 ? 'Available' : 'Fully Booked'
            }));
        });

        return transformedSchedules;
    }
};

const calculateEndTime = (startTime: string, duration: number): string => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000); // Convert minutes to milliseconds
    return end.toLocaleTimeString();
};

export const ScheduleManagement = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState(INITIAL_SCHEDULE_FORM);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const { data: schedules = [], isLoading, error } = useQuery({
        queryKey: ['schedules'],
        queryFn: api.fetchSchedules
    });

    const filteredSchedules = useMemo(() => {
        if (!searchTerm) return schedules;

        const searchStr = searchTerm.toLowerCase();
        return schedules.filter(schedule =>
            schedule.date.toLowerCase().includes(searchStr) ||
            schedule.hall.toLowerCase().includes(searchStr) ||
            schedule.movieTitle.toLowerCase().includes(searchStr) ||
            schedule.startTime.toLowerCase().includes(searchStr) ||
            schedule.endTime.toLowerCase().includes(searchStr) ||
            schedule.availableSeats.toString().includes(searchStr) ||
            schedule.status.toLowerCase().includes(searchStr)
        );
    }, [schedules, searchTerm]);

    const sortedSchedules = useMemo(() =>
            sortItems(filteredSchedules, sortConfig),
        [filteredSchedules, sortConfig]
    );

    const sortOptions = [
        { value: 'date', label: 'Date' },
        { value: 'hall', label: 'Hall' },
        { value: 'movieTitle', label: 'Movie Title' },
        { value: 'startTime', label: 'Start Time' },
        { value: 'availableSeats', label: 'Available Seats' },
        { value: 'status', label: 'Status' }
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['numberOfScreenings', 'availableSeats'].includes(name) ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            // Update logic here
        } else {
            // Add logic here
        }
        handleCloseForm();
    };

    const handleEdit = (schedule: Schedule) => {
        setFormData(schedule);
        setEditingId(schedule.id);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        // Delete logic here
        console.log('Deleting schedule:', id);
    };

    const handleCloseForm = () => {
        setFormData(INITIAL_SCHEDULE_FORM);
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
                                <label htmlFor="movieTitle">Movie Title</label>
                                <input
                                    id="movieTitle"
                                    name="movieTitle"
                                    type="text"
                                    value={formData.movieTitle}
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
                                    <option value="Hall A">Hall A</option>
                                    <option value="Hall B">Hall B</option>
                                    <option value="Hall C">Hall C</option>
                                    <option value="Hall D">Hall D</option>
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
                                    <option value="Available">Available</option>
                                    <option value="Fully Booked">Fully Booked</option>
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
                    <th onClick={() => handleSort('date')}>
                        Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('movieTitle')}>
                        Movie Title {sortConfig?.key === 'movieTitle' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('hall')}>
                        Hall {sortConfig?.key === 'hall' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('startTime')}>
                        Start Time {sortConfig?.key === 'startTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('endTime')}>
                        End Time {sortConfig?.key === 'endTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('availableSeats')}>
                        Available
                        Seats {sortConfig?.key === 'availableSeats' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('status')}>
                        Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                        <td>{schedule.date}</td>
                        <td>{schedule.movieTitle}</td>
                        <td>{schedule.hall}</td>
                        <td>{schedule.startTime}</td>
                        <td>{schedule.endTime}</td>
                        <td>{schedule.availableSeats}</td>
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
                {sortedSchedules.length === 0 && (
                    <tr>
                        <td colSpan={8} style={{textAlign: 'center'}}>
                            No schedules found{searchTerm ? ` matching "${searchTerm}"` : ''}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </TableLayout>
    );
};