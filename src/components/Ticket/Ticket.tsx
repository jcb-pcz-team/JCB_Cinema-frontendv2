import "./Ticket.scss";
import React from "react";

interface TicketProps {
    movieTitle: string;
    screenType: string;
    screeningTime: string;
    cinemaHall: string;
    seatNumber: number;
    bookingURL: string;
}

export const Ticket: React.FC<TicketProps> = ({
                                                  movieTitle,
                                                  screenType,
                                                  screeningTime,
                                                  cinemaHall,
                                                  seatNumber,
                                                  // bookingURL,
                                              }) => {
    return (
        <li className="ticket">
            <h3 className="ticket__header header--tertiary">{movieTitle}</h3>
            <div className="ticket__data-row">
                <p className="ticket__paragraph paragraph--gray">Screen Type: {screenType}</p>
                <p className="ticket__paragraph paragraph--gray">Screening Time: {new Date(screeningTime).toLocaleString()}</p>
                <p className="ticket__paragraph paragraph--gray">Hall: {cinemaHall}</p>
                <p className="ticket__paragraph paragraph--gray">Seat: {seatNumber}</p>
            </div>
            {/*<a className="ticket__link" href={bookingURL}>*/}
            {/*    View Booking Details*/}
            {/*</a>*/}
            <img className="ticket__logo" src="/assets/images/logo.svg" alt="logo" />
        </li>
    );
};
