/**
 * @fileoverview Definicje typów dla współdzielonych komponentów aplikacji.
 */

import React from "react";

/**
 * Props dla komponentu Input, rozszerzające standardowe właściwości HTML input
 * @interface InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Unikalny identyfikator pola input */
    id: string;
    /** Nazwa pola formularza */
    name: string;
    /** Typ pola input (text, password, email, etc.) */
    type: string;
    /** Tekst placeholdera */
    placeholder?: string;
    /** Wartość pola input */
    value?: string;
    /** Handler zmiany wartości */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Handler utraty focusu */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Klasy CSS */
    className?: string;
    /** Flaga określająca czy pole jest wyłączone */
    disabled?: boolean;
}

/**
 * Props dla komponentu Button
 * @interface ButtonProps
 */
export interface ButtonProps {
    /** Typ przycisku */
    type?: "button" | "submit" | "reset";
    /** Zawartość przycisku */
    children: React.ReactNode;
    /** Klasy CSS */
    className?: string;
    /** Flaga określająca czy przycisk jest wyłączony */
    disabled?: boolean;
    /** Handler kliknięcia */
    onClick?: () => void;
}

/**
 * Interfejs reprezentujący podstawowe dane użytkownika
 * @interface UserData
 */
export interface UserData {
    /** Login użytkownika */
    login: string;
    /** Adres email */
    email: string;
    /** Imię */
    firstName: string;
    /** Nazwisko */
    lastName: string;
    /** Numer telefonu */
    phoneNumber: number;
    /** Kod kraju dla numeru telefonu */
    dialCode: string;
    /** Nazwa ulicy */
    street: string;
    /** Numer domu/mieszkania */
    houseNumber: string;
}

/**
 * Rozszerzony interfejs formularza profilu użytkownika
 * @interface ProfileFormValues
 * @extends {Omit<UserData, 'phoneNumber' | 'dialCode'>}
 */
export interface ProfileFormValues extends Omit<UserData, 'phoneNumber' | 'dialCode'> {
    /** Numer telefonu (jako string dla formularza) */
    phoneNumber: string;
    /** Aktualne hasło */
    currentPassword: string;
    /** Nowe hasło */
    newPassword: string;
    /** Aktualny email */
    currentEmail: string;
    /** Nowy email */
    newEmail: string;
}