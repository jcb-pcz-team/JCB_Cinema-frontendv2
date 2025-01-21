import "./Ticket.scss";
import React from "react";

/**
 * Props interface for the Ticket component
 * @interface
 */
interface TicketProps {
    /** Title of the movie for which the ticket is issued */
    movieTitle: string;
    /** Type of screen/projection (e.g., '2D', '3D', 'IMAX') */
    screenType: string;
    /** Date and time of the screening in ISO format */
    screeningTime: string;
    /** Name or identifier of the cinema hall */
    cinemaHall: string;
    /** Seat number in the cinema hall */
    seatNumber: number;
    /** URL to view detailed booking information (currently unused) */
    bookingURL: string;
}

/**
 * Ticket component displays individual ticket information in a list item format.
 * Renders movie details, screening information, and seat allocation in a structured layout.
 *
 * @component
 * @example
 * ```tsx
 * <Ticket
 *   movieTitle="Inception"
 *   screenType="IMAX"
 *   screeningTime="2025-01-16T20:00:00"
 *   cinemaHall="Hall A"
 *   seatNumber={42}
 *   bookingURL="/booking/12345"
 * />
 * ```
 *
 * @remarks
 * - The screening time is automatically formatted using toLocaleString()
 * - The bookingURL functionality is currently commented out
 * - Component should be used within a <ul> or <ol> as it renders as a <li> element
 */
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
            {/*<a className="ticket__link" href={bookingURL}>*/}
            {/*    View Booking Details*/}
            {/*</a>*/}
            <img className="ticket__logo" src="/assets/images/logo.svg" alt="logo"/>
        </li>
    );
};
