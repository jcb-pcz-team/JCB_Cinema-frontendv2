import "./Tickets.scss";
import React, { useEffect, useState } from "react";
import { Ticket } from "../Ticket/Ticket.tsx";

interface TicketData {
    movieTitle: string;
    screenType: string;
    screeningTime: string;
    cinemaHall: string;
    seatNumber: number;
    bookingURL: string;
}

export const Tickets: React.FC = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]); // Typ dla tablicy biletów
    const [loading, setLoading] = useState<boolean>(true); // Typowanie boolean

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const authToken = localStorage.getItem("authToken"); // Pobranie tokena z localStorage
                if (!authToken) {
                    throw new Error("Authentication token not found.");
                }

                const response = await fetch("https://localhost:7101/api/bookings?Login=user1", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`, // Dodanie tokena do nagłówków
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
        return <p>Loading tickets...</p>;
    }

    return (
        <div className="tickets">
            <h2 className="tickets__header header--secondary">My Tickets</h2>
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
    );
};
