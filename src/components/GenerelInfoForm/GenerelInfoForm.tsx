import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface GeneralInfoValues {
    login: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    houseNumber: string;
    dialCode?: string;
}

interface Props {
    formik: FormikProps<GeneralInfoValues>;
    onUpdateSuccess: () => void;
}

const FORM_FIELDS: (keyof GeneralInfoValues)[] = [
    'login',
    'firstName',
    'lastName',
    'phoneNumber',
    'street',
    'houseNumber'
];

export const GeneralInfoForm: React.FC<Props> = ({ formik, onUpdateSuccess }) => {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (values: GeneralInfoValues) => {
            let dialCode = '';
            let phoneNumber = values.phoneNumber;

            if (phoneNumber.startsWith('+')) {
                dialCode = phoneNumber.substring(1, 3);
                phoneNumber = phoneNumber.substring(3);
            }

            const dataToSend = {
                ...values,
                phoneNumber,
                dialCode,
            };

            const response = await fetch('https://localhost:7101/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(dataToSend)
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
                    throw new Error(errorData || 'Failed to update profile');
                } else {
                    throw new Error('Failed to update profile');
                }
            }

            return errorData;
        },
        onSuccess: () => {
            // Zachowaj obecne wartości formularza
            const currentValues = { ...formik.values };
            formik.resetForm();
            formik.setValues(currentValues);

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            queryClient.invalidateQueries({ queryKey: ['userData'] });
            onUpdateSuccess();
        },
        onError: (error: Error) => {
            formik.setStatus({ error: error.message });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formik.isValid && !formik.isSubmitting && formik.dirty) {
            mutation.mutate(formik.values);
        }
    };

    const formatFieldLabel = (field: keyof GeneralInfoValues): string => {
        if (field === 'phoneNumber') {
            return 'Phone Number (e.g. +48123456789)';
        }
        return field.charAt(0).toUpperCase() +
            field.slice(1).replace(/([A-Z])/g, ' $1');
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
        formik.setFieldTouched(name, true, false);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/[^\d+]/g, '');
        if (value.includes('+')) {
            value = '+' + value.replace(/\+/g, '');
        }
        formik.setFieldValue('phoneNumber', value);
        formik.setFieldTouched('phoneNumber', true, false);
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
                {FORM_FIELDS.map((field) => (
                    <div key={field} className="form-field">
                        <label htmlFor={field} className="label">
                            {formatFieldLabel(field)}
                        </label>
                        <div className="input-container">
                            <Input
                                id={field}
                                name={field}
                                type="text"
                                className={`profile__input ${
                                    formik.touched[field] && formik.errors[field] ? 'input--error' : ''
                                } ${
                                    formik.touched[field] && !formik.errors[field] ? 'input--success' : ''
                                }`}
                                placeholder={formatFieldLabel(field)}
                                value={formik.values[field]}
                                onChange={field === 'phoneNumber' ? handlePhoneNumberChange : handleFieldChange}
                                onBlur={formik.handleBlur}
                                disabled={mutation.isPending}
                            />
                            {formik.touched[field] && formik.errors[field] && (
                                <div className="error-message" role="alert">
                                    <AlertCircle className="inline-block mr-2" size={16} />
                                    {formik.errors[field]}
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
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
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