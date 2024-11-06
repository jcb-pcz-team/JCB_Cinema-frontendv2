import './Header.scss';

export const Header = () => {
    return (
        <header className="header">
            <img src="src/assets/images/logo.svg" alt="jcb cinema" className="logo"/>
            <nav className='header-nav'>
                <button className="login-btn">
                    <p className="paragraph">LOG IN</p>
                </button>
            </nav>
        </header>
    );
};