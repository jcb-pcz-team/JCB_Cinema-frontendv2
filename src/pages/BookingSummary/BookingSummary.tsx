import React, { useState } from 'react';
import './BookingSummary.scss';

interface BookingSummaryProps {
    movieTitle: string;
    showtime: string;
    selectedSeats: string[];
    onBack: () => void;
    onHome?: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
                                                                  movieTitle,
                                                                  showtime,
                                                                  selectedSeats,
                                                                  onBack,
                                                                  onHome = () => {}
                                                              }) => {
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    const seatPrice = 12;
    const totalPrice = selectedSeats.length * seatPrice;

    const handleBooking = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            setBookingComplete(true);
        }, 1500);
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
                                    {selectedSeats.map(seat => `Row: ${seat.charAt(0)}, Seat: ${seat.slice(1)}`).join(' | ')}
                                </p>
                            </div>

                            <div className="booking-success__price">
                                <span>Total paid:</span>
                                <span className="booking-success__price-amount">${totalPrice}</span>
                            </div>
                        </div>

                        <div className="booking-success__confirmation">
                            <p>You can find your tickets in your profile</p>
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
                                            <span className="booking-summary__seat-label">Row: {seatId.charAt(0)}</span>
                                            <span className="booking-summary__seat-label">Seat: {seatId.slice(1)}</span>
                                        </div>
                                        <span className="booking-summary__seat-price">${seatPrice}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="booking-summary__total">
                            <span className="booking-summary__total-label">Total</span>
                            <span className="booking-summary__total-amount">${totalPrice}</span>
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