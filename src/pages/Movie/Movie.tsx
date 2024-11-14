import "./Movie.scss";
import React, {useEffect, useState} from "react";
import { Button } from "../../components/Button/Button.tsx";

export const Movie: React.FC = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="movie">
            <div className="movie__header">
                <h2 className="movie__title header--secondary">Spider Man: No Way Home</h2>
                <Button className="movie__button" buttonColor="#FCF02D">
                    BUY TICKET
                </Button>
            </div>
            <div className="movie__video">
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
                <div className="movie__infromation">
                    <h3 className="movie__subtitle">MORE INFORMATION ABOUT Spider Man: No Way Home</h3>

                    <div className="movie__info">
                        <div className="movie__info-item">
                        <   img className="movie__info-icon" src="src/assets/images/icon-clock.svg" alt="clock"/>
                            <span className="movie__info-label">DURATION:</span>
                            <p className="movie__info-text">2h 30min</p>
                        </div>
                        <div className="movie__info-item">
                            <img className="movie__info-icon" src="src/assets/images/icon-carrier.svg" alt="carrier"/>
                            <span className="movie__info-label">GENRE:</span>
                            <p className="movie__info-text">ACTION</p>
                        </div>
                    </div>
                    <p className="movie__description">
                    For the first time in history, the identity of Spider-Man, our friendly neighborhood superhero, is
                    revealed. He can no longer fulfill his superhero duties while leading a normal life. Moreover, he
                    puts those he cares about most in danger.
                    </p>
                </div>

                {isDesktop ?
                    null
                    :
                    <img className="movie__background-image" src="src/assets/images/backgorund-spiderman.png"
                         alt="Spider Man background"/>}
            </div>
            <dl className="movie__details">
                <div className="movie__details-item">
                    <dt className="movie__details-term">Title</dt>
                    <dd className="movie__details-definition">Spider Man: No Way Home</dd>
                </div>
                <div className="movie__details-item">
                    <dt className="movie__details-term">Genre</dt>
                    <dd className="movie__details-definition">Action, Sci-Fi</dd>
                </div>
                <div className="movie__details-item">
                    <dt className="movie__details-term">Age Restriction</dt>
                    <dd className="movie__details-definition">13+</dd>
                </div>
                <div className="movie__details-item">
                    <dt className="movie__details-term">Screening Type</dt>
                    <dd className="movie__details-definition">2D, IMAX</dd>
                </div>
            </dl>

            {isDesktop ?
                <img className="movie__background-image" src="src/assets/images/backgorund-spiderman.png"
                     alt="Spider Man background"/>               :
                null }
        </section>
    );
};
