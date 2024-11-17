import "./Button.scss";
import React from "react";
import { ButtonProps } from "../../types/components.types.ts";

export const Button: React.FC<ButtonProps> = ({ type = "button", children, className = "button"}) => {
    return (
        <button onClick={() => console.log('Button clicked!')} type={type} className={`button ${className}`}>
            <p className="paragraph--black">{children}</p>
        </button>
    );
};