/**
 * @file PageRegister.tsx
 * @description React component that renders the registration page of the application.
 */

import "./PageRegister.scss";
import React from "react";
import {FormRegister} from "../../components/RegisterForm/RegisterForm.tsx";

/**
 * @component PageRegister
 * @description A functional component that displays the registration page layout.
 * The component renders a container with a header and the registration form.
 *
 * @returns {JSX.Element} A registration page with a header and registration form
 *
 * @example
 * ```tsx
 * <PageRegister />
 * ```
 */
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
