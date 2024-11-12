import './HeaderMobile.scss';
import React, {useState} from "react";
import {MenuSlideLayout} from "../MenuSlideLayout/MenuSlideLayout.tsx";
import {LoginSlideLayout} from "../LoginSlideLayout/LoginSlideLayout.tsx";
import {SearchSlideLayout} from "../SearchSlideLayout/SearchSlideLayout.tsx";

export const HeaderMobile : React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    function toggleLogin() {
        setIsLoginOpen(!isLoginOpen);
    }

    function toggleSearch() {
        setIsSearchOpen(!isSearchOpen);
    }

    return (
        <header className="header-mobile">
            <img src="src/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header-mobile__navbar'>
                <button onClick={toggleSearch}
                        className="button-search"
                >
                    <img src="src/assets/images/icon-search.svg" alt="login"/>
                </button>
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
            <SearchSlideLayout isOpen={isSearchOpen} toggleSearch={toggleSearch}/>
        </header>
    );
};