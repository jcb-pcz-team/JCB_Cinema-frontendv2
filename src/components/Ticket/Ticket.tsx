import "./Ticket.scss";
import React from "react";

interface TicketProps {
    movieTitle: string;
    screenType: string;
    screeningTime: string;
    cinemaHall: string;
    seatNumber: number;
    bookingURL: string;
    isConfirmed: boolean;
}

export const Ticket: React.FC<TicketProps> = ({
                                                  movieTitle,
                                                  screenType,
                                                  screeningTime,
                                                  cinemaHall,
                                                  seatNumber,
                                                  isConfirmed,
                                              }) => {
    if (!isConfirmed) return null;

    return (
        <li className="ticket">
            <h3 className="ticket__header header--tertiary">{movieTitle}</h3>
            <div className="ticket__data-row">
                <p className="ticket__paragraph paragraph--gray" data-label="Screen Type:">
                    {screenType}
                </p>
                <p className="ticket__paragraph paragraph--gray" data-label="Screening Time:">
                    {new Date(screeningTime).toLocaleString()}
                </p>
                <p className="ticket__paragraph paragraph--gray" data-label="Hall:">
                    {cinemaHall}
                </p>
                <p className="ticket__paragraph paragraph--gray" data-label="Seat:">
                    {seatNumber}
                </p>
            </div>
            <img className="ticket__logo" src="/assets/images/logo.svg" alt="logo"/>
        </li>
    );
};