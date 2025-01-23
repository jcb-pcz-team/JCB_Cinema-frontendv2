import './HeaderDesktop.scss';
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

// interface HeaderDesktopProps {
//     scrollToShowtimes?: () => void;
// }
const ROUTES = {
    PROFILE: '/dashboard/profile',
    TICKETS: '/dashboard/tickets'
} as const;

interface Movie {
    title: string;
    normalizedTitle: string;
    description: string;
    genre: {
        genreName: string;
    };
    duration: number;
}

export const HeaderDesktop : React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

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
                if (window.location.pathname === '/') {
                    const element = document.getElementById('showtimes');
                    element?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    navigate('/?scrollTo=showtimes');
                }
                break;
            case 'Upcoming':
                if (window.location.pathname === '/') {
                    const element = document.getElementById('upcoming');
                    element?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    navigate('/?scrollTo=upcoming');
                }
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
        const fullPath = path.startsWith('/') ? path : `/${path}`;
        navigate(fullPath);
        setIsDropdownOpen(false);
    }

    // Fetch movies for search
    const { data: movies = [] } = useQuery<Movie[]>({
        queryKey: ['movies'],
        queryFn: async () => {
            const response = await fetch('https://localhost:7101/api/movies');
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000
    });

    // Filter movies based on search term
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setShowSearchResults(true);
    };

    const handleMovieClick = (normalizedTitle: string) => {
        navigate(`/movies/${normalizedTitle}`);
        setShowSearchResults(false);
        setSearchTerm('');
    };

    return (
        <header className="header-desktop">
            <img src="/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header-desktop__navbar'>
                <div className="button-container">
                    {['Home', 'Showtimes', 'Upcoming'].map((label, index) => (
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
                    <div className="search-container" ref={searchRef}>
                        <input
                            className="input-search"
                            type="search"
                            placeholder="Search For Movies"
                            value={searchTerm}
                            onChange={handleSearch}
                            onFocus={() => setShowSearchResults(true)}
                        />
                        {showSearchResults && searchTerm && (
                            <div className="search-results">
                                {filteredMovies.length > 0 ? (
                                    filteredMovies.map((movie) => (
                                        <div
                                            key={movie.normalizedTitle}
                                            className="search-result-item"
                                            onClick={() => handleMovieClick(movie.normalizedTitle)}
                                        >
                                            <div className="search-result-title">{movie.title}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="search-result-item">No movies found</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="auth-buttons">
                        <img className="icon-profile" src="/assets/images/icon-profile.svg" alt="profile"/>
                        <p className="paragraph">
                            {isLoggedIn ? (
                                <div className="account-dropdown" ref={dropdownRef}>
                                    <span onClick={toggleDropdown}>
                                        Account
                                    </span>
                                    {isDropdownOpen && (
                                        <div className="dropdown-menu">
                                            <div
                                                className="dropdown-item"
                                                onClick={() => handleMenuItemClick(ROUTES.PROFILE)}
                                            >
                                                Profile
                                            </div>
                                            <div
                                                className="dropdown-item"
                                                onClick={() => handleMenuItemClick(ROUTES.TICKETS)}
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