import "./PageRegister.scss";
import React from "react";
import {FormRegister} from "../../components/RegisterForm/RegisterForm.tsx";

export const PageRegister: React.FC = () => {
    return (
        <div className="register-page">
            <div className="register-page__container">
                <h3 className="register-page__header header--tertiary">Create free account</h3>
                <FormRegister/>
            </div>
        </div>
    );
};
