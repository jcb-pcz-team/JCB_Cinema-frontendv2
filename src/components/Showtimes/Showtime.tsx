import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import "./Showtime.scss";

/**
 * Type representing days of the week in three-letter format
 * @typedef {('Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun')} DayCode
 */
type DayCode = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
/**
 * Available movie screening formats
 * @typedef {('All'|'2D'|'3D'|'IMAX'|'4DX')} ScreeningFormat
 */
type ScreeningFormat = 'All' | '2D' | '3D' | 'IMAX' | '4DX';

/**
 * Available movie screening formats
 * @typedef {('All'|'2D'|'3D'|'IMAX'|'4DX')} ScreeningFormat
 */
type Genre = 'All' | 'Action' | 'Drama' | 'Science Fiction' | 'War';

/**
 * Interface representing a day in the schedule
 * @interface
 */
interface Day {
    /** Three-letter day code (e.g., 'Mon') */
    short: DayCode;
    /** Full day name (e.g., 'Monday') */
    full: string;
    /** Date in ISO format (YYYY-MM-DD) */
    date: string;
}

/**
 * Interface representing a movie's details
 * @interface
 */
interface Movie {
    /** Movie title */
    title: string;
    /** Movie description/synopsis */
    description: string;
    /** Movie duration in minutes */
    duration: number;
    /** Release date */
    releaseDate: string;
    /** Movie genre information */
    genre: {
        /** Unique identifier for the genre */
        genreId: number;
        /** Name of the genre */
        genreName: string;
    };
    /** URL-friendly version of the movie title */
    normalizedTitle: string;
    /** Release information */
    release: string;
}

/**
 * Interface representing a movie projection/screening
 * @interface
 */
interface MovieProjection {
    /** Unique identifier for the projection */
    movieProjectionId: number;
    /** Movie details */
    movie: Movie;
    /** Screening time in ISO format */
    screeningTime: string;
    /** Type of screening (2D, 3D, etc.) */
    screenType: string;
    /** Cinema hall information */
    cinemaHall: {
        /** Unique identifier for the cinema hall */
        cinemaHallId: number;
        /** Name of the cinema hall */
        name: string;
    };
    /** URL-friendly version of the movie title */
    normalizedMovieTitle: string;
    /** Ticket price information */
    price: {
        /** Price amount in smallest currency unit (e.g., cents) */
        ammount: number;
        /** Currency code */
        currency: string;
    };
    /** Number of occupied seats */
    occupiedSeats: number;
    /** Number of available seats */
    availableSeats: number;
}

/**
 * Showtime component displays movie screenings with filtering options.
 * Allows users to filter movies by day, screening format, and genre.
 * Displays movie cards with screening times and booking links.
 *
 * @component
 * @example
 * ```tsx
 * <Showtime />
 * ```
 */
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

    // Fetch movie projections using React Query
    const { data: movieProjections = [], isLoading, error } = useQuery<MovieProjection[]>({
        queryKey: ['movieProjections'],
        queryFn: async () => {
            const response = await fetch('https://localhost:7101/api/moviesprojection');
            if (!response.ok) {
                throw new Error('Failed to fetch movie projections');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: 2
    });

    const screeningTypes: ScreeningFormat[] = ['All', '2D', '3D', 'IMAX', '4DX'];
    const genres: Genre[] = ['All', 'Action', 'Drama', 'Science Fiction', 'War'];

    // Filter projections based on selected criteria
    const filteredProjections = useMemo(() => {
        return movieProjections
            .filter(projection => {
                const projectionDate = new Date(projection.screeningTime).toISOString().split('T')[0];
                const matchesDay = projectionDate === selectedDay;
                const matchesType = selectedType === 'All' || projection.screenType === selectedType;
                const matchesGenre = selectedGenre === 'All' || projection.movie.genre.genreName === selectedGenre;
                return matchesDay && matchesType && matchesGenre;
            })
            .sort((a, b) => new Date(a.screeningTime).getTime() - new Date(b.screeningTime).getTime());
    }, [movieProjections, selectedDay, selectedType, selectedGenre]);

    const fetchImage = async (title: string, normalizedTitle: string): Promise<string> => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const paths = [
            normalizedTitle,
            title,
            title.toLowerCase(),
            title.replace(/\s+/g, '-')
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

    if (error) {
        return (
            <div className="schedule">
                <div className="schedule__empty-message">
                    Failed to load movie projections. Please try again later.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="schedule">
                <div className="schedule__empty-message">
                    Loading movie projections...
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
                    {filteredProjections.length === 0 ? (
                        <div className="schedule__empty-message">
                            No movies match your selected criteria
                        </div>
                    ) : (
                        filteredProjections.map((projection) => (
                            <div key={projection.movieProjectionId} className="movie-card">
                                <div className="movie-card__poster">
                                    <Link to={`/movies/${projection.movie.normalizedTitle}`}>
                                        <img
                                            src={`https://localhost:7101/api/photos/${projection.movie.normalizedTitle}`}
                                            alt={projection.movie.title}
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                fetchImage(projection.movie.title, projection.movie.normalizedTitle)
                                                    .then(url => {
                                                        img.src = url;
                                                    })
                                                    .catch(() => {
                                                        img.src = '/placeholder.jpg';
                                                        console.error('Failed to load image for:', projection.movie.title);
                                                    });
                                            }}
                                        />
                                    </Link>
                                </div>
                                <div className="movie-card__content">
                                    <h2 className="movie-card__title">{projection.movie.title}</h2>
                                    <div className="movie-card__info">
                                        {projection.movie.genre.genreName} | {projection.movie.duration} min
                                    </div>
                                    <div className="movie-card__format">
                                        {projection.screenType} | {projection.cinemaHall.name} |{' '}
                                        Price: {(projection.price.ammount / 100).toFixed(2)} {projection.price.currency}
                                    </div>
                                    <div className="movie-card__showtimes">
                                        <Link
                                            to={`/booking/${encodeURIComponent(projection.movie.title)}`}
                                            className="movie-card__time-btn"
                                            state={{
                                                showtime: new Date(projection.screeningTime).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }),
                                                movieProjectionId: projection.movieProjectionId
                                            }}
                                        >
                                            {new Date(projection.screeningTime).toLocaleTimeString([], {
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