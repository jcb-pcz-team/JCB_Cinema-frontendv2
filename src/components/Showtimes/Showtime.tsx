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
    releaseDate: string;
    genre: {
        genreId: number;
        genreName: string;
    };
    normalizedTitle: string;
    release: string;
}

interface MovieProjection {
    movieProjectionId: number;
    movie: Movie;
    screeningTime: string;
    screenType: string;
    cinemaHall: {
        cinemaHallId: number;
        name: string;
    };
    normalizedMovieTitle: string;
    price: {
        ammount: number;
        currency: string;
    };
    occupiedSeats: number;
    availableSeats: number;
}

export const Showtime: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedType, setSelectedType] = useState<ScreeningFormat>('All');
    const [selectedGenre, setSelectedGenre] = useState<Genre>('All');

    const screeningTypes: ScreeningFormat[] = ['All', '2D', '3D', 'IMAX', '4DX'];
    const genres: Genre[] = ['All', 'Action', 'Drama', 'Science Fiction', 'War'];

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
        queryKey: ['movieProjections', selectedDay, selectedType, selectedGenre],
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
        <section className="schedule" id="showtimes">
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