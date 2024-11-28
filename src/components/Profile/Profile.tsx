import "./Profile.scss";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import {Input} from "../Input/Input.tsx";
import {Button} from "../Button/Button.tsx";

interface UserData {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    dialCode: string;
    street: string;
    houseNumber: string;
}

interface ProfileFormValues {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    houseNumber: string;
    currentPassword: string;
    newPassword: string;
    currentEmail: string;
    newEmail: string;
}

export const Profile: React.FC = () => {
    const [formError, setFormError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<UserData | null>(null);

    const login = 'user1';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                if (!authToken) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`https://localhost:7101/api/users?Login=${login}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych użytkownika');
                }

                const data: UserData = await response.json();
                setUserData(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Błąd pobierania danych:', error);
                setFormError('Nie można załadować danych użytkownika');
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [login]);

    const formik = useFormik<ProfileFormValues>({
        initialValues: {
            login: userData?.login || '',
            email: userData?.email || '',
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            phoneNumber: userData ? `${userData.dialCode}${userData.phoneNumber}` : '',
            street: userData?.street || '',
            houseNumber: userData?.houseNumber || '',
            currentPassword: '',
            newPassword: '',
            currentEmail: userData?.email || '',
            newEmail: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            login: Yup.string()
                .required("Login is required"),
            email: Yup.string()
                .email('Invalid email address')
                .required('This field is required'),
            phoneNumber: Yup.string()
                .required('Phone number is required')
                .matches(/^\+\d{10,14}$/, 'Invalid phone number format'),
            newPassword: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[#$%!])/,
                    'Password must contain at least one uppercase letter, one number, and one special character'
                ),
            currentEmail: Yup.string()
                .email('Invalid email address')
                .required('Current email is required'),
            newEmail: Yup.string()
                .email('Invalid email address')
                .required('New email is required')
                .notOneOf([Yup.ref('currentEmail')], 'New email must be different from current email')
        }),
        onSubmit: async (values) => {
            try {
                console.log("cos");

                const response = await fetch(`https://localhost:7101/api/users`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({
                        login: values.login,
                        email: values.email,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        street: values.street,
                        houseNumber: values.houseNumber,
                        newPassword: values.newPassword,
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                setFormError(null);
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                setFormError('Unable to update profile');
            }
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <h2 className="profile__header">
                General Info
            </h2>
            <form onSubmit={formik.handleSubmit} className="profile__form">
                <div>
                    <label className="label" htmlFor="login">Login</label>
                    <Input
                        id="login"
                        name="login"
                        className="profile__input"
                        type="text"
                        placeholder="Login"
                        value={formik.values.login}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.login && formik.errors.login ? (
                        <div className="error-message">
                            <span>{formik.errors.login}</span>
                        </div>
                    ) : null}
                </div>
                <div>
                    <label className="label" htmlFor="email">Email</label>
                    <Input
                        id="email"
                        name="email"
                        className="profile__input"
                        type="text"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="error-message">
                            <span>{formik.errors.email}</span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="firstName">First Name</label>
                    <Input
                        id="firstName"
                        name="firstName"
                        className="profile__input"
                        type="text"
                        placeholder="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="error-message">
                            <span>{formik.errors.firstName}</span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="lastName">Last Name</label>
                    <Input
                        id="lastName"
                        name="lastName"
                        className="profile__input"
                        type="text"
                        placeholder="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="error-message">
                            <span>{formik.errors.lastName}</span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="phoneNumber">Phone Number</label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        className="profile__input"
                        type="text"
                        placeholder="Phone Number"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="error-message">
                            <span>{formik.errors.phoneNumber}</span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="street">Street</label>
                    <Input
                        id="street"
                        name="street"
                        className="profile__input"
                        type="text"
                        placeholder="Street"
                        value={formik.values.street}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.street && formik.errors.street ? (
                        <div className="error-message">
                            <span>{formik.errors.street}</span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="houseNumber">House Number</label>
                    <Input
                        id="houseNumber"
                        name="houseNumber"
                        className="profile__input"
                        type="text"
                        placeholder="House Number"
                        value={formik.values.houseNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.houseNumber && formik.errors.houseNumber ? (
                        <div className="error-message">
                            <span>{formik.errors.houseNumber}</span>
                        </div>
                    ) : null}
                </div>

                <Button type="submit" className="button--white">
                    SAVE CHANGES
                </Button>

                {formError && (
                    <div className="error-message">
                        <span>{formError}</span>
                    </div>
                )}
            </form>


            <h2 className="profile__header">
                Change Email
            </h2>

            <form onSubmit={formik.handleSubmit} className="profile__form">
                <div>
                    <label className="label" htmlFor="">Current Email</label>
                    <Input className="profile__input" type="text" placeholder="Current Password"
                           value={formik.values.currentPassword}
                           onChange={formik.handleChange}/>
                    {formik.touched.currentPassword && formik.errors.currentPassword ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.currentPassword}
                        </span>
                        </div>
                    ) : null}
                </div>
                <div>
                    <label className="label" htmlFor="">New Email</label>
                    <Input className="profile__input" type="text" placeholder="New Password"
                           value={formik.values.newPassword} onChange={formik.handleChange}/>
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.newPassword}
                        </span>
                        </div>
                    ) : null}
                </div>

                <Button type="submit" className="button--white">
                    CHANGE EMAIL
                </Button>

                {formError && (
                    <div className="error-message">
                        <span>{formError}</span>
                    </div>
                )}
            </form>

            <h2 className="profile__header">
                Change Password
            </h2>
            <div className="password-restriction">
                <p className="paragraph">
                    Your new password must not be the same as your current password, and it must contain at least 8
                    characters including two of the following:
                </p>
                <ul>
                    <li className="password-restriction__item">
                        <p className="paragraph">
                            Uppercase Letter (A-Z)
                        </p>
                    </li>
                    <li>
                        <p className="paragraph">
                            Number (0-9)
                        </p>
                    </li>
                    <li>
                        <p className="paragraph">
                            Special Character (#$%! for example)
                        </p>
                    </li>
                </ul>
            </div>

            <form onSubmit={formik.handleSubmit} className="profile__form">
                <div>
                    <label className="label" htmlFor="">Current Password</label>
                    <Input className="profile__input" type="text" placeholder="Current Password"
                           value={formik.values.currentPassword}
                           onChange={formik.handleChange}/>
                    {formik.touched.currentPassword && formik.errors.currentPassword ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.currentPassword}
                        </span>
                        </div>
                    ) : null}
                </div>
                <div>
                    <label className="label" htmlFor="">New Password</label>
                    <Input className="profile__input" type="text" placeholder="New Password"
                           value={formik.values.newPassword} onChange={formik.handleChange}/>
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.newPassword}
                        </span>
                        </div>
                    ) : null}
                </div>

                <Button type="submit" className="button--white">
                    CHANGE PASSWORD
                </Button>

                {formError && (
                    <div className="error-message">
                        <span>{formError}</span>
                    </div>
                )}
            </form>
        </div>
    );
};