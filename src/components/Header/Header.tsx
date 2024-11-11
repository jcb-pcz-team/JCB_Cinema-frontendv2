import './Header.scss';
import React, {useState} from "react";
import {MenuSlideLayout} from "../MenuSlideLayout/MenuSlideLayout.tsx";
import {LoginSlideLayout} from "../LoginSlideLayout/LoginSlideLayout.tsx";

export const Header : React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    function toggleLogin() {
        setIsLoginOpen(!isLoginOpen);
    }

    return (
        <header className="header">
            <img src="src/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header__nav'>
                <button onClick={toggleLogin}
                        className="button-login"
                >
                    <img src="src/assets/images/icon-profile.svg" alt="login"/>
                </button>
                <button onClick={toggleMenu}
                        className="button-menu"
                >
                    <img src="src/assets/images/icon-menu_hamburger.svg" alt="menu_hamburger"/>
                </button>
            </nav>
            <MenuSlideLayout isOpen={isMenuOpen} toggleMenu={toggleMenu}/>
            <LoginSlideLayout isOpen={isLoginOpen} toggleLogin={toggleLogin}/>
        </header>
    );
};