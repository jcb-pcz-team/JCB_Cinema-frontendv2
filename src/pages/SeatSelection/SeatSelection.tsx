/**
 * @fileoverview Komponent do wyboru miejsc w sali kinowej.
 */

import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/Button/Button';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { BookingSummary } from '../BookingSummary/BookingSummary';
import "./SeatSelection.scss";

/**
 * Enum reprezentujący możliwe statusy miejsca
 * @enum {number}
 */
enum SeatStatusEnum {
    Available = 0,
    Occupied = 1,
    Reservation = 2
}

/**
 * Interfejs statusu miejsca z API
 * @interface SeatStatus
 */
interface SeatStatus {
    seatId: number;
    status: number;
}

/**
 * Interfejs projekcji filmu z API
 * @interface MovieProjection
 */
interface MovieProjection {
    movieProjectionId: number;
    movie: {
        title: string;
        description: string;
        duration: number;
    };
    screeningTime: string;
    screenType: string;
    cinemaHall: {
        cinemaHallId: number;
        name: string;
    };
    price: {
        ammount: number;
        currency: string;
    };
}

/**
 * Props dla pojedynczego miejsca
 * @interface SeatProps
 */
interface SeatProps {
    id: number;
    row: number;
    number: number;
    status: SeatStatusEnum;
}

// Stałe konfiguracyjne
const BASE_SEAT_ID = 350; // ID początkowe z API
const ROWS = 5;
const SEATS_PER_ROW = 5;

export const SeatSelection: React.FC = () => {
    const { movieTitle } = useParams<{ movieTitle: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { showtime, movieProjectionId } = location.state || {};

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [showSummary, setShowSummary] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login', { state: { from: location.pathname } });
            throw new Error('Not authenticated');
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Fetch seats status
    const { data: seatsStatus = [], error: seatsError } = useQuery<SeatStatus[]>({
        queryKey: ['seats', movieProjectionId],
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(`https://localhost:7101/api/moviesprojection/${movieProjectionId}/seats`, {
                    headers
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login', { state: { from: location.pathname } });
                        throw new Error('Not authenticated');
                    }
                    throw new Error('Failed to fetch seats');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching seats:', error);
                throw error;
            }
        },
        enabled: !!movieProjectionId,
        retry: false
    });

    // Fetch movie projection details
    const { data: projection, error: projectionError } = useQuery<MovieProjection>({
        queryKey: ['projection', movieProjectionId],
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(`https://localhost:7101/api/moviesprojection/${movieProjectionId}`, {
                    headers
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login', { state: { from: location.pathname } });
                        throw new Error('Not authenticated');
                    }
                    throw new Error('Failed to fetch projection');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching projection:', error);
                throw error;
            }
        },
        enabled: !!movieProjectionId,
        retry: false
    });

    // Generate seats layout
    const seats = useMemo(() => {
        const seatRows: SeatProps[][] = [];

        for (let row = 0; row < ROWS; row++) {
            const rowSeats: SeatProps[] = [];
            for (let seatInRow = 0; seatInRow < SEATS_PER_ROW; seatInRow++) {
                const seatId = BASE_SEAT_ID + (row * SEATS_PER_ROW + seatInRow + 1);
                const seatStatus = seatsStatus.find(s => s.seatId === seatId);

                rowSeats.push({
                    id: seatId,
                    row: row + 1,
                    number: seatInRow + 1,
                    status: seatStatus?.status ?? SeatStatusEnum.Available // Domyślnie miejsce jest dostępne
                });
            }
            seatRows.push(rowSeats);
        }
        return seatRows;
    }, [seatsStatus]);

    const handleSeatClick = (seatId: number) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }
            return [...prev, seatId];
        });
    };

    const formatPrice = (amount: number, currency: string): string => {
        return `${(amount / 100).toFixed(2)} ${currency}`;
    };

    const getSeatClassName = (seat: SeatProps, isSelected: boolean): string => {
        if (isSelected) return 'seat-selection__seat--selected';

        switch (seat.status) {
            case SeatStatusEnum.Available:
                return 'seat-selection__seat--available';
            case SeatStatusEnum.Reservation:
                return 'seat-selection__seat--reserved';
            case SeatStatusEnum.Occupied:
            default:
                return 'seat-selection__seat--unavailable';
        }
    };

    // Handle authentication errors
    const authError = (seatsError || projectionError)?.message?.includes('Not authenticated');
    if (authError) {
        return (
            <MainLayout>
                <div className="seat-selection">
                    <div className="seat-selection__container">
                        <div className="seat-selection__error">
                            <h2>Authentication Required</h2>
                            <p>Please log in to view and book seats.</p>
                            <Button
                                className="seat-selection__button seat-selection__button--login"
                                onClick={() => navigate('/login', { state: { from: location.pathname } })}
                            >
                                Go to Login
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (showSummary) {
        return (
            <BookingSummary
                movieTitle={decodeURIComponent(movieTitle || '')}
                showtime={showtime}
                selectedSeats={selectedSeats.map(String)}
                movieProjectionId={movieProjectionId}
                onBack={() => setShowSummary(false)}
            />
        );
    }

    return (
        <MainLayout>
            <div className="seat-selection">
                <div className="seat-selection__container">
                    <div className="seat-selection__header">
                        <div className="seat-selection__title-section">
                            <h1 className="seat-selection__movie-title">
                                {decodeURIComponent(movieTitle || '')}
                            </h1>
                            <p className="seat-selection__showtime">
                                Showtime: {new Date(showtime).toLocaleString()}
                            </p>
                            {projection && (
                                <p className="seat-selection__hall-info">
                                    Hall: {projection.cinemaHall.name} | Type: {projection.screenType}
                                </p>
                            )}
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
                                            onClick={() => seat.status === SeatStatusEnum.Available && handleSeatClick(seat.id)}
                                            className={`seat-selection__seat ${getSeatClassName(seat, selectedSeats.includes(seat.id))}`}
                                            disabled={seat.status !== SeatStatusEnum.Available}
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
                                <div className="seat-selection__legend-box seat-selection__legend-box--reserved"></div>
                                <span>Reserved</span>
                            </div>
                            <div className="seat-selection__legend-item">
                                <div className="seat-selection__legend-box seat-selection__legend-box--unavailable"></div>
                                <span>Occupied</span>
                            </div>
                        </div>

                        <div className="seat-selection__summary">
                            <p className="seat-selection__count">Selected seats: {selectedSeats.length}</p>
                            {projection && (
                                <p className="seat-selection__price">
                                    Total: {formatPrice(selectedSeats.length * projection.price.ammount, projection.price.currency)}
                                </p>
                            )}
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
                            onClick={() => setShowSummary(true)}
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