import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './BookingSummary.scss';

interface BookingSummaryProps {
    movieTitle: string;
    showtime: string;
    selectedSeats: string[];
    onBack: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7101';

export const BookingSummary: React.FC<BookingSummaryProps> = ({
                                                                  movieTitle,
                                                                  showtime,
                                                                  selectedSeats,
                                                                  onBack
                                                              }) => {
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBooking = async () => {
        setIsBooking(true);
        setError(null);

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            };

            // Confirm all bookings that were created in seat selection
            for (const seatId of selectedSeats) {
                // Get the booking ID from localStorage
                const bookingId = localStorage.getItem(`booking_${seatId}`);
                if (!bookingId) {
                    throw new Error(`No booking ID found for seat ${seatId}`);
                }

                // Confirm the booking
                const confirmResponse = await fetch(`${API_BASE_URL}/api/bookings/confirm/${bookingId}`, {
                    method: 'PUT',
                    headers
                });

                if (!confirmResponse.ok) {
                    throw new Error(`Failed to confirm booking for seat ${seatId}`);
                }

                // Clean up localStorage after successful confirmation
                localStorage.removeItem(`booking_${seatId}`);
            }

            // All confirmations successful
            console.log('All bookings confirmed successfully');
            setBookingComplete(true);

        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Failed to complete booking');
        } finally {
            setIsBooking(false);
        }
    };

    if (bookingComplete) {
        return (
            <div className="booking-success">
                <div className="booking-success__container">
                    <div className="booking-success__content">
                        <div className="booking-success__icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                            </svg>
                        </div>

                        <h2 className="booking-success__title">Booking Successful!</h2>

                        <p className="booking-success__movie">{movieTitle}</p>
                        <p className="booking-success__info">
                            {selectedSeats.length} ticket{selectedSeats.length > 1 ? 's' : ''} • {showtime}
                        </p>

                        <div className="booking-success__details">
                            <div className="booking-success__seats">
                                <p className="booking-success__seats-label">Selected seats:</p>
                                <p className="booking-success__seats-list">
                                    {selectedSeats.map(seat =>
                                        `Row: ${Math.floor((parseInt(seat)-1)/5 + 1)}, Seat: ${(parseInt(seat)-1)%5 + 1}`
                                    ).join(' | ')}
                                </p>
                            </div>
                        </div>

                        <div className="booking-success__confirmation">
                            <p>Your booking has been confirmed!</p>
                        </div>

                        <Link to="/" className="booking-success__button">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-summary">
            <div className="booking-summary__container">
                <div className="booking-summary__modal">
                    <div className="booking-summary__header">
                        <h2 className="booking-summary__title">Booking Summary</h2>
                        <p className="booking-summary__subtitle">Please verify your booking details</p>
                        {error && (
                            <p className="booking-summary__error">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="booking-summary__details">
                        <div className="booking-summary__movie-info">
                            <h3 className="booking-summary__movie-title">{movieTitle}</h3>
                            <p className="booking-summary__showtime">{showtime}</p>
                        </div>

                        <div className="booking-summary__divider" />

                        <div className="booking-summary__seats">
                            <div className="booking-summary__seats-header">
                                <span>Selected Seats</span>
                                <span>{selectedSeats.length} tickets</span>
                            </div>
                            <div className="booking-summary__seats-list">
                                {selectedSeats.map((seatId) => (
                                    <div key={seatId} className="booking-summary__seat-item">
                                        <div className="booking-summary__seat-info">
                                            <span className="booking-summary__seat-label">
                                                Row: {Math.floor((parseInt(seatId)-1)/5 + 1)}
                                            </span>
                                            <span className="booking-summary__seat-label">
                                                Seat: {(parseInt(seatId)-1)%5 + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="booking-summary__actions">
                        <button
                            className="booking-summary__button booking-summary__button--back"
                            onClick={onBack}
                            disabled={isBooking}
                        >
                            Modify Selection
                        </button>
                        <button
                            className={`booking-summary__button booking-summary__button--confirm ${isBooking ? 'loading' : ''}`}
                            onClick={handleBooking}
                            disabled={isBooking}
                        >
                            {isBooking ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};