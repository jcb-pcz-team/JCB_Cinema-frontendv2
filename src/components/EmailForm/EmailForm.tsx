import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface EmailFormValues {
    currentEmail: string;
    newEmail: string;
}

interface Props {
    formik: FormikProps<EmailFormValues>;
    onEmailChange: (newEmail: string) => void;
}

export const EmailForm: React.FC<Props> = ({ formik, onEmailChange }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const queryClient = useQueryClient();

    /**
     * Mutation for changing email address
     * Handles API call, error management, and success scenarios
     */
    const mutation = useMutation({
        /**
         * Mutation function to send email change request to the server
         * @param data - Email change form values
         * @returns Server response
         * @throws Error if email change fails
         */
        mutationFn: async (data: EmailFormValues) => {
            const response = await fetch('https://localhost:7101/api/users/change-email', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    currentEmail: data.currentEmail,
                    newEmail: data.newEmail
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
            } catch {
                throw new Error('Server error occurred');
            }

            if (!response.ok) {
                if (typeof errorData === 'object' && errorData?.message) {
                    throw new Error(errorData.message);
                } else if (typeof errorData === 'string') {
                    throw new Error(errorData || 'Failed to change email');
                } else {
                    throw new Error('Failed to change email');
                }
            }

            return errorData;
        },
        /**
         * Success handler for email change mutation
         * Resets form, updates UI, and invalidates user data cache
         * @param _ - Unused first parameter (mutation result)
         * @param variables - Mutation input variables
         */
        onSuccess: (_, variables) => {
            formik.resetForm({
                values: {
                    currentEmail: variables.newEmail,
                    newEmail: ''
                }
            });
            onEmailChange(variables.newEmail);
            setSuccessMessage('Email changed successfully!');
            queryClient.invalidateQueries({ queryKey: ['userData'] });
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        /**
         * Error handler for email change mutation
         * Sets form status with error message
         * @param error - Error object from mutation
         */
        onError: (error: Error) => {
            formik.setStatus({ error: error.message });
        }
    });

    /**
     * Handles form submission
     * Triggers email change mutation if form is valid
     * @param e - Form submission event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formik.isValid && !formik.isSubmitting) {
            mutation.mutate(formik.values);
        }
    };

    return (
        <div className="general-info-form">
            {successMessage && (
                <div className="success-message" role="alert">
                    <CheckCircle2 className="inline-block mr-2" size={20} />
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile__form">
                {['currentEmail', 'newEmail'].map((field) => (
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
                                    formik.touched[field as keyof EmailFormValues] &&
                                    formik.errors[field as keyof EmailFormValues] ? 'input--error' : ''
                                } ${
                                    formik.touched[field as keyof EmailFormValues] &&
                                    !formik.errors[field as keyof EmailFormValues] ? 'input--success' : ''
                                }`}
                                type="email"
                                placeholder={field.replace(/([A-Z])/g, ' $1')}
                                value={formik.values[field as keyof EmailFormValues]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={mutation.isPending}
                            />
                            {formik.touched[field as keyof EmailFormValues] &&
                                formik.errors[field as keyof EmailFormValues] && (
                                    <div className="error-message" role="alert">
                                        <AlertCircle className="inline-block mr-2" size={16} />
                                        {formik.errors[field as keyof EmailFormValues]}
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
                    {mutation.isPending ? 'CHANGING EMAIL...' : 'CHANGE EMAIL'}
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