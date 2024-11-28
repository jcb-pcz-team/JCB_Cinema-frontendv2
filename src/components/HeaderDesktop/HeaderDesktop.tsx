import './HeaderDesktop.scss';
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

// interface HeaderDesktopProps {
//     scrollToShowtimes?: () => void;
// }

export const HeaderDesktop : React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUserName = localStorage.getItem('userName');

        if (token && storedUserName) {
            setIsLoggedIn(true);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleButtonClick = (index: number, label: string) => {
        setActiveIndex(index);
        switch(label) {
            case 'Home':
                navigate('/');
                break;
            case 'Showtimes':
                if (location.pathname === '/' || location.pathname.startsWith('/dashboard')) {
                    navigate('/#showtimes');
                }
                break;
            case 'Upcoming':
                navigate('/upcoming');
                break;
            case 'Featured':
                navigate('/featured');
                break;
            case 'Benefits':
                navigate('/benefits');
                break;
            case 'About':
                navigate('/about');
                break;
            default:
                break;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        window.location.href = '/';
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        setIsDropdownOpen(false);
    }

    return (
        <header className="header-desktop">
            <img src="/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header-desktop__navbar'>
                <div className="button-container">
                    {['Home', 'Showtimes', 'Upcoming', 'Featured', 'Benefits', 'About'].map((label, index) => (
                        <button
                            key={index}
                            className={`paragraph nav-button ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleButtonClick(index, label)}
                        >
                            {label}
                            {activeIndex === index && <div className="indicator"></div>}
                        </button>
                    ))}
                </div>
                <div>
                    <input className="input-search" type="search" placeholder={"Search For Movies"}/>
                    <div className="auth-buttons">
                        <img className="icon-profile" src="/assets/images/icon-profile.svg" alt="profile"/>
                        <p className="paragraph">
                            {isLoggedIn ? (
                                <div className="account-dropdown">
                                    <span onClick={toggleDropdown}>
                                        Account
                                    </span>
                                    {isDropdownOpen && (
                                        <div className="dropdown-menu">
                                            <div
                                                className="dropdown-item"
                                                onClick={() => handleMenuItemClick('dashboard/profile')}
                                            >
                                                Profile
                                            </div>
                                            <div
                                                className="dropdown-item"
                                                onClick={() => handleMenuItemClick('dashboard/tickets')}
                                            >
                                                Tickets
                                            </div>
                                            <div
                                                className="dropdown-item"
                                                onClick={handleLogout}
                                            >
                                                Log out
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login">Login</Link>/
                                    <Link to="/register">Sign in</Link>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </nav>
        </header>
    );
};