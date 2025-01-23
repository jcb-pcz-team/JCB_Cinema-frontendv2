/**
 * @fileoverview Komponent formularza zmiany hasła.
 */

import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Wartości formularza zmiany hasła
 * @interface PasswordFormValues
 */
interface PasswordFormValues {
    /** Aktualne hasło */
    currentPassword: string;
    /** Nowe hasło */
    newPassword: string;
}

/**
 * Props komponentu PasswordForm
 * @interface Props
 */
interface Props {
    /** Obiekt formika do zarządzania formularzem */
    formik: FormikProps<PasswordFormValues>;
    /** Komunikat błędu formularza */
    formError: string | null;
}

/**
 * Komponent formularza zmiany hasła
 * @component
 * @param {Props} props - Props komponentu
 * @returns {JSX.Element} Formularz zmiany hasła
 */

export const PasswordForm: React.FC<Props> = ({ formik }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: PasswordFormValues) => {
            const response = await fetch('https://localhost:7101/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    oldPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            });

            let errorData;
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await response.json();
                } else {
                    errorData = await response.text();
                }
            } catch (error) {
                throw new Error('Server error occurred');
            }

            if (!response.ok) {
                if (typeof errorData === 'object' && errorData?.message) {
                    throw new Error(errorData.message);
                } else if (typeof errorData === 'string') {
                    throw new Error(errorData || 'Failed to change password');
                } else {
                    throw new Error('Failed to change password');
                }
            }

            return errorData;
        },
        onSuccess: () => {
            formik.resetForm();
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: Error) => {
            formik.setStatus({ error: error.message });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formik.isValid && !formik.isSubmitting) {
            mutation.mutate(formik.values);
        }
    };

    return (
        <div className="general-info-form">
            <div className="password-restriction">
                <p className="paragraph">
                    Your new password must not be the same as your current password, and it must contain at least 8
                    characters including two of the following:
                </p>
                <ul>
                    {['Uppercase Letter (A-Z)', 'Number (0-9)', 'Special Character (#$%! for example)'].map((item) => (
                        <li key={item} className="password-restriction__item">
                            <p className="paragraph">{item}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {successMessage && (
                <div className="success-message" role="alert">
                    <CheckCircle2 className="inline-block mr-2" size={20} />
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile__form">
                {['currentPassword', 'newPassword'].map((field) => (
                    <div key={field} className="form-field">
                        <label className="label" htmlFor={field}>
                            {field.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() +
                                field.replace(/([A-Z])/g, ' $1').slice(1)}
                        </label>
                        <div className="input-container">
                            <Input
                                id={field}
                                name={field}
                                className={`profile__input ${
                                    formik.touched[field as keyof PasswordFormValues] &&
                                    formik.errors[field as keyof PasswordFormValues] ? 'input--error' : ''
                                } ${
                                    formik.touched[field as keyof PasswordFormValues] &&
                                    !formik.errors[field as keyof PasswordFormValues] ? 'input--success' : ''
                                }`}
                                type="password"
                                placeholder={field.replace(/([A-Z])/g, ' $1')}
                                value={formik.values[field as keyof PasswordFormValues]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={mutation.isPending}
                            />
                            {formik.touched[field as keyof PasswordFormValues] &&
                                formik.errors[field as keyof PasswordFormValues] && (
                                    <div className="error-message" role="alert">
                                        <AlertCircle className="inline-block mr-2" size={16} />
                                        {formik.errors[field as keyof PasswordFormValues]}
                                    </div>
                                )}
                        </div>
                    </div>
                ))}

                <Button
                    type="submit"
                    className={`button--white ${(mutation.isPending || !formik.isValid || !formik.dirty) ? 'button--disabled' : ''}`}
                    disabled={mutation.isPending || !formik.isValid || !formik.dirty}
                >
                    {mutation.isPending ? 'CHANGING PASSWORD...' : 'CHANGE PASSWORD'}
                </Button>

                {formik.status?.error && (
                    <div className="error-message" role="alert">
                        <AlertCircle className="inline-block mr-2" size={20} />
                        {formik.status.error}
                    </div>
                )}
            </form>
        </div>
    );
};