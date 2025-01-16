import './Input.scss';
import React from "react";
import { InputProps } from "../../types/components.types.ts";

/**
 * Reusable Input Component
 *
 * A flexible input field with customizable properties
 *
 * @param id - Unique identifier for the input
 * @param name - Name attribute for the input
 * @param type - Type of input (text, password, email, etc.)
 * @param placeholder - Placeholder text for the input
 * @param value - Current value of the input (defaults to empty string)
 * @param onChange - Event handler for input changes
 * @param className - Additional CSS classes
 * @param onBlur - Event handler for blur event
 * @param disabled - Whether the input is disabled
 *
 * @returns A styled and configurable input element
 */
export const Input: React.FC<InputProps> = ({ id, name, type, placeholder, value="", onChange, className, onBlur, disabled }) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${className} input`.trim()}
            onBlur={onBlur}
            disabled={disabled}
        />
    );
};
