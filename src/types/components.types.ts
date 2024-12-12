import React from "react";

export interface InputProps {
    id?: string;
    name?: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    onBlur?: () => void;
    disabled?: boolean;
}

export interface ButtonProps {
    type?: "submit" | "reset" | "button";
    children: React.ReactNode | string;
    className: string;
    disabled?: boolean;
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