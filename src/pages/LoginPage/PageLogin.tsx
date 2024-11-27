import "./PageLogin.scss";
import React, { ReactElement } from "react";

interface AuthPageProps {
    children: ReactElement<HTMLFormElement>;
}

export const PageLogin: React.FC<AuthPageProps> = ({ children }) => {
    return (
        <div className="login-page">
            <div className="login-page__container">
                <h3 className="login-page__header header--tertiary">Create free account</h3>
                {children}
            </div>
        </div>
    );
};
