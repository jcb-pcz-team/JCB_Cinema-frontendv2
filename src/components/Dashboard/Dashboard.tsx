import "./Dashboard.scss";
import React from 'react';
import {Profile} from "../Profile/Profile.tsx";

export const Dashboard : React.FC = () => {
    return (
        <section className="dashboard">
            <h1 className="dashboard__header header--primary">My Account</h1>
            <div className="dashboard__menu">
                <ul className="dashboard__menu-list">
                    <li className="dashboard__menu-item">
                        <p className="dashboard__paragraph paragraph">
                            PROFILE
                        </p>
                    </li>
                    <li className="dashboard__menu-item">
                        <p className="dashboard__paragraph paragraph">
                            TICKETS
                        </p>
                    </li>
                </ul>
            </div>
            {/*LAYOUT GENEREL INFO PONIZEJ*/}
            <Profile/>
        </section>
    );
};
