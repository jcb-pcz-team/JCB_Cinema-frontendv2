/**
 * @file PageLogin.tsx
 * @description React component that renders the login page of the application.
 */

import "./PageLogin.scss";
import React from "react";
import {FormLogin} from "../../components/FormLogin/FormLogin.tsx";

/**
 * @component PageLogin
 * @description A functional component that displays the login page layout.
 * The component renders a container with a header and the login form.
 *
 * @returns {JSX.Element} A login page containing a header and login form
 *
 * @example
 * ```tsx
 * <PageLogin />
 * ```
 */
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
