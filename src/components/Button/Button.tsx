import "./Button.scss";
import React from "react";
import { ButtonProps } from "../../types/components.types";

/**
 * Reusable Button component with customizable properties
 *
 * @param type - The type of button (defaults to "button")
 * @param children - The content inside the button
 * @param className - Additional CSS classes (defaults to "button")
 * @param disabled - Whether the button is disabled
 * @param onClick - Click event handler
 *
 * @returns A styled button component
 */
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