import React from "react";

export interface InputProps {
    id?: string;
    name?: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export interface ButtonProps {
    type?: "submit" | "reset" | "button";
    children: React.ReactNode | string;
    className: string;
}
