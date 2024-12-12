import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation } from '@tanstack/react-query';

interface EmailFormValues {
    currentEmail: string;
    newEmail: string;
}

interface Props {
    formik: FormikProps<EmailFormValues>;
    formError: string | null;
}

export const EmailForm: React.FC<Props> = ({ formik }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: EmailFormValues) => {
            const url = new URL('https://localhost:7101/api/users/change-email');
            url.searchParams.append('CurrentEmail', data.currentEmail);
            url.searchParams.append('NewEmail', data.newEmail);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change email');
            }

            return response.json();
        },
        onSuccess: () => {
            formik.resetForm();
            setSuccessMessage('Email changed successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: Error) => {
            formik.setStatus(error.message);
        }
    });

    return (
        <>
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <form onSubmit={(e) => {
                e.preventDefault();
                if (formik.isValid) {
                    mutation.mutate(formik.values);
                }
            }} className="profile__form">
                {['currentEmail', 'newEmail'].map((field) => (
                    <div key={field}>
                        <label className="label" htmlFor={field}>
                            {field.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() +
                                field.replace(/([A-Z])/g, ' $1').slice(1)}
                        </label>
                        <Input
                            id={field}
                            name={field}
                            className="profile__input"
                            type="text"
                            placeholder={field.replace(/([A-Z])/g, ' $1')}
                            value={formik.values[field as keyof EmailFormValues]}
                            onChange={formik.handleChange}
                            disabled={mutation.isPending}
                        />
                        {formik.touched[field as keyof EmailFormValues] &&
                            formik.errors[field as keyof EmailFormValues] && (
                                <div className="error-message">
                                    <span>{formik.errors[field as keyof EmailFormValues]}</span>
                                </div>
                            )}
                    </div>
                ))}
                <Button
                    type="submit"
                    className="button--white"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'CHANGING EMAIL...' : 'CHANGE EMAIL'}
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