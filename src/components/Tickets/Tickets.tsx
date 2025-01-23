import "./Tickets.scss";
import React, { useEffect, useState, useMemo } from "react";
import { Ticket } from "../Ticket/Ticket";

interface TicketData {
    bookingId: number;
    movieTitle: string;
    screenType: string;
    screenignTime: string;
    cienemaHall: string;
    seatNumber: number;
    movieProjectionId: number;
    isConfirmed: boolean;
}

const TICKETS_PER_PAGE = 5;

export const Tickets: React.FC = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                const userName = localStorage.getItem("userName");
                if (!authToken || !userName) {
                    throw new Error("Authentication token not found.");
                }

                const response = await fetch(`https://localhost:7101/api/bookings?Login=${userName}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
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

    const totalPages = Math.ceil(tickets.length / TICKETS_PER_PAGE);

    const currentTickets = useMemo(() => {
        const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
        const endIndex = startIndex + TICKETS_PER_PAGE;
        return tickets.slice(startIndex, endIndex);
    }, [tickets, currentPage]);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    if (loading) {
        return (
            <div className="tickets">
                <h2 className="profile__header header--secondary">My Tickets</h2>
                <p className="tickets__loading">Loading tickets...</p>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="tickets">
                <h2 className="profile__header header--secondary">My Tickets</h2>
                <p className="tickets__empty">No tickets found.</p>
            </div>
        );
    }

    return (
        <div className="tickets">
            <h2 className="profile__header header--secondary">My Tickets</h2>
            <div className="tickets__content">
                <ul className="tickets__list">
                    {currentTickets.map((ticket) => (
                        <Ticket
                            key={ticket.bookingId}
                            movieTitle={ticket.movieTitle}
                            screenType={ticket.screenType}
                            screeningTime={ticket.screenignTime}
                            cinemaHall={ticket.cienemaHall}
                            seatNumber={ticket.seatNumber}
                            bookingURL={`/booking/${ticket.bookingId}`}
                            isConfirmed={ticket.isConfirmed}
                        />
                    ))}
                </ul>

                {totalPages > 1 && (
                    <div className="tickets__pagination">
                        <button
                            className="tickets__pagination-btn"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="tickets__pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="tickets__pagination-btn"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};