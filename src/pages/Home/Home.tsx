/**
 * @file Home.tsx
 * @description React component that implements a movie showcase carousel for the home page.
 * Features automatic slideshow, manual navigation, and movie information display.
 */

import './Home.scss';
import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button/Button";
import { moviesData } from "../../data/moviesData";
import { useNavigate } from 'react-router-dom';

/**
 * @component Home
 * @description Main landing page component featuring a movie carousel with automatic rotation.
 * Includes movie details display, navigation dots, and action buttons.
 *
 * Features:
 * - Automatic slideshow with fade transitions
 * - Manual navigation through dot indicators
 * - Movie information display (title, duration, genre, description)
 * - Navigation to movie details page
 * - Responsive layout with background images
 *
 * @example
 * ```tsx
 * <Home />
 * ```
 */
export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [movieIndex, setMovieIndex] = useState(0);
    const [currentMovie, setCurrentMovie] = useState(moviesData[movieIndex]);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const newIndex = (movieIndex + 1) % moviesData.length;
            setFade(true);
            setTimeout(() => {
                setMovieIndex(newIndex);
                setCurrentMovie(moviesData[newIndex]);
                setFade(false);
            }, 1000);
        }, 8000);

        return () => clearInterval(interval);
    }, [movieIndex]);

    const handleDotClick = (index: number) => {
        if (index !== movieIndex) {
            setFade(true);
            setTimeout(() => {
                setMovieIndex(index);
                setCurrentMovie(moviesData[index]);
                setFade(false);
            }, 100);
        }
    };

    const getNormalizedTitle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSeeMore = () => {
        const normalizedTitle = getNormalizedTitle(currentMovie.title);
        console.log('Navigating to movie:', normalizedTitle);
        navigate(`/movies/${normalizedTitle}`);
    };

    return (
        <section
            className={`home overlay ${fade ? 'home--fade' : ''}`}
            style={{
                backgroundImage: `url(${currentMovie.image})`,
            }}
        >
            <div className="home__content">
                <h1 className="header--primary">{currentMovie.title}</h1>
                <div className="home__movie-info">
                    <div className="home__movie-info__item">
                        <img src="src/assets/images/icon-clock.svg" alt="clock" />
                        <p className="paragraph">
                            <span className="paragraph--gray">DURATION:</span>
                            {currentMovie.duration}
                        </p>
                    </div>
                    <div className="home__movie-info__item">
                        <img src="src/assets/images/icon-carrier.svg" alt="carrier" />
                        <p className="paragraph">
                            <span className="paragraph--gray">{"GENRE:"}</span>
                            {currentMovie.genre.join(", ")}
                        </p>
                    </div>
                </div>
                <p className="paragraph movie-description">
                    {currentMovie.description}
                </p>
                <div className="buttons-container">
                    <Button className="button" onClick={handleSeeMore}>SEE MORE</Button>
                    {/*<Button className="button--white">BUY TICKET</Button>*/}
                </div>
            </div>
            <div className="dots-container">
                {Array.from({ length: moviesData.length }).map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === movieIndex ? 'dot--active' : ''}`}
                        style={{
                            backgroundColor: index === movieIndex ? '#FCF02DFF' : '#ffffff',
                        }}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </section>
    );
};