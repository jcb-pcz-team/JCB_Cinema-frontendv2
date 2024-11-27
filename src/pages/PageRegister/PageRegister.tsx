import "./PageRegister.scss";
import React, { ReactElement } from "react";

interface AuthPageProps {
    children: ReactElement<HTMLFormElement>;
}

export const PageRegister: React.FC<AuthPageProps> = ({ children }) => {
    return (
        <div className="register-page">
            <div className="register-page__container">
                <h3 className="register-page__header header--tertiary">Create free account</h3>
                {children}
            </div>
        </div>
    );
};
