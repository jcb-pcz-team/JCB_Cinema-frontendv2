import "./RegisterForm.scss";
import { Input } from "../Input/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import { Button } from "../Button/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from 'lucide-react';

interface ServerErrorResponse {
    message?: string;
}

const decodeToken = (token: string) => {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return {
            role: decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedPayload.role,
            userName: decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"] || decodedPayload.name
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const FormRegister = () => {
    const [registrationError, setRegistrationError] = useState<string | null>(null);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'https://localhost:7101/api',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const formik = useFormik({
        initialValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            userName: Yup.string()
                .required("Username is required")
                .min(3, "Username must be at least 3 characters"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters")
                .matches(/[a-zA-Z]/, "Password must contain letters"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm Password is required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setRegistrationError(null);
                await axiosInstance.post('/auth/register', {
                    userName: values.userName,
                    password: values.password,
                    email: values.email,
                    role: "User"
                });

                // Login after successful registration
                const loginResponse = await axiosInstance.post<string>('/auth/login', {
                    userName: values.userName,
                    password: values.password,
                });

                const token = loginResponse.data;
                const decodedToken = decodeToken(token);

                if (decodedToken) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userRole', decodedToken.role);
                    localStorage.setItem('userName', values.userName);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    navigate('/');
                } else {
                    setRegistrationError('Invalid token received');
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        const serverError = error.response.data as ServerErrorResponse;
                        setRegistrationError(serverError.message || 'Registration failed');
                    } else if (error.request) {
                        setRegistrationError('No response from server');
                    } else {
                        setRegistrationError('Registration failed');
                    }
                } else {
                    setRegistrationError('Unexpected error occurred');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <form className="form-register" onSubmit={formik.handleSubmit}>
            {Object.keys(formik.initialValues).map((fieldName) => (
                <div key={fieldName} className="form-field">
                    <div className="input-container">
                        <Input
                            id={fieldName}
                            name={fieldName}
                            type={fieldName.toLowerCase().includes('password') ? 'password' : 'text'}
                            placeholder={fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[fieldName]}
                            className={`input ${
                                formik.touched[fieldName] && formik.errors[fieldName] ? 'input--error' : ''
                            } ${
                                formik.touched[fieldName] && !formik.errors[fieldName] ? 'input--success' : ''
                            }`}
                        />
                        {formik.touched[fieldName] && formik.errors[fieldName] && (
                            <div className="error-message" role="alert">
                                <AlertCircle className="inline-block mr-2" size={16} />
                                {formik.errors[fieldName]}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <Button
                type="submit"
                className="button"
                disabled={formik.isSubmitting}
            >
                {formik.isSubmitting ? 'Signing up...' : 'Sign up'}
            </Button>

            {registrationError && (
                <div className="error-container" role="alert">
                    <AlertCircle className="inline-block mr-2" size={20} />
                    <span className="error-message">{registrationError}</span>
                </div>
            )}
        </form>
    );
};