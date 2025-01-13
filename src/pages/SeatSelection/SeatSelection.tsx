import React, { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import './SeatSelection.scss';

interface SeatProps {
    id: string;
    row: number;
    number: number;
    isAvailable: boolean;
}

export const SeatSelection: React.FC<{
    movieTitle?: string;
    showtime?: string;
}> = ({
          movieTitle = "Movie Title",
          showtime = "14:30"
      }) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const generateSeats = () => {

        const unavailableSeats = new Set(['2-5', '2-6', '3-10', '3-11', '4-15', '4-16']);

        const seats: SeatProps[][] = [];

        seats.push(Array(15).fill(null).map((_, idx) => ({
            id: `1-${idx + 1}`,
            row: 1,
            number: idx + 1,
            isAvailable: !unavailableSeats.has(`1-${idx + 1}`)
        })));

        for (let row = 2; row <= 16; row++) {
            const rowSeats: SeatProps[] = [];
            for (let seat = 1; seat <= 28; seat++) {
                const seatId = `${row}-${seat}`;
                rowSeats.push({
                    id: seatId,
                    row,
                    number: seat,
                    isAvailable: !unavailableSeats.has(seatId)
                });
            }
            seats.push(rowSeats);
        }
        return seats;
    };

    const handleSeatClick = (seatId: string) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }
            return [...prev, seatId];
        });
    };

    const seats = generateSeats();

    return (
        <MainLayout>
            <div className="seat-selection">
                <div className="seat-selection__container">
                    <div className="seat-selection__header">
                        <div className="seat-selection__title-section">
                            <h1 className="seat-selection__movie-title">{movieTitle}</h1>
                            <p className="seat-selection__showtime">Showtime: {showtime}</p>
                        </div>
                    </div>

                    <div className="seat-selection__screen-container">
                        <div className="seat-selection__screen">
                            <span>SCREEN</span>
                        </div>
                    </div>

                    <div className="seat-selection__hall">
                        {seats.map((row, rowIndex) => (
                            <div key={rowIndex} className="seat-selection__row">
                                <span className="seat-selection__row-number">{rowIndex + 1}</span>
                                <div className="seat-selection__seats">
                                    {row.map((seat) => (
                                        <button
                                            key={seat.id}
                                            onClick={() => seat.isAvailable && handleSeatClick(seat.id)}
                                            className={`seat-selection__seat ${
                                                selectedSeats.includes(seat.id)
                                                    ? 'seat-selection__seat--selected'
                                                    : seat.isAvailable
                                                        ? 'seat-selection__seat--available'
                                                        : 'seat-selection__seat--unavailable'
                                            }`}
                                            disabled={!seat.isAvailable}
                                        >
                                            <span className="seat-selection__seat-number">{seat.number}</span>
                                        </button>
                                    ))}
                                </div>
                                <span className="seat-selection__row-number">{rowIndex + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="seat-selection__info">
                        <div className="seat-selection__legend">
                            <div className="seat-selection__legend-item">
                                <div className="seat-selection__legend-box seat-selection__legend-box--available"></div>
                                <span>Available</span>
                            </div>
                            <div className="seat-selection__legend-item">
                                <div className="seat-selection__legend-box seat-selection__legend-box--selected"></div>
                                <span>Selected</span>
                            </div>
                            <div className="seat-selection__legend-item">
                                <div className="seat-selection__legend-box seat-selection__legend-box--unavailable"></div>
                                <span>Unavailable</span>
                            </div>
                        </div>

                        <div className="seat-selection__summary">
                            <p className="seat-selection__count">Selected seats: {selectedSeats.length}</p>
                            <p className="seat-selection__price">Total: ${selectedSeats.length * 12}</p>
                        </div>
                    </div>

                    <div className="seat-selection__actions">
                        <Button
                            className="seat-selection__button seat-selection__button--back"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </Button>
                        <Button
                            className="seat-selection__button seat-selection__button--next"
                            onClick={() => {/* Handle confirmation */}}
                            disabled={selectedSeats.length === 0}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};