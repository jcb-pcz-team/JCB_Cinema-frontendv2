import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/Button/Button';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { BookingSummary } from '../BookingSummary/BookingSummary';
import "./SeatSelection.scss";

enum SeatStatusEnum {
    Available = 0,
    Reservation = 1,    // Status po POST /api/bookings
    Occupied = 2        // Status po PUT /api/bookings/confirm
}

interface SeatProps {
    id: number;
    row: number;
    number: number;
    status: SeatStatusEnum;
}

interface ApiSeat {
    seatId: number;
    status: number;
}

const ROWS = 5;
const SEATS_PER_ROW = 5;
const SELECTION_TIMEOUT = 5 * 60 * 1000;

// Mock data for development
const mockProjection = {
    movieProjectionId: 1,
    movie: {
        title: "Sample Movie",
        description: "Sample Description",
        duration: 120
    },
    screeningTime: "2024-01-21T20:00:00",
    screenType: "2D",
    cinemaHall: {
        cinemaHallId: 1,
        name: "Hall 1"
    },
    price: {
        ammount: 1500,
        currency: "USD"
    }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7101';

const fetchSeats = async (movieProjectionId: number): Promise<ApiSeat[]> => {
    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/moviesprojection/${movieProjectionId}/seats`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log('API Response:', text);

        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error(`Failed to parse response: ${text.substring(0, 100)}...`);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
};

const transformSeatsData = (seatsData: ApiSeat[]): SeatProps[][] => {
    // Find the starting ID from the API response
    const sortedSeats = [...seatsData].sort((a, b) => a.seatId - b.seatId);
    const startingSeatId = sortedSeats[0]?.seatId || 0;

    const seatRows: SeatProps[][] = [];
    for (let row = 0; row < ROWS; row++) {
        const rowSeats: SeatProps[] = [];
        for (let seatInRow = 0; seatInRow < SEATS_PER_ROW; seatInRow++) {
            const currentSeatId = startingSeatId + (row * SEATS_PER_ROW + seatInRow);
            const apiSeat = seatsData.find(s => s.seatId === currentSeatId);

            rowSeats.push({
                id: currentSeatId,
                row: row + 1,
                number: seatInRow + 1,
                status: apiSeat ? apiSeat.status : SeatStatusEnum.Occupied
            });
        }
        seatRows.push(rowSeats);
    }
    return seatRows;
};

export const SeatSelection: React.FC = () => {
    const { movieTitle } = useParams<{ movieTitle: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { showtime, movieProjectionId } = location.state || {};

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [bookingIds, setBookingIds] = useState<{ [key: number]: string }>({});
    const [showSummary, setShowSummary] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [selectionExpired, setSelectionExpired] = useState(false);

    // Fetch seats using React Query
    const { data: seatsData, error, isLoading, refetch } = useQuery({
        queryKey: ['seats', movieProjectionId],
        queryFn: async () => {
            const seats = await fetchSeats(movieProjectionId);
            // Po pobraniu miejsc, sprawdź które należą do bieżącego użytkownika
            const userBookings = seats.filter(seat => {
                const bookingId = localStorage.getItem(`booking_${seat.seatId}`);
                return bookingId !== null; // Jeśli mamy bookingId w localStorage, to miejsce należy do nas
            });

            // Aktualizuj selectedSeats na podstawie zapisanych rezerwacji
            const userSeatIds = userBookings.map(seat => seat.seatId);
            setSelectedSeats(userSeatIds);

            return seats;
        },
        enabled: !!movieProjectionId,
        staleTime: 0,
        refetchInterval: false,
    });

    const seats = seatsData ? transformSeatsData(seatsData) : [];

    // Timer management
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;

        if (selectedSeats.length > 0 && !showSummary) {
            const startTime = Date.now();
            setTimeRemaining(SELECTION_TIMEOUT);
            setSelectionExpired(false);

            timer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = SELECTION_TIMEOUT - elapsed;

                if (remaining <= 0) {
                    setSelectedSeats([]);
                    setTimeRemaining(null);
                    setSelectionExpired(true);
                    clearInterval(timer);
                } else {
                    setTimeRemaining(remaining);
                }
            }, 1000);
        } else if (selectedSeats.length === 0) {
            setTimeRemaining(null);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [selectedSeats.length, showSummary]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clean up booking IDs from localStorage
            Object.keys(bookingIds).forEach(seatId => {
                localStorage.removeItem(`booking_${seatId}`);
            });
        };
    }, [bookingIds]);

    const handleSeatClick = async (seatId: number) => {
        if (selectionExpired) {
            return;
        }

        try {
            if (selectedSeats.includes(seatId)) {
                // Pobierz ID rezerwacji do usunięcia
                const bookingId = bookingIds[seatId];
                if (bookingId) {
                    // Usuń rezerwację przez DELETE
                    const deleteResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('Failed to delete booking');
                    }
                }

                // Aktualizuj stan lokalny
                setSelectedSeats(prev => prev.filter(id => id !== seatId));
                localStorage.removeItem(`booking_${seatId}`);
                setBookingIds(prev => {
                    const newBookingIds = { ...prev };
                    delete newBookingIds[seatId];
                    return newBookingIds;
                });
                return;
            }

            // Create booking via POST
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    movieProjectionId: movieProjectionId,
                    seatId: seatId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create booking');
            }

            const bookingId = await response.text();
            console.log(`Created booking ID: ${bookingId} for seat: ${seatId}`);

            // Store booking ID
            localStorage.setItem(`booking_${seatId}`, bookingId);
            setBookingIds(prev => ({
                ...prev,
                [seatId]: bookingId
            }));

            setSelectedSeats(prev => [...prev, seatId]);
        } catch (error) {
            console.error('Error creating booking:', error);
            // Handle error (could add error state and display message)
        }
    };

    const formatTime = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatPrice = (amount: number, currency: string): string => {
        return `${(amount / 100).toFixed(2)} ${currency}`;
    };

    const getSeatClassName = (seat: SeatProps): string => {
        // Najpierw sprawdź czy to miejsce należy do bieżącego użytkownika
        const isUserBooking = localStorage.getItem(`booking_${seat.id}`) !== null;

        // Jeśli to miejsce należy do bieżącego użytkownika, pokaż jako wybrane (żółte)
        if (isUserBooking) {
            return 'seat-selection__seat--selected';
        }

        switch (seat.status) {
            case SeatStatusEnum.Available:
                return 'seat-selection__seat--available';
            case SeatStatusEnum.Reservation:
                return 'seat-selection__seat--unavailable';  // szare - w trakcie rezerwacji przez kogoś innego
            case SeatStatusEnum.Occupied:
                return 'seat-selection__seat--reserved';     // czerwone - zajęte na stałe
            default:
                return 'seat-selection__seat--unavailable';
        }
    };

    const isSeatSelectable = (seat: SeatProps): boolean => {
        if (selectionExpired) return false;

        // Miejsce jest wybieralne jeśli:
        // 1. Jest dostępne
        // 2. Należy do bieżącego użytkownika (ma booking w localStorage)
        return seat.status === SeatStatusEnum.Available ||
            localStorage.getItem(`booking_${seat.id}`) !== null;
    };

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

    if (isLoading) {
        return (
            <MainLayout>
                <div className="seat-selection">
                    <div className="seat-selection__container">
                        <p>Loading seats...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="seat-selection">
                    <div className="seat-selection__container">
                        <p className="seat-selection__error">
                            {error instanceof Error ? error.message : 'An error occurred while fetching seats'}
                        </p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                </div>
            </MainLayout>
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
                            <p className="seat-selection__hall-info">
                                Hall: {mockProjection.cinemaHall.name} | Type: {mockProjection.screenType}
                            </p>
                            {timeRemaining !== null && (
                                <p className="seat-selection__timer">
                                    Time remaining: {formatTime(timeRemaining)}
                                </p>
                            )}
                            {selectionExpired && (
                                <p className="seat-selection__expired-message">
                                    Selection time expired. Please make a new selection.
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
                                            onClick={() => isSeatSelectable(seat) && handleSeatClick(seat.id)}
                                            className={`seat-selection__seat ${getSeatClassName(seat)}`}
                                            disabled={!isSeatSelectable(seat)}
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
                            <p className="seat-selection__price">
                                Total: {formatPrice(selectedSeats.length * mockProjection.price.ammount, mockProjection.price.currency)}
                            </p>
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
                            disabled={selectedSeats.length === 0 || selectionExpired}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};