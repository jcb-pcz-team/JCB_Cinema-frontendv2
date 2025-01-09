import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    phoneNumber: number;
    dialCode: string;
}

interface Booking {
    movieTitle: string;
    screenType: string;
    screenignTime: string;
    cienemaHall: string;
    seatNumber: number;
    bookingURL: string;
}

const api = {
    fetchUser: async (login: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`https://localhost:7101/api/users?Login=${encodeURIComponent(login)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('User not found');
        }

        const data = await response.json();
        return data;
    },

    fetchBookings: async (login: string, email: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`https://localhost:7101/api/bookings?Login=${encodeURIComponent(login)}&Email=${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        return data;
    },

    updateUserDetails: async (userData: {
        login: string;
        firstName: string;
        lastName: string;
        street: string;
        houseNumber: string;
        phoneNumber: string;
        dialCode: string;
    }) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        try {
            const url = new URL('https://localhost:7101/api/users');

            url.searchParams.append('Login', userData.login);
            url.searchParams.append('FirstName', userData.firstName);
            url.searchParams.append('LastName', userData.lastName);
            url.searchParams.append('Street', userData.street);
            url.searchParams.append('HouseNumber', userData.houseNumber);
            url.searchParams.append('PhoneNumber', userData.phoneNumber);
            url.searchParams.append('DialCode', userData.dialCode);

            const response = await fetch(url.toString(), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(errorText || 'Failed to update user details');
            }

            const responseText = await response.text();
            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Update user details error:', error);
            throw error;
        }
    },

    updateUserEmail: async (currentEmail: string, newEmail: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        try {
            const response = await fetch('https://localhost:7101/api/users/change-email', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CurrentEmail: currentEmail,
                    NewEmail: newEmail
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Failed to update email');
                } catch (e) {
                    throw new Error('Failed to update email');
                }
            }

            const responseData = await response.text();
            return responseData ? JSON.parse(responseData) : null;
        } catch (error) {
            console.error('Update email error:', error);
            throw error;
        }
    },
    updateBooking: async (bookingData: {
        bookingTicketId: number;
        movieProjectionId: number;
        seatId: number;
    }) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('https://localhost:7101/api/bookings', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                BookingTicketId: bookingData.bookingTicketId,
                MovieProjectionId: bookingData.movieProjectionId,
                SeatId: bookingData.seatId
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update booking');
        }

        return response.json();
    }
};

export const UserManagement = () => {
    const queryClient = useQueryClient();
    const [searchUsername, setSearchUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});
    const [editingBooking, setEditingBooking] = useState<{
        bookingTicketId: number;
        movieProjectionId: number;
        seatId: number;
    } | null>(null);

    const { data: currentUser, error: searchError, isLoading, refetch } = useQuery({
        queryKey: ['user', searchUsername],
        queryFn: () => api.fetchUser(searchUsername),
        enabled: false,
        retry: false
    });

    const { data: bookings = [] as Booking[], isLoading: isLoadingBookings } = useQuery({
        queryKey: ['bookings', currentUser?.login],
        queryFn: () => api.fetchBookings(currentUser!.login, currentUser!.email),
        enabled: !!currentUser,
    });

    const updateBookingMutation = useMutation({
        mutationFn: api.updateBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings', currentUser?.login] });
            setEditingBooking(null);
            alert('Booking updated successfully!');
        },
        onError: (error: Error) => {
            alert(error.message);
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleEditUser = () => {
        if (currentUser) {
            setEditForm(currentUser);
            setIsEditing(true);
        }
    };

    const updateUserDetailsMutation = useMutation({
        mutationFn: api.updateUserDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', searchUsername] });
            setIsEditing(false);
            alert('User details updated successfully!');
        },
        onError: (error: Error) => {
            console.error('Mutation error:', error);
            alert(error.message);
        }
    });

    const updateUserEmailMutation = useMutation({
        mutationFn: ({ currentEmail, newEmail }: { currentEmail: string; newEmail: string }) =>
            api.updateUserEmail(currentEmail, newEmail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', searchUsername] });
            alert('Email updated successfully!');
        },
        onError: (error: Error) => {
            alert(error.message);
        }
    });

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!currentUser) return;

            if (editForm.email && editForm.email !== currentUser.email) {
                await updateUserEmailMutation.mutateAsync({
                    currentEmail: currentUser.email,
                    newEmail: editForm.email
                });
            }

            const updateData = {
                login: searchUsername, // używamy searchUsername zamiast currentUser.login
                firstName: editForm.firstName || currentUser.firstName,
                lastName: editForm.lastName || currentUser.lastName,
                street: editForm.street || currentUser.street,
                houseNumber: editForm.houseNumber || currentUser.houseNumber,
                phoneNumber: editForm.phoneNumber?.toString() || currentUser.phoneNumber.toString(),
                dialCode: editForm.dialCode || currentUser.dialCode
            };

            await updateUserDetailsMutation.mutateAsync(updateData);

            queryClient.invalidateQueries({ queryKey: ['user', searchUsername] });
            setIsEditing(false);
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleEditBooking = (booking: Booking) => {
        const bookingId = parseInt(booking.bookingURL.split('/').pop() || '0');
        setEditingBooking({
            bookingTicketId: bookingId,
            movieProjectionId: bookingId,
            seatId: booking.seatNumber
        });
    };

    const handleUpdateBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBooking) {
            updateBookingMutation.mutate(editingBooking);
        }
    };

    return (
        <div className="user-management">
            <div className="search-section">
                <h2>Find User</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button button--primary">
                        Search
                    </button>
                </form>
                {searchError && <p className="error-message">User not found or an error occurred</p>}
                {isLoading && <p>Searching...</p>}
            </div>

            {currentUser && !isEditing && (
                <>
                    <div className="user-details">
                        <h3>User Details</h3>
                        <div className="user-info">
                            <p><strong>Username:</strong> {currentUser.login}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
                            <p><strong>First Name:</strong> {currentUser.firstName}</p>
                            <p><strong>Last Name:</strong> {currentUser.lastName}</p>
                            <p><strong>Street:</strong> {currentUser.street}</p>
                            <p><strong>House Number:</strong> {currentUser.houseNumber}</p>
                            <p><strong>Phone:</strong> {currentUser.dialCode} {currentUser.phoneNumber}</p>
                        </div>
                    </div>

                    {bookings.length > 0 && (
                        <div className="bookings-section">
                            <h3>User Bookings</h3>
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>Movie</th>
                                    <th>Screen Type</th>
                                    <th>Date & Time</th>
                                    <th>Hall</th>
                                    <th>Seat Number</th>
                                    <th>Reference</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bookings.map((booking: Booking) => {
                                    const screeningDate = new Date(booking.screenignTime);
                                    const formattedDate = screeningDate.toLocaleDateString();
                                    const formattedTime = screeningDate.toLocaleTimeString();
                                    const bookingId = booking.bookingURL.split('/').pop();

                                    return (
                                        <tr key={booking.bookingURL}>
                                            <td>{booking.movieTitle}</td>
                                            <td>{booking.screenType}</td>
                                            <td>{formattedDate} {formattedTime}</td>
                                            <td>{booking.cienemaHall}</td>
                                            <td>{booking.seatNumber}</td>
                                            <td>{bookingId}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            {isLoadingBookings && <p>Loading bookings...</p>}
                        </div>
                    )}
                </>
            )}

            {isEditing && (
                <div className="edit-form">
                    <h3>Edit User</h3>
                    <form onSubmit={handleUpdateUser}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="edit-email">Email</label>
                                <input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-firstName">First Name</label>
                                <input
                                    id="edit-firstName"
                                    type="text"
                                    value={editForm.firstName || ''}
                                    onChange={(e) => setEditForm(prev => ({
                                        ...prev,
                                        firstName: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-lastName">Last Name</label>
                                <input
                                    id="edit-lastName"
                                    type="text"
                                    value={editForm.lastName || ''}
                                    onChange={(e) => setEditForm(prev => ({
                                        ...prev,
                                        lastName: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-street">Street</label>
                                <input
                                    id="edit-street"
                                    type="text"
                                    value={editForm.street || ''}
                                    onChange={(e) => setEditForm(prev => ({
                                        ...prev,
                                        street: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-houseNumber">House Number</label>
                                <input
                                    id="edit-houseNumber"
                                    type="text"
                                    value={editForm.houseNumber || ''}
                                    onChange={(e) => setEditForm(prev => ({
                                        ...prev,
                                        houseNumber: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-phoneNumber">Phone Number</label>
                                <div className="phone-input">
                                    <select
                                        value={editForm.dialCode || ''}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            dialCode: e.target.value
                                        }))}
                                    >
                                        <option value="+48">+48</option>
                                    </select>
                                    <input
                                        id="edit-phoneNumber"
                                        type="number"
                                        value={editForm.phoneNumber || ''}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            phoneNumber: Number(e.target.value)
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button
                                type="submit"
                                className="button button--primary"
                                disabled={updateUserDetailsMutation.isPending} // Zmień z updateUserMutation na updateUserDetailsMutation
                            >
                                {updateUserDetailsMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className="button button--secondary"
                                onClick={() => setIsEditing(false)}
                                disabled={updateUserDetailsMutation.isPending} // Zmień z updateUserMutation na updateUserDetailsMutation
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                    {(updateUserDetailsMutation.isError || updateUserEmailMutation.isError) && ( // Zmień z updateUserMutation na updateUserDetailsMutation
                        <p className="error-message">Error updating user data. Please try again.</p>
                    )}
                </div>
            )}

            {isEditing && (
                <div className="edit-form">
                    {/* ... existing user edit form code ... */}
                </div>
            )}

            {editingBooking && (
                <div className="modal">
                <div className="modal-content">
                        <h3>Edit Booking</h3>
                        <form onSubmit={handleUpdateBooking}>
                            <div className="form-group">
                                <label htmlFor="movieProjectionId">Movie Projection ID:</label>
                                <input
                                    type="number"
                                    id="movieProjectionId"
                                    value={editingBooking.movieProjectionId}
                                    onChange={(e) => setEditingBooking(prev => ({
                                        ...prev!,
                                        movieProjectionId: parseInt(e.target.value)
                                    }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="seatId">Seat ID:</label>
                                <input
                                    type="number"
                                    id="seatId"
                                    value={editingBooking.seatId}
                                    onChange={(e) => setEditingBooking(prev => ({
                                        ...prev!,
                                        seatId: parseInt(e.target.value)
                                    }))}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button
                                    type="submit"
                                    className="button button--primary"
                                    disabled={updateBookingMutation.isPending}
                                >
                                    {updateBookingMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="button button--secondary"
                                    onClick={() => setEditingBooking(null)}
                                    disabled={updateBookingMutation.isPending}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};