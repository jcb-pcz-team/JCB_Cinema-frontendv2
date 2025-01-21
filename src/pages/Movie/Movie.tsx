/**
 * @file Movie.tsx
 * @description React component that displays detailed information about a movie and its screening schedule.
 * The component includes movie details, poster, and an interactive schedule for booking tickets.
 */

import "./Movie.scss";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Button } from "../../components/Button/Button";
import { MainLayout } from "../../layouts/MainLayout/MainLayout";

/**
 * @interface Genre
 * @description Represents a movie genre with its identifier and name
 */
interface Genre {
    /** Unique identifier for the genre */
    genreId: number;
    /** Name of the genre */
    genreName: string;
}

/**
 * @interface Movie
 * @description Represents detailed information about a movie
 */
interface Movie {
    /** Title of the movie */
    title: string;
    /** Detailed description or synopsis of the movie */
    description: string;
    /** Duration of the movie in minutes */
    duration: number;
    /** Release date of the movie */
    releaseDate: string;
    /** Genre information of the movie */
    genre: Genre;
    /** URL-friendly version of the movie title */
    normalizedTitle: string;
    /** Release status or information */
    release: string;
}

/**
 * @interface Screening
 * @description Represents a single movie screening event with all related information
 */
interface Screening {
    /** Unique identifier for the movie projection */
    movieProjectionId: number;
    /** Movie details for this screening */
    movie: Movie;
    /** Date and time of the screening */
    screeningTime: string;
    /** Type of screen/projection (e.g., "2D", "3D", "IMAX") */
    screenType: string;
    /** Information about the cinema hall */
    cinemaHall: {
        /** Name or identifier of the cinema hall */
        name: string;
    };
    /** Price information for the screening */
    price: {
        /** Price amount */
        ammount: number;
        /** Currency code */
        currency: string;
    };
    /** Number of seats still available for booking */
    availableSeats: number;
}

/**
 * @interface ScheduleDay
 * @description Represents a day in the screening schedule
 */
interface ScheduleDay {
    /** Date of the schedule */
    date: string;
    /** Array of screenings scheduled for this day */
    screenings: Screening[];
}

/**
 * @typedef {string} DayCode
 * @description Three-letter code representing days of the week
 */
type DayCode = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
interface Day {
    short: DayCode;
    full: string;
    date: string;
}

/**
 * @function Movie
 * @description Main component for displaying movie details and screening schedule
 * @component
 *
 * @returns {JSX.Element} Rendered movie details page with schedule
 *
 * @example
 * ```tsx
 * <Movie />
 * ```
 */
export const Movie: React.FC = () => {
    const { title } = useParams<{ title: string }>();
    const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split('T')[0]);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const showtimesRef = useRef<HTMLDivElement>(null);

    const scrollToShowtimes = () => {
        showtimesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch movie details
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://localhost:7101/api/movies/${encodeURIComponent(title || '')}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch movie data.");
                }
                const data: Movie = await response.json();
                setMovie(data);
            } catch (err: any) {
                setError(err.message || "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        if (title) {
            fetchMovie();
        }
    }, [title]);

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

    // Fetch schedules
    const { data: schedules = [], isLoadingSchedules } = useQuery<ScheduleDay[]>({
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
                throw new Error('Failed to fetch schedules');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000
    });

    // Filter screenings for this movie
    const filteredScreenings = useMemo(() => {
        const daySchedule = schedules.find(schedule => schedule.date === selectedDay);
        if (!daySchedule) return [];

        return daySchedule.screenings
            .filter(screening => screening.movie.normalizedTitle === title)
            .sort((a, b) => new Date(a.screeningTime).getTime() - new Date(b.screeningTime).getTime());
    }, [schedules, selectedDay, title]);

    /**
     * @function fetchImage
     * @description Attempts to fetch movie poster image using different path formats
     * @param {string} movieTitle - Original movie title
     * @param {string} normalizedTitle - URL-friendly version of the title
     * @returns {Promise<string>} URL of the fetched image
     */
    const fetchImage = async (movieTitle: string, normalizedTitle: string): Promise<string> => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const paths = [
            normalizedTitle,
            movieTitle,
            movieTitle.toLowerCase(),
            movieTitle.replace(/\s+/g, '-')
        ];

        for (const path of paths) {
            try {
                const response = await fetch(`https://localhost:7101/api/photos/${encodeURIComponent(path)}`, {
                    headers
                });
                if (response.ok) {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                }
            } catch (error) {
                console.log(`Failed to fetch image with path: ${path}`);
            }
        }

        throw new Error('Failed to load image with any path format');
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="movie">
                    <div className="schedule__empty-message">Loading movie details...</div>
                </div>
            </MainLayout>
        );
    }

    if (error || !movie) {
        return (
            <MainLayout>
                <div className="movie">
                    <div className="schedule__empty-message">
                        {error || "Failed to load movie details. Please try again later."}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <section className="movie">
                <div className="movie__header">
                    <h2 className="movie__title header--secondary">{movie.title}</h2>
                    <Button
                        className="button movie__button"
                        onClick={scrollToShowtimes}
                    >
                        BUY TICKET
                    </Button>
                </div>

                <div className="movie__content">
                    <div className="movie__information">
                        <div className="movie__info">
                            <div className="movie__info-item">
                                <span className="movie__info-label paragraph--gray">DURATION:</span>
                                <p className="movie__info-text paragraph">{movie.duration} minutes</p>
                            </div>
                            <div className="movie__info-item">
                                <span className="movie__info-label paragraph--gray">GENRE:</span>
                                <p className="movie__info-text paragraph">{movie.genre.genreName}</p>
                            </div>
                            <div className="movie__info-item">
                                <span className="movie__info-label paragraph--gray">RELEASE DATE:</span>
                                <p className="movie__info-text paragraph">{movie.releaseDate}</p>
                            </div>
                        </div>
                        <p className="movie__description paragraph">{movie.description}</p>
                    </div>
                    <div className="movie__poster">
                        <img
                            src={`https://localhost:7101/api/photos/${movie.normalizedTitle}`}
                            alt={movie.title}
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                fetchImage(movie.title, movie.normalizedTitle)
                                    .then(url => {
                                        img.src = url;
                                    })
                                    .catch(() => {
                                        img.src = '/placeholder.jpg';
                                        console.error('Failed to load image for:', movie.title);
                                    });
                            }}
                        />
                    </div>
                </div>

                <div className="movie__schedule" ref={showtimesRef}>
                    <h3 className="movie__schedule-title">
                        <span className="schedule__title-highlight">S</span>howtimes
                    </h3>

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

                    <div className="movie__schedule-times">
                        {isLoadingSchedules ? (
                            <div className="schedule__empty-message">Loading showtimes...</div>
                        ) : filteredScreenings.length === 0 ? (
                            <div className="schedule__empty-message">
                                No showtimes available for this day
                            </div>
                        ) : (
                            <div className="movie__schedule-grid">
                                {filteredScreenings.map((screening) => (
                                    <div key={screening.movieProjectionId} className="movie__schedule-item">
                                        <div className="movie__schedule-info">
                                            {screening.screenType} | {screening.cinemaHall.name} |{' '}
                                            {screening.availableSeats} seats available
                                        </div>
                                        <Link
                                            to={`/booking/${encodeURIComponent(movie.title)}`}
                                            className="movie__schedule-time"
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};