/**
 * @fileoverview Komponent podsumowania rezerwacji biletów.
 */

import React, { useState } from 'react';
import './BookingSummary.scss';

/**
 * Props dla komponentu BookingSummary
 * @interface BookingSummaryProps
 */
interface BookingSummaryProps {
    /** Tytuł filmu */
    movieTitle: string;
    /** Czas seansu */
    showtime: string;
    /** Lista wybranych miejsc */
    selectedSeats: string[];
    /** ID projekcji filmu */
    movieProjectionId: number;
    /** Callback powrotu do poprzedniego widoku */
    onBack: () => void;
    /** Opcjonalny callback powrotu do strony głównej */
    onHome?: () => void;
}

/**
 * Komponent podsumowania rezerwacji
 * @component
 * @param {BookingSummaryProps} props - Props komponentu
 * @returns {JSX.Element} Komponent podsumowania rezerwacji
 */

export const BookingSummary: React.FC<BookingSummaryProps> = ({
                                                                  movieTitle,
                                                                  showtime,
                                                                  selectedSeats,
                                                                  movieProjectionId,
                                                                  onBack,
                                                                  onHome = () => {}
                                                              }) => {
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Pobiera nagłówki autoryzacji
     * @returns {Object} Nagłówki z tokenem autoryzacji
     * @throws {Error} Błąd gdy użytkownik nie jest zalogowany
     */

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    /**
     * Obsługuje proces rezerwacji miejsc
     * @async
     */

    const handleBooking = async () => {
        setIsBooking(true);
        setError(null);

        try {
            const headers = getAuthHeaders();

            // Create bookings for each selected seat
            const bookingPromises = selectedSeats.map(async (seatId) => {
                const bookingData = {
                    movieProjectionId: Number(movieProjectionId),
                    seatId: Number(seatId)
                };

                console.log('Creating booking with data:', bookingData);

                const bookingResponse = await fetch('https://localhost:7101/api/bookings', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(bookingData)
                });

                if (!bookingResponse.ok) {
                    const errorText = await bookingResponse.text();
                    console.error('Booking creation failed:', errorText);
                    throw new Error(`Failed to create booking for seat ${seatId}. Server response: ${errorText}`);
                }

                const booking = await bookingResponse.json();
                console.log('Booking created successfully:', booking);
                return booking;
            });

            const bookings = await Promise.all(bookingPromises);
            console.log('All bookings created:', bookings);

            // Confirm each booking
            const confirmPromises = bookings.map(async (booking) => {
                console.log('Confirming booking:', booking.bookingId);
                const confirmResponse = await fetch(`https://localhost:7101/api/bookings/confirm/${booking.bookingId}`, {
                    method: 'POST',
                    headers
                });

                if (!confirmResponse.ok) {
                    const errorText = await confirmResponse.text();
                    console.error('Booking confirmation failed:', errorText);
                    throw new Error(`Failed to confirm booking ${booking.bookingId}. Server response: ${errorText}`);
                }

                console.log('Booking confirmed successfully:', booking.bookingId);
            });

            await Promise.all(confirmPromises);
            console.log('All bookings confirmed successfully');

            setBookingComplete(true);
        } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Failed to complete booking');
            if (err instanceof Error && err.message.includes('Not authenticated')) {
                setError('Please log in to complete your booking');
            }
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
                                    {selectedSeats.map(seat => `Row: ${Math.floor((parseInt(seat)-1)/5 + 1)}, Seat: ${(parseInt(seat)-1)%5 + 1}`).join(' | ')}
                                </p>
                            </div>
                        </div>

                        <div className="booking-success__confirmation">
                            <p>Your booking has been confirmed!</p>
                        </div>

                        <button className="booking-success__button" onClick={onHome}>
                            Return to Home
                        </button>
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
                            <p className="booking-summary__error" style={{ color: 'red', marginTop: '10px' }}>
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