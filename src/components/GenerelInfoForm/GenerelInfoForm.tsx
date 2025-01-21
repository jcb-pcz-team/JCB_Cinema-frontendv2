import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Interface representing the form values for general user information.
 * @interface
 */
interface GeneralInfoValues {
    /** User's login/username */
    login: string;
    /** User's first name */
    firstName: string;
    /** User's last name */
    lastName: string;
    /** User's phone number including country code (e.g., +48123456789) */
    phoneNumber: string;
    /** Street name of user's address */
    street: string;
    /** House number of user's address */
    houseNumber: string;
    /** Country dial code extracted from phone number (e.g., "48" from "+48123456789") */
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

/**
 * A form component for managing user's general information.
 *
 * @component
 * @example
 * ```tsx
 * const formik = useFormik({
 *   initialValues: {
 *     login: 'john.doe',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     phoneNumber: '+48123456789',
 *     street: 'Main Street',
 *     houseNumber: '42'
 *   },
 *   onSubmit: values => console.log(values)
 * });
 *
 * return (
 *   <GeneralInfoForm
 *     formik={formik}
 *     onUpdateSuccess={() => console.log('Profile updated!')}
 *   />
 * );
 * ```
 */
export const GeneralInfoForm: React.FC<Props> = ({ formik, onUpdateSuccess }) => {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    /**
     * Mutation hook for handling form submission
     * Handles the API call to update user information
     */
    const mutation =
        useMutation({
            /**
             * Mutation function that sends the form data to the API
             * @param values - Form values to be submitted
             * @throws {Error} When the API request fails
             * @returns The response data from the API
             */
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
    /**
     * Formats field names for display as labels
     * @param field - Name of the form field
     * @returns Formatted label string
     */
    const formatFieldLabel = (field: keyof GeneralInfoValues): string => {
        if (field === 'phoneNumber') {
            return 'Phone Number (e.g. +48123456789)';
        }
        return field.charAt(0).toUpperCase() +
            field.slice(1).replace(/([A-Z])/g, ' $1');
    };
    /**
     * Handles changes to form fields
     * @param e - Change event from input field
     */
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
        formik.setFieldTouched(name, true, false);
    };
    /**
     * Handles changes to phone number field
     * Formats the phone number and removes invalid characters
     * @param e - Change event from phone number input
     */
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