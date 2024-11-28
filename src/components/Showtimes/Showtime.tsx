import {Link} from "react-router-dom";

type DayCode = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type ScreeningFormat = 'All' | '2D' | '3D' | 'IMAX' | '4DX';
type Genre = 'All' | 'Action' | 'Sci-Fi' | 'Comedy' | 'Horror' | 'Drama';

interface Day {
    short: DayCode;
    full: string;
}

interface Showtime {
    [key: string]: string[];
}

interface Movie {
    id: number;
    title: string;
    genre: Genre[];
    duration: string;
    format: ScreeningFormat;
    showtimes: Showtime;
    poster: string;
}

import React, { useState } from 'react';
import './Showtime.scss';

export const Showtime: React.FC = () => {
    const days: Day[] = [
        { short: 'Mon', full: 'Monday' },
        { short: 'Tue', full: 'Tuesday' },
        { short: 'Wed', full: 'Wednesday' },
        { short: 'Thu', full: 'Thursday' },
        { short: 'Fri', full: 'Friday' },
        { short: 'Sat', full: 'Saturday' },
        { short: 'Sun', full: 'Sunday' }
    ];

    const screeningTypes: ScreeningFormat[] = ['All', '2D', '3D', 'IMAX', '4DX'];
    const genres: Genre[] = ['All', 'Action', 'Sci-Fi', 'Comedy', 'Horror', 'Drama'];

    const [selectedDay, setSelectedDay] = useState<DayCode>('Mon');
    const [selectedType, setSelectedType] = useState<ScreeningFormat>('All');
    const [selectedGenre, setSelectedGenre] = useState<Genre>('All');

    const moviesData: Movie[] = [
        {
            id: 1,
            title: "SPIDER-MAN: HOMECOMING",
            genre: ["Action", "Sci-Fi"],
            duration: "125 min",
            format: "2D",
            showtimes: {
                Mon: ["12:00", "14:00", "15:00", "21:00"],
                Tue: ["13:00", "16:00", "19:00"],
                Wed: ["12:00", "15:00", "21:00"],
            },
            poster: "https://fr.web.img2.acsta.net/pictures/17/05/30/13/13/145510.jpg"
        },
        {
            id: 2,
            title: "AVENGERS: INFINITY WAR",
            genre: ["Action", "Sci-Fi"],
            duration: "149 min",
            format: "3D",
            showtimes: {
                Mon: ["11:00", "14:30", "18:00"],
                Tue: ["12:30", "16:30", "20:00"],
                Wed: ["13:00", "16:00", "19:30"],
            },
            poster: "https://m.media-amazon.com/images/S/pv-target-images/3307ca0df325da35692128a6703a4bff5a5cf8c60bb719f221cadd6c03834358.jpg"
        },
        {
            id: 3,
            title: "BLACK WIDOW",
            genre: ["Action", "Drama"],
            duration: "133 min",
            format: "IMAX",
            showtimes: {
                Mon: ["13:00", "16:00", "19:00"],
                Tue: ["14:00", "17:00", "20:00"],
                Wed: ["12:00", "15:00", "18:00"],
            },
            poster: "https://lumiere-a.akamaihd.net/v1/images/image_b97b56f3.jpeg?region=0,0,540,810"
        }
    ];

    const filteredMovies = moviesData.filter(movie => {
        const matchesType = selectedType === 'All' || movie.format === selectedType;
        const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
        const hasShowtimesForDay = movie.showtimes[selectedDay]?.length > 0;

        return matchesType && matchesGenre && hasShowtimesForDay;
    });

    const handleDaySelect = (day: DayCode) => {
        setSelectedDay(day);
    };

    const handleTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value as ScreeningFormat);
    };

    const handleGenreSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value as Genre);
    };

    return (
        <section className="schedule">
            <div className="schedule__container">
                <header className="schedule__header">
                    <h2 className="schedule__title">
                        <span className="schedule__title-highlight">S</span>chowtimes
                    </h2>

                    <div className="schedule__filters">
                        <div className="schedule__days">
                            {days.map((day) => (
                                <button
                                    key={day.short}
                                    className={`schedule__day-btn ${
                                        selectedDay === day.short ? 'schedule__day-btn--active' : ''
                                    }`}
                                    title={day.full}
                                    onClick={() => handleDaySelect(day.short)}
                                >
                                    {day.short}
                                </button>
                            ))}
                        </div>

                        <button className="schedule__calendar-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </button>

                        <div className="schedule__select-group">
                            <select
                                className="schedule__select"
                                value={selectedType}
                                onChange={handleTypeSelect}
                            >
                                {screeningTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                className="schedule__select"
                                value={selectedGenre}
                                onChange={handleGenreSelect}
                            >
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <div className="schedule__movie-list">
                    {filteredMovies.length === 0 ? (
                        <div className="schedule__empty-message">
                            No movies match your selected criteria
                        </div>
                    ) : (
                        filteredMovies.map((movie) => (
                            <div key={movie.id} className="movie-card">
                                <div className="movie-card__poster">
                                    <Link to={`/movies/${movie.title}`}>
                                        <img src={movie.poster} alt={movie.title} />
                                    </Link>
                                </div>
                                <div className="movie-card__content">
                                    <h2 className="movie-card__title">{movie.title}</h2>
                                    <div className="movie-card__info">
                                        {movie.genre.join(', ')} | {movie.duration}
                                    </div>
                                    <div className="movie-card__format">{movie.format}</div>
                                    <div className="movie-card__showtimes">
                                        {movie.showtimes[selectedDay]?.map((time) => (
                                            <button key={time} className="movie-card__time-btn">
                                                {time}
                                            </button>
                                        ))}
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