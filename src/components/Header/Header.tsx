import './Header.scss';
import React, {useEffect, useState} from "react";
import {HeaderMobile} from "../HeaderMobile/HeaderMobile.tsx";
import {HeaderDesktop} from "../HeaderDesktop/HeaderDesktop.tsx";

/**
 * Header Component
 *
 * Renders either mobile or desktop header based on screen width
 * Dynamically switches between HeaderMobile and HeaderDesktop
 *
 * @returns A React component representing the responsive header
 */
export const Header : React.FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    /**
     * Effect hook to handle responsive header rendering
     * Adds and removes window resize event listener
     * Updates isMobile state when window is resized
     */
    useEffect(() => {
        /**
         * Handler for window resize event
         * Sets mobile state based on window width
         */
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
        </>
    );
};