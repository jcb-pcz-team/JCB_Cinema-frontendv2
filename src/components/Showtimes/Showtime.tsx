import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import "./Showtime.scss";

type DayCode = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type ScreeningFormat = 'All' | '2D' | '3D' | 'IMAX' | '4DX';
type Genre = 'All' | 'Action' | 'Drama' | 'Science Fiction' | 'War';

interface Day {
    short: DayCode;
    full: string;
    date: string;
}

interface Movie {
    title: string;
    description: string;
    duration: number;
    genre: {
        genreName: string;
    };
    normalizedTitle: string;
}

interface Screening {
    movieProjectionId: number;
    movie: Movie;
    screeningTime: string;
    screenType: string;
    cinemaHall: {
        name: string;
    };
    price: {
        ammount: number;
        currency: string;
    };
    availableSeats: number;
}

interface ScheduleDay {
    date: string;
    screenings: Screening[];
}

export const Showtime: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedType, setSelectedType] = useState<ScreeningFormat>('All');
    const [selectedGenre, setSelectedGenre] = useState<Genre>('All');

    // Get next 7 days for the calendar
    const days = useMemo((): Day[] => {
        const days: Day[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayCode = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] as DayCode;
            const fullDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

            days.push({
                short: dayCode,
                full: fullDay,
                date: date.toISOString().split('T')[0]
            });
        }
        return days;
    }, []);

    // Fetch schedules using React Query with date range
    const { data: schedules = [], isLoading, error } = useQuery<ScheduleDay[]>({
        queryKey: ['schedules', selectedDay],
        queryFn: async () => {
            const startDate = new Date(selectedDay);
            const endDate = new Date(selectedDay);
            endDate.setDate(endDate.getDate() + 6);

            const dateFrom = startDate.toISOString().split('T')[0];
            const dateTo = endDate.toISOString().split('T')[0];

            const response = await fetch(
                `https://localhost:7101/api/schedules?DateFrom=${dateFrom}&DateTo=${dateTo}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch schedules');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        retry: 2
    });

    const screeningTypes: ScreeningFormat[] = ['All', '2D', '3D', 'IMAX', '4DX'];
    const genres: Genre[] = ['All', 'Action', 'Drama', 'Science Fiction', 'War'];

    // Filter and sort screenings based on selected criteria
    const filteredScreenings = useMemo(() => {
        const daySchedule = schedules.find(schedule => schedule.date === selectedDay);
        if (!daySchedule) return [];

        return daySchedule.screenings
            .filter(screening => {
                const matchesType = selectedType === 'All' || screening.screenType === selectedType;
                const matchesGenre = selectedGenre === 'All' || screening.movie.genre.genreName === selectedGenre;
                return matchesType && matchesGenre;
            })
            .sort((a, b) => new Date(a.screeningTime).getTime() - new Date(b.screeningTime).getTime());
    }, [schedules, selectedDay, selectedType, selectedGenre]);

    const formatPrice = (amount: number, currency: string): string => {
        return `${(amount / 100).toFixed(2)} ${currency}`;
    };

    if (error) {
        return (
            <div className="schedule">
                <div className="schedule__empty-message">
                    Failed to load schedules. Please try again later.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="schedule">
                <div className="schedule__empty-message">
                    Loading schedules...
                </div>
            </div>
        );
    }

    return (
        <section className="schedule">
            <div className="schedule__container">
                <header className="schedule__header">
                    <h2 className="schedule__title">
                        <span className="schedule__title-highlight">S</span>howtimes
                    </h2>

                    <div className="schedule__filters">
                        <div className="schedule__days">
                            {days.map((day) => (
                                <button
                                    key={day.date}
                                    className={`schedule__day-btn ${
                                        selectedDay === day.date ? 'schedule__day-btn--active' : ''
                                    }`}
                                    title={day.full}
                                    onClick={() => setSelectedDay(day.date)}
                                >
                                    {day.short}
                                </button>
                            ))}
                        </div>

                        <div className="schedule__select-group">
                            <select
                                className="schedule__select"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as ScreeningFormat)}
                            >
                                {screeningTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                className="schedule__select"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value as Genre)}
                            >
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <div className="schedule__movie-list">
                    {filteredScreenings.length === 0 ? (
                        <div className="schedule__empty-message">
                            No movies match your selected criteria
                        </div>
                    ) : (
                        filteredScreenings.map((screening) => (
                            <div key={screening.movieProjectionId} className="movie-card">
                                <div className="movie-card__poster">
                                    <Link to={`/movies/${screening.movie.normalizedTitle}`}>
                                        <img
                                            src={`/api/photos/${screening.movie.title}`}
                                            alt={screening.movie.title}
                                        />
                                    </Link>
                                </div>
                                <div className="movie-card__content">
                                    <h2 className="movie-card__title">{screening.movie.title}</h2>
                                    <div className="movie-card__info">
                                        {screening.movie.genre.genreName} | {screening.movie.duration} min
                                    </div>
                                    <div className="movie-card__format">
                                        {screening.screenType} | {screening.cinemaHall.name} |
                                        Available seats: {screening.availableSeats}
                                    </div>
                                    <div className="movie-card__showtimes">
                                        <Link
                                            to={`/booking/${encodeURIComponent(screening.movie.title)}`}
                                            className="movie-card__time-btn"
                                            state={{
                                                showtime: new Date(screening.screeningTime).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }),
                                                movieProjectionId: screening.movieProjectionId
                                            }}
                                        >
                                            {new Date(screening.screeningTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};