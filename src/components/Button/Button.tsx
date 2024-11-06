import "./Button.scss";
import React from "react";
import { ButtonProps } from "../../types/components.types.ts";

export const Button: React.FC<ButtonProps> = ({ type = "button", className = "", children }) => {
    return (
        <button type={type} className={`${className} button`.trim()}>
            {children}
        </button>
    );
};
