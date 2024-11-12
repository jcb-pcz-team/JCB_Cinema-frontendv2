import "./Button.scss";
import React from "react";
import { ButtonProps } from "../../types/components.types.ts";

export const Button: React.FC<ButtonProps> = ({ type = "button", children, buttonColor }) => {
    return (
        <button style={{backgroundColor: `${buttonColor + "B3"}`, border: `3px solid ${buttonColor}`}} type={type} className={`button`}>
            {children}
        </button>
    );
};
