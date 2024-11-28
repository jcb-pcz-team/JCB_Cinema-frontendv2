import React, { useState } from 'react';
import './MovieSlider.scss';

interface Ticket {
    id: number;
    image: string;
    title: string;
}

export const MovieSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const tickets: Ticket[] = [
        { id: 1, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
        { id: 2, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
        { id: 3, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
        { id: 4, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
        { id: 5, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
        { id: 6, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
        { id: 7, image: 'https://assets-prd.ignimgs.com/2023/05/31/poster-1685564816246.jpeg', title: 'SPIDER-MAN' },
    ];

    const visibleTickets = 5;
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < tickets.length - visibleTickets;

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
                <span className="schedule__title-highlight">
                    B
                </span>
                    UY TICKET</h1>
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
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="carousel__slide">
                                <div className="ticket">
                                    <div className="ticket__image-container">
                                        <img
                                            src={ticket.image}
                                            alt="Spider-Man"
                                            className="ticket__image"
                                        />
                                    </div>
                                    <div className="ticket__title">
                                        {ticket.title}
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
};