import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name: string;
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
}

export interface ButtonProps {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;  // Dodajemy obsługę onClick
}

export interface UserData {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    dialCode: string;
    street: string;
    houseNumber: string;
}

export interface ProfileFormValues extends Omit<UserData, 'phoneNumber' | 'dialCode'> {
    phoneNumber: string;
    currentPassword: string;
    newPassword: string;
    currentEmail: string;
    newEmail: string;
}