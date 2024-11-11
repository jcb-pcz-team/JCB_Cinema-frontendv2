import './Header.scss';
import React from "react";
import {MenuSlideLayout} from "../MenuSlideLayout/MenuSlideLayout.tsx";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="header">
            <img src="src/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header__nav'>
                <button onClick={toggleMenu}
                        className="button-menu"
                >
                    <img  src="src/assets/images/icon-menu_hamburger.svg" alt="menu_hamburger"/>
                </button>
            </nav>
            <MenuSlideLayout isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </header>
    );
};