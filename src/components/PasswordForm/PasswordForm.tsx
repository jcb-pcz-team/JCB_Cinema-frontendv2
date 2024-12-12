import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation } from '@tanstack/react-query';

interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
}

interface Props {
    formik: FormikProps<PasswordFormValues>;
    formError: string | null;
}

export const PasswordForm: React.FC<Props> = ({ formik }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: PasswordFormValues) => {
            const url = new URL('https://localhost:7101/api/users/change-password');
            url.searchParams.append('CurrentPassword', data.currentPassword);
            url.searchParams.append('NewPassword', data.newPassword);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            return response.json();
        },
        onSuccess: () => {
            formik.resetForm();
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: Error) => {
            formik.setStatus(error.message);
        }
    });

    return (
        <>
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
                <div className="success-message">{successMessage}</div>
            )}
            <form onSubmit={(e) => {
                e.preventDefault();
                if (formik.isValid) {
                    mutation.mutate(formik.values);
                }
            }} className="profile__form">
                {['currentPassword', 'newPassword'].map((field) => (
                    <div key={field}>
                        <label className="label" htmlFor={field}>
                            {field.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() +
                                field.replace(/([A-Z])/g, ' $1').slice(1)}
                        </label>
                        <Input
                            id={field}
                            name={field}
                            className="profile__input"
                            type="password"
                            placeholder={field.replace(/([A-Z])/g, ' $1')}
                            value={formik.values[field as keyof PasswordFormValues]}
                            onChange={formik.handleChange}
                            disabled={mutation.isPending}
                        />
                        {formik.touched[field as keyof PasswordFormValues] &&
                            formik.errors[field as keyof PasswordFormValues] && (
                                <div className="error-message">
                                    <span>{formik.errors[field as keyof PasswordFormValues]}</span>
                                </div>
                            )}
                    </div>
                ))}
                <Button
                    type="submit"
                    className="button--white"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'CHANGING PASSWORD...' : 'CHANGE PASSWORD'}
                </Button>
                {mutation.isError && (
                    <div className="error-message">
                        <span>{formik.status}</span>
                    </div>
                )}
            </form>
        </>
    );
};