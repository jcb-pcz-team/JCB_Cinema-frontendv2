import './Header.scss';
import React, {useEffect, useState} from "react";
import {HeaderMobile} from "../HeaderMobile/HeaderMobile.tsx";
import {HeaderDesktop} from "../HeaderDesktop/HeaderDesktop.tsx";


export const Header : React.FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    useEffect(() => {
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