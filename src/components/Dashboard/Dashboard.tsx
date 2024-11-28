import "./Dashboard.scss";
import React from 'react';
import {Link, Outlet} from "react-router-dom";
import {MainLayout} from "../../layouts/MainLayout/MainLayout.tsx";

export const Dashboard : React.FC = () => {
    return (
        <MainLayout>
        <section className="dashboard">
            <h1 className="dashboard__header header--primary">My Account</h1>
            <div className="dashboard__menu">
                <ul className="dashboard__menu-list">
                    <li className="dashboard__menu-item">
                        <p className="dashboard__paragraph paragraph">
                            <Link to="profile">
                                PROFILE
                            </Link>
                        </p>
                    </li>
                    <li className="dashboard__menu-item">
                        <p className="dashboard__paragraph paragraph">
                            <Link to="tickets">
                                TICKETS
                            </Link>
                        </p>
                    </li>
                </ul>
            </div>
            <Outlet />
        </section>
        </MainLayout>
    );
};
