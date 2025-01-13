import "./Dashboard.scss";
import React from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout/MainLayout.tsx";

export const Dashboard: React.FC = () => {
    const location = useLocation();

    return (
        <MainLayout>
            <section className="dashboard">
                <h1 className="dashboard__header header--primary">My Account</h1>
                <nav className="dashboard__menu">
                    <ul className="dashboard__menu-list">
                        <li className="dashboard__menu-item">
                            <p className="dashboard__paragraph paragraph">
                                <Link
                                    to="profile"
                                    className={location.pathname.includes('profile') ? 'active' : ''}
                                >
                                    PROFILE
                                </Link>
                            </p>
                        </li>
                        <li className="dashboard__menu-item">
                            <p className="dashboard__paragraph paragraph">
                                <Link
                                    to="tickets"
                                    className={location.pathname.includes('tickets') ? 'active' : ''}
                                >
                                    TICKETS
                                </Link>
                            </p>
                        </li>
                    </ul>
                </nav>
                <Outlet />
            </section>
        </MainLayout>
    );
};