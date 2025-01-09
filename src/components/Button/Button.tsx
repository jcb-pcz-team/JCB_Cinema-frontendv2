import "./Button.scss";
import React from "react";
import { ButtonProps } from "../../types/components.types";

export const Button: React.FC<ButtonProps> = ({
                                                  type = "button",
                                                  children,
                                                  className = "button",
                                                  disabled,
                                                  onClick
                                              }) => {
    return (
        <button
            type={type}
            className={`button ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            <p className="paragraph--black">{children}</p>
        </button>
    );
};