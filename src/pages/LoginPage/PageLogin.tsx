import "./PageLogin.scss";
import React from "react";
import {FormLogin} from "../../components/FormLogin/FormLogin.tsx";

export const PageLogin: React.FC= () => {
    return (
        <div className="login-page">
            <div className="login-page__container">
                <h3 className="login-page__header header--tertiary">Create free account</h3>
                <FormLogin/>
            </div>
        </div>
    );
};
