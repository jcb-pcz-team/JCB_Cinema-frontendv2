/**
 * @file MainLayout.tsx
 * @description React component that implements the main layout structure of the application.
 * Provides a consistent page layout with header, main content area, and (commented out) footer.
 */

import './MainLayout.scss'
import React from 'react';
import { Header } from '../../components/Header/Header';
// import { Footer } from '../../components/Footer/Footer';
import { MainLayoutProps } from "../../types/layouts.types.ts";
import {Footer} from "../../components/Footer/Footer.tsx";

/**
 * @component MainLayout
 * @description A layout component that wraps the main content of the application.
 * Ensures consistent page structure across different routes.
 *
 * @param {MainLayoutProps} props - The component props
 * @param {ReactNode} props.children - Child elements to be rendered in the main content area
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 * ```
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};