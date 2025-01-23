import './HeaderMobile.scss';
import React, { useReducer } from "react";
import { MenuSlideLayout } from "../MenuSlideLayout/MenuSlideLayout.tsx";
import { LoginSlideLayout } from "../LoginSlideLayout/LoginSlideLayout.tsx";
import { SearchSlideLayout } from "../SearchSlideLayout/SearchSlideLayout.tsx";

type Action =
    | { type: 'toggle_menu' }
    | { type: 'toggle_login' }
    | { type: 'toggle_search' };

type State = {
    isMenuOpen: boolean;
    isLoginOpen: boolean;
    isSearchOpen: boolean;
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'toggle_menu':
            return { ...state, isMenuOpen: !state.isMenuOpen };
        case 'toggle_login':
            return { ...state, isLoginOpen: !state.isLoginOpen };
        case 'toggle_search':
            return { ...state, isSearchOpen: !state.isSearchOpen };
        default:
            return state;
    }
}

export const HeaderMobile: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, {
        isMenuOpen: false,
        isLoginOpen: false,
        isSearchOpen: false,
    });

    return (
        <header className="header-mobile">
            <img src="src/assets/images/logo.svg" alt="jcb cinema" className="logo" />
            <nav className="header-mobile__navbar">
                <button
                    onClick={() => dispatch({ type: 'toggle_search' })}
                    className="button-search"
                >
                    <img src="src/assets/images/icon-search.svg" alt="search" />
                </button>
                <button
                    onClick={() => dispatch({ type: 'toggle_login' })}
                    className="button-login"
                >
                    <img src="src/assets/images/icon-profile.svg" alt="login" />
                </button>
                <button
                    onClick={() => dispatch({ type: 'toggle_menu' })}
                    className="button-menu"
                >
                    <img src="src/assets/images/icon-menu_hamburger.svg" alt="menu_hamburger" />
                </button>
            </nav>
            <MenuSlideLayout isOpen={state.isMenuOpen} toggleMenu={() => dispatch({ type: 'toggle_menu' })} />
            <LoginSlideLayout isOpen={state.isLoginOpen} toggleLogin={() => dispatch({ type: 'toggle_login' })} />
            <SearchSlideLayout isOpen={state.isSearchOpen} toggleSearch={() => dispatch({ type: 'toggle_search' })} />
        </header>
    );
};
