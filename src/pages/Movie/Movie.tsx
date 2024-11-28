import "./Movie.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/Button/Button.tsx";
import {MainLayout} from "../../layouts/MainLayout/MainLayout.tsx";

interface Genre {
    genreId: number;
    genreName: string;
}

interface Movie {
    movieId: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: Genre;
    posterURL: string;
    release: string;
}

export const Movie: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://localhost:7101/api/movies/${movieId}`);
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

        if (movieId) {
            fetchMovie();
        }
    }, [movieId]);

    if (isLoading) {
        return <div>Loading movie details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!movie) {
        return <div>No movie found.</div>;
    }

    return (
        <MainLayout>
        <section className="movie">
            <div className="movie__header">
                <h2 className="movie__title header--secondary">{movie.title}</h2>
                <Button className="button movie__button">
                    BUY TICKET
                </Button>
            </div>
            <div className="movie__video">
                {/* Replace with an actual trailer URL if available */}
                <iframe
                    className="movie__video-frame"
                    width="350"
                    height="215"
                    src="https://www.youtube.com/embed/JfVOs4VSpmA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
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
                            <span className="movie__info-label paragraph--gray">FORMAT:</span>
                            <p className="movie__info-text paragraph">{movie.releaseDate}</p>
                        </div>
                    </div>
                    <p className="movie__description paragraph">{movie.description}</p>
                </div>
                <img
                    className="movie__background-image"
                    src={`https://localhost:7101/api/${movie.posterURL}`}
                    alt={movie.title}
                />
            </div>
        </section>
        </MainLayout>
    );
};
