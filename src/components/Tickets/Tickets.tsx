/**
 * @fileoverview Komponent wyświetlający listę biletów użytkownika.
 */

import "./Tickets.scss";
import React, { useEffect, useState } from "react";
import { Ticket } from "../Ticket/Ticket.tsx";

/**
 * Interfejs danych biletu
 * @interface TicketData
 */

interface TicketData {
    /** Tytuł filmu */
    movieTitle: string;
    /** Typ projekcji */
    screenType: string;
    /** Czas seansu */
    screeningTime: string;
    /** Nazwa sali kinowej */
    cinemaHall: string;
    /** Numer miejsca */
    seatNumber: number;
    /** URL do szczegółów rezerwacji */
    bookingURL: string;
}

/**
 * Komponent wyświetlający listę biletów użytkownika
 * @component
 * @returns {JSX.Element} Komponent listy biletów
 */

export const Tickets: React.FC = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    /**
     * Pobiera bilety użytkownika z API
     * @async
     */
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                if (!authToken) {
                    throw new Error("Authentication token not found.");
                }

                const response = await fetch("https://localhost:7101/api/bookings?Login=user1", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: TicketData[] = await response.json();
                setTickets(data);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return (
            <div className="tickets">
                <h2 className="profile__header header--secondary">My Tickets</h2>
                <p className="tickets__loading">Loading tickets...</p>
            </div>
        );
    }

    return (
        <div className="tickets">
            <h2 className="profile__header header--secondary">My Tickets</h2>
            <div className="tickets__content">
                <ul className="tickets__list">
                    {tickets.map((ticket) => (
                        <Ticket
                            key={ticket.bookingURL}
                            movieTitle={ticket.movieTitle}
                            screenType={ticket.screenType}
                            screeningTime={ticket.screeningTime}
                            cinemaHall={ticket.cinemaHall}
                            seatNumber={ticket.seatNumber}
                            bookingURL={ticket.bookingURL}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};