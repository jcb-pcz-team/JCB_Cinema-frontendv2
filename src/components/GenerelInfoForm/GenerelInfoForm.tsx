import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation } from '@tanstack/react-query';

interface GeneralInfoValues {
    login: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    houseNumber: string;
}

interface Props {
    formik: FormikProps<GeneralInfoValues>;
    formError: string | null;
    onUpdateSuccess: () => void;
}

type FormField = keyof GeneralInfoValues;

const FORM_FIELDS: FormField[] = [
    'login',
    'firstName',
    'lastName',
    'phoneNumber',
    'street',
    'houseNumber'
];

export const GeneralInfoForm: React.FC<Props> = ({ formik, onUpdateSuccess }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const formatFieldLabel = (field: string): string => {
        return field.charAt(0).toUpperCase() +
            field.slice(1).replace(/([A-Z])/g, ' $1');
    };

    const mutation = useMutation({
        mutationFn: async (values: GeneralInfoValues) => {
            const url = new URL('https://localhost:7101/api/users');
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, value.toString());
                }
            });

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            return response.json();
        },
        onSuccess: () => {
            setSuccessMessage('Profile updated successfully!');
            onUpdateSuccess(); // Call the success callback
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: Error) => {
            formik.setStatus(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formik.isValid && !mutation.isPending) {
            mutation.mutate(formik.values);
        }
    };

    return (
        <>
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="profile__form">
                {FORM_FIELDS.map((field) => (
                    <div key={field} className="form-field">
                        <label className="label" htmlFor={field}>
                            {formatFieldLabel(field)}
                        </label>
                        <Input
                            id={field}
                            name={field}
                            className="profile__input"
                            type="text"
                            placeholder={formatFieldLabel(field)}
                            value={formik.values[field]}
                            onChange={formik.handleChange}
                            disabled={mutation.isPending}
                        />
                        {formik.touched[field] && formik.errors[field] && (
                            <div className="error-message">
                                <span>{formik.errors[field]}</span>
                            </div>
                        )}
                    </div>
                ))}
                <Button
                    type="submit"
                    className="button--white"
                    disabled={mutation.isPending || !formik.isValid || !formik.dirty}
                >
                    {mutation.isPending ? 'SAVING...' : 'SAVE CHANGES'}
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