import './MenuSlideLayout.scss';
import { SlidingPanelLayout } from '../../layouts/SlidingPanelLayout/SlidingPanelLayout.tsx';
import React from "react";

interface MenuSlideLayoutProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

export const MenuSlideLayout : React.FC<MenuSlideLayoutProps> = ({isOpen, toggleMenu}) => {
    return (
        <SlidingPanelLayout title={"MENU"} isOpen={isOpen} toggle={toggleMenu}>
            <ul className="list">
                <li className={"list__item"}><p>Home</p></li>
                <li className={"list__item"}>Showtimes</li>
                <li className={"list__item"}>Upcoming</li>
                <li className={"list__item"}>Featured</li>
                <li className={"list__item"}>Benefits</li>
                <li className={"list__item"}>About"</li>
            </ul>
        </SlidingPanelLayout>
    );
};