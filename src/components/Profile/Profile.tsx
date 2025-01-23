/**
 * @fileoverview Komponent profilu użytkownika zawierający formularze edycji danych.
 */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GeneralInfoForm } from '../GenerelInfoForm/GenerelInfoForm.tsx';
import { EmailForm } from '../EmailForm/EmailForm.tsx';
import { PasswordForm } from '../PasswordForm/PasswordForm.tsx';
import './Profile.scss';

/**
 * Schemat walidacji danych ogólnych
 * @constant
 */

const generalInfoValidation = Yup.object().shape({
    login: Yup.string().required("Login is required"),
    firstName: Yup.string(),
    lastName: Yup.string(),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^\+\d{10,14}$/, 'Invalid phone number format'),
    street: Yup.string(),
    houseNumber: Yup.string(),
    dialCode: Yup.string(),
});

const emailValidation = Yup.object({
    currentEmail: Yup.string()
        .email('Invalid email address')
        .required('Current email is required'),
    newEmail: Yup.string()
        .email('Invalid email address')
        .required('New email is required')
        .notOneOf([Yup.ref('currentEmail')], 'New email must be different from current email')
});

const passwordValidation = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%!])/,
            'Password must contain at least one uppercase letter, one number, and one special character'
        )
});

/**
 * Interfejs danych użytkownika
 * @interface UserData
 */

interface UserData {
    login: string;
    email: string;
    phoneNumber: string;
    dialCode: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
}

/**
 * Komponent profilu użytkownika
 * @component
 * @returns {JSX.Element} Strona profilu użytkownika
 */

export const Profile: React.FC = () => {
    const [formError, setFormError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentEmail, setCurrentEmail] = useState(userData?.email || '');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const response = await fetch('https://localhost:7101/api/users', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json() as UserData;
                setUserData(data);
            } catch (error) {
                console.error('Error:', error);
                setFormError('Unable to load user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateSuccess = () => {
        setFormError(null);
    };

    const generalInfoFormik = useFormik({
        initialValues: {
            login: userData?.login || '',
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            phoneNumber: userData ? `${userData.dialCode}${userData.phoneNumber}` : '',
            street: userData?.street || '',
            houseNumber: userData?.houseNumber || '',
        },
        enableReinitialize: true,
        validationSchema: generalInfoValidation,
        onSubmit: async (values) => {
            try {
                const authToken = localStorage.getItem('authToken');
                const response = await fetch('https://localhost:7101/api/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(values)
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                handleUpdateSuccess();
            } catch (error) {
                console.error('Error updating profile:', error);
                setFormError(error instanceof Error ? error.message : 'Failed to update profile');
            }
        }
    });

    const emailFormik = useFormik({
        initialValues: {
            currentEmail: currentEmail,
            newEmail: '',
        },
        enableReinitialize: true,
        validationSchema: emailValidation,
        onSubmit: () => {}
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
        },
        validationSchema: passwordValidation,
        onSubmit: () => {}
    });

    if (isLoading) {
        return (
            <div className="profile">
                <h2 className="profile__header header--secondary">Profile</h2>
                <p className="profile__loading">Loading...</p>
            </div>
        );
    }

    return (
        <div className="profile">
            <div className="profile__content">
                <div className="profile__group">
                    <h2 className="profile__header header--secondary">General Info</h2>
                    <GeneralInfoForm
                        formik={generalInfoFormik}
                        onUpdateSuccess={handleUpdateSuccess}
                    />
                </div>

                <div className="profile__group">
                    <h2 className="profile__header header--secondary">Change Email</h2>
                    <EmailForm
                        formik={emailFormik}
                        formError={formError}
                        onEmailChange={(newEmail) => setCurrentEmail(newEmail)}
                    />
                </div>

                <div className="profile__group">
                    <h2 className="profile__header header--secondary">Change Password</h2>
                    <PasswordForm formik={passwordFormik} formError={formError} />
                </div>
            </div>
        </div>
    );
};