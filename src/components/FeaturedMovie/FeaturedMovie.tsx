// FeaturedMovie.jsx
import React, { useState, useEffect } from 'react';
import './FeaturedMovie.scss';

export const FeaturedMovie : React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 280,
        hours: 12,
        minutes: 11,
        seconds: 2
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime.seconds > 0) {
                    return { ...prevTime, seconds: prevTime.seconds - 1 };
                } else if (prevTime.minutes > 0) {
                    return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
                } else if (prevTime.hours > 0) {
                    return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
                } else if (prevTime.days > 0) {
                    return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
                }
                return prevTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="featured-movie overlay">
            <div className="featured-movie__content">
                <h1 className="featured-movie__title">VENOM: LAST DANCE</h1>

                <div className="featured-movie__meta">
                    <span className="featured-movie__genre">Action, SciFi</span>
                    <span className="featured-movie__rating">PG-13</span>
                    <span className="featured-movie__version">DUB</span>
                    <span className="featured-movie__version">SUB</span>
                </div>

                <div className="featured-movie__countdown">
                    <h3 className="featured-movie__countdown-title">Coming Out in:</h3>
                    <div className="featured-movie__countdown-boxes">
                        <div className="countdown-box">
                            <div className="countdown-box__number">{timeLeft.days}</div>
                            <div className="countdown-box__label">days</div>
                        </div>
                        <div className="countdown-box">
                            <div className="countdown-box__number">{timeLeft.hours}</div>
                            <div className="countdown-box__label">hours</div>
                        </div>
                        <div className="countdown-box">
                            <div className="countdown-box__number">{timeLeft.minutes}</div>
                            <div className="countdown-box__label">minutes</div>
                        </div>
                        <div className="countdown-box">
                            <div className="countdown-box__number">{timeLeft.seconds}</div>
                            <div className="countdown-box__label">seconds</div>
                        </div>
                    </div>
                </div>

                <div className="featured-movie__info">
                    <div className="featured-movie__info-item">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Release Date: October 2025</span>
                    </div>
                    <div className="featured-movie__info-item">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Duration: 2h 15min</span>
                    </div>
                </div>
            </div>
        </section>
    );
};