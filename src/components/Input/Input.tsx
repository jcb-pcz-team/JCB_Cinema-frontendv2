import './Input.scss';
import React from "react";
import { InputProps } from "../../types/components.types.ts";

export const Input: React.FC<InputProps> = ({ id, name, type, placeholder, value="", onChange, className }) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${className} input`.trim()}
        />
    );
};
