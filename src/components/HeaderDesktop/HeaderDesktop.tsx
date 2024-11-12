import './HeaderDesktop.scss';
import React, {useState} from "react";

export const HeaderDesktop : React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleButtonClick = (index: number) => {
        setActiveIndex(index);
    }

    return (
        <header className="header-desktop">
            <img src="src/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header-desktop__navbar'>
                <div className="button-container">
                    {['Home', 'Showtimes', 'Upcoming', 'Featured', 'Benefits', 'About'].map((label, index) => (
                        <button
                            key={index}
                            className={`nav-button ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleButtonClick(index)}
                        >
                            {label}
                            {activeIndex === index && <div className="indicator"></div>}
                        </button>
                    ))}
                </div>
                <div>
                    <input className="input-search" type="text" placeholder={"Search For Movies..."}/>
                    <div className="auth-buttons">
                        <img className="icon-profile" src="src/assets/images/icon-profile.svg" alt="profile"/>
                        <p>
                            Login / Sign in
                        </p>
                    </div>
                </div>
            </nav>
        </header>
    );
};