import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import "./MovieSlider.scss";

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

export const MovieSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const visibleTickets = 5;

    const { data: movies = [], isLoading, error } = useQuery<Movie[]>({
        queryKey: ['upcomingMovies'],
        queryFn: async () => {
            const response = await fetch('https://localhost:7101/api/movies/upcoming');
            if (!response.ok) {
                throw new Error('Failed to fetch upcoming movies');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: 2
    });

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

    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < (movies.length - visibleTickets);

    const scroll = (direction: 'left' | 'right') => {
        setCurrentIndex(prev => {
            if (direction === 'left') {
                return Math.max(prev - 1, 0);
            }
            return Math.min(prev + 1, movies.length - visibleTickets);
        });
    };

    const handleMovieClick = (normalizedTitle: string) => {
        navigate(`/movies/${normalizedTitle}`);
    };

    if (isLoading) {
        return (
            <div className="carousel">
                <h1 className="carousel__title">
                    <span className="schedule__title-highlight">U</span>
                    pcoming Movies
                </h1>
                <div className="flex items-center justify-center p-4">Loading movies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="carousel">
                <h1 className="carousel__title">
                    <span className="schedule__title-highlight">U</span>
                    pcoming Movies
                </h1>
                <div className="flex items-center justify-center p-4 text-red-500">
                    Failed to load movies. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="carousel">
            <h1 className="carousel__title">
                <span className="schedule__title-highlight">U</span>
                pcoming Movies
            </h1>
            <div className="carousel__container">
                <button
                    onClick={() => scroll('left')}
                    className={`carousel__button ${!canScrollLeft ? 'carousel__button--disabled' : ''}`}
                    disabled={!canScrollLeft}
                >
                    <svg className="carousel__arrow" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                <div className="carousel__track">
                    <div
                        className="carousel__slides"
                        style={{ transform: `translateX(-${currentIndex * (100 / visibleTickets)}%)` }}
                    >
                        {movies.map((movie) => (
                            <div key={movie.title} className="carousel__slide">
                                <div
                                    className="ticket"
                                    onClick={() => handleMovieClick(movie.normalizedTitle)}
                                >
                                    <div className="ticket__image-container">
                                        <img
                                            src={`https://localhost:7101/api/photos/${movie.normalizedTitle}`}
                                            alt={movie.title}
                                            className="ticket__image"
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
                                    <div className="ticket__title">
                                        {movie.title}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => scroll('right')}
                    className={`carousel__button ${!canScrollRight ? 'carousel__button--disabled' : ''}`}
                    disabled={!canScrollRight}
                >
                    <svg className="carousel__arrow" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};;