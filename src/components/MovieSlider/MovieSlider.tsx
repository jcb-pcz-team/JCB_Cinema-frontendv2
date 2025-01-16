import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieSlider.scss';

/**
 * Represents a movie ticket/poster in the slider
 */
interface Ticket {
    /** Unique identifier for the ticket */
    id: number;
    /** URL of the movie poster image */
    image: string;
    /** Movie title */
    title: string;
    /** Normalized title for URL routing */
    normalizedTitle: string;
}

/**
 * Movie Slider Component
 *
 * Displays a carousel of movie tickets with navigation controls
 * Allows scrolling through available movies
 *
 * @returns A React component showing a scrollable movie selection
 */
export const MovieSlider: React.FC = () => {
    /**
     * State to track current slider position
     * Determines which movies are currently visible
     */
    const [currentIndex, setCurrentIndex] = useState(0);

    /**
     * Collection of movie tickets to display in the slider
     * Note: Only one ticket shown in the provided code snippet
     */
    const tickets: Ticket[] = [
        {
            id: 1,
            image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg',
            title: 'SPIDER-MAN',
            normalizedTitle: 'spider-man'
        },
        // Placeholder for additional tickets
    ];

    /** Number of tickets visible at once */
    const visibleTickets = 5;

    /**
     * Determines if left scroll is possible
     * @returns Boolean indicating if can scroll left
     */
    const canScrollLeft = currentIndex > 0;

    /**
     * Determines if right scroll is possible
     * @returns Boolean indicating if can scroll right
     */
    const canScrollRight = currentIndex < tickets.length - visibleTickets;

    /**
     * Scrolls the slider left or right
     * @param direction - Direction of scroll ('left' or 'right')
     */
    const scroll = (direction: 'left' | 'right') => {
        setCurrentIndex(prev => {
            if (direction === 'left') {
                return Math.max(prev - 1, 0);
            }
            return Math.min(prev + 1, tickets.length - visibleTickets);
        });
    };

    return (
        <div className="carousel">
            <h1 className="carousel__title">
                <span className="schedule__title-highlight">B</span>
                UY TICKET
            </h1>
            <div className="carousel__container">
                {/* Left navigation button */}
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
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="carousel__slide">
                                <div className="ticket">
                                    <div className="ticket__image-container">
                                        <img
                                            src={ticket.image}
                                            alt={ticket.title}
                                            className="ticket__image"
                                        />
                                    </div>
                                    <div className="ticket__title">
                                        {ticket.title}
                                    </div>
                                    <Link
                                        to={`/movies/${ticket.normalizedTitle}`}
                                        className="ticket__see-more"
                                    >
                                        SEE MORE
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right navigation button */}
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
};