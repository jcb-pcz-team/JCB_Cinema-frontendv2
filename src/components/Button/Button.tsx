import "./Button.scss";
import React from "react";
import { ButtonProps } from "../../types/components.types.ts";

export const Button: React.FC<ButtonProps> = ({ type = "button", children, className = "button", disabled}) => {

    return (
        <button type={type} className={`button ${className}`} disabled={disabled}>
            <p className="paragraph--black">{children}</p>
        </button>
    );
};