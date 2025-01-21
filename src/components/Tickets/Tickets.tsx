/**
 * @file Tickets.tsx
 * @description React component that displays a paginated list of user's tickets.
 * Features loading states, error handling, and pagination controls.
 */


import "./Tickets.scss";
import React, { useEffect, useState, useMemo } from "react";
import { Ticket } from "../Ticket/Ticket.tsx";

/**
 * @interface TicketData
 * @description Represents the data structure for a single ticket
 */
interface TicketData {
    /** Title of the movie */
    movieTitle: string;
    /** Type of screen (e.g., "2D", "3D", "IMAX") */
    screenType: string;
    /** Time of the movie screening */
    screeningTime: string;
    /** Name or identifier of the cinema hall */
    cinemaHall: string;
    /** Seat number assigned to the ticket */
    seatNumber: number;
    /** URL for accessing the booking details */
    bookingURL: string;
}
const TICKETS_PER_PAGE = 5;

/**
 * @component Tickets
 * @description Component for displaying user's movie tickets with pagination.
 * Handles data fetching, loading states, and pagination logic.
 *
 * Features:
 * - Fetches tickets from API using authentication
 * - Displays loading state while fetching
 * - Shows empty state when no tickets found
 * - Implements pagination for ticket list
 * - Provides navigation between pages
 *
 * @example
 * ```tsx
 * <Tickets />
 * ```
 */
export const Tickets: React.FC = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    /**
     * @effect Ticket Fetching
     * @description Fetches user's tickets from the API on component mount
     * Requires authentication token from localStorage
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

    // Calculate pagination data
    const totalPages = Math.ceil(tickets.length / TICKETS_PER_PAGE);

    // Get current page tickets
    /**
     * @memoized currentTickets
     * @description Calculates the subset of tickets to display on current page
     * Memoized to prevent recalculation unless tickets or currentPage changes
     *
     * @returns {TicketData[]} Array of tickets for the current page
     */
    const currentTickets = useMemo(() => {
        const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
        const endIndex = startIndex + TICKETS_PER_PAGE;
        return tickets.slice(startIndex, endIndex);
    }, [tickets, currentPage]);

    // Handle page changes
    /**
     * @function handlePreviousPage
     * @description Navigates to the previous page of tickets
     * Won't go below page 1
     */
    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    /**
     * @function handleNextPage
     * @description Navigates to the next page of tickets
     * Won't exceed total number of pages
     */
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

                {/* Pagination controls */}
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