import React from "react";

export interface InputProps {
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export interface ButtonProps {
    type?: "submit" | "reset" | "button";
    className?: string;
    children: React.ReactNode | string;
}
