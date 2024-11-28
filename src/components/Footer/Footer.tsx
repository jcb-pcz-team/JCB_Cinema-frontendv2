import './Footer.scss';

export const Footer = () => {
    return (
        <footer className="footer">
            <section className="footer__info overlay">
                <img src="src/assets/images/logo.svg" alt="jcb cinema" className="footer__logo logo"/>
                <p className="footer__description paragraph">
                    JCB CINEMA, where the magic of film meets modern comfort. Enjoy the latest blockbusters and timeless
                    classics in our state-of-the-art theater with immersive sound and crystal clarity!
                </p>
                <div className="footer__social">
                    <span className="footer__social-text paragraph">JOIN US ON</span>
                    <div className="footer__social-icons">
                        <img src="src/assets/images/instagram.svg" alt="Instagram" className="footer__social-icon"/>
                        <img src="src/assets/images/x.svg" alt="X" className="footer__social-icon"/>
                        <img src="src/assets/images/facebook.svg" alt="Facebook" className="footer__social-icon"/>
                    </div>
                </div>
            </section>
            <p className="footer__copyright paragraph">
                All rights reserved JCB CINEMA 2024 &copy;
            </p>
        </footer>
    );
};
