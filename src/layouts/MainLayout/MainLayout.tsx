import './MainLayout.scss'
import React from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { MainLayoutProps } from "../../types/layouts.types.ts";

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};