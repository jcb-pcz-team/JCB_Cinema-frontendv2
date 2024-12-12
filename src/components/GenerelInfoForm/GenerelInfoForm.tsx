import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

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
    const queryClient = useQueryClient()

    const { data: userData, isLoading } = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const response = await fetch('https://localhost:7101/api/users', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            return response.json();
        }
    });

    const formatFieldLabel = (field: string): string => {
        return field.charAt(0).toUpperCase() +
            field.slice(1).replace(/([A-Z])/g, ' $1');
    };

    const mutation = useMutation({
        mutationFn: async (values: GeneralInfoValues) => {
            const baseUrl = 'https://localhost:7101/api/users';
            const params = new URLSearchParams();

            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
                    params.append(pascalKey, value.toString());
                }
            });

            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(errorText || 'Failed to update profile');
            }

            return response.text() || null;
        },
        onSuccess: () => {
            setSuccessMessage('Profile updated successfully!');
            onUpdateSuccess();
            queryClient.invalidateQueries({ queryKey: ['userData'] });
            setTimeout(() => setSuccessMessage(null), 3000);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formik.isValid && !mutation.isPending) {
            mutation.mutate(formik.values);
        }
    };

    React.useEffect(() => {
        if (userData) {
            formik.setValues({
                login: userData.login || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phoneNumber: userData.phoneNumber || '',
                street: userData.street || '',
                houseNumber: userData.houseNumber || ''
            });
        }
    }, [userData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

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