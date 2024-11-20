import "./Tickets.scss";
import React from "react";
import {Ticket} from "../Ticket/Ticket.tsx";

export const Tickets: React.FC = () => {
    return (
        <div className="tickets">
            <h2 className="tickets__header header--secondary">
                My Tickets
            </h2>
            <ul className="tickets__list">
                <Ticket/>
            </ul>
        </div>
    );
};