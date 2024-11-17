import './Home.scss';
import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button/Button";
import { moviesData } from "../../data/moviesData";

export const Home: React.FC = () => {
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
            }, 500);
        }
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
                    <Button className="button">SEE MORE</Button>
                    <Button className="button--white">BUY TICKET</Button>
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
