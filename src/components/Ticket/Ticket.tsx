import "./Ticket.scss";
import React from "react";

export const Ticket: React.FC = () => {
    return (
        <li className="ticket">
            <h3 className="ticket__header header--tertiary">
                Transformers: Last Knights
            </h3>
            <div className="ticket__data-row">
                <p className="ticket__paragraph paragraph--gray">Screen Type: 2D</p>
                <p className="ticket__paragraph paragraph--gray">Screening Time: 126min</p>
                <p className="ticket__paragraph paragraph--gray">Hall: A</p>
                <p className="ticket__paragraph paragraph--gray">Seat: 1H</p>
            </div>
            <img className="ticket__logo" src="src/assets/images/logo.svg" alt="logo" />
        </li>
    );
};

