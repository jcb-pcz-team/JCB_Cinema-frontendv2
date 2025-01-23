import "./FormLogin.scss";
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

export const FormLogin = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'https://localhost:7101/api',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const formik = useFormik<{
        username: string;
        password: string;
    }>({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required("Username is required"),
            password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters")
                .matches(/[a-zA-Z]/, "Password must contain letters")
        }),
        onSubmit: async (values) => {
            try {
                setLoginError(null);
                const response = await axiosInstance.post<string>('/auth/login', {
                    userName: values.username,
                    password: values.password,
                });

                const token = response.data;
                const decodedToken = decodeToken(token);

                if (decodedToken) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userRole', decodedToken.role);
                    localStorage.setItem('userName', values.username);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    if (decodedToken.role === 'Admin') {
                        navigate('/admin/movies');
                    } else {
                        navigate('/');
                    }
                } else {
                    setLoginError('Invalid token received');
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        const serverError = error.response.data as ServerErrorResponse;
                        setLoginError(serverError.message || 'Login failed');
                    } else if (error.request) {
                        setLoginError('No response from server');
                    } else {
                        setLoginError('An error occurred during login');
                    }
                } else {
                    setLoginError('Unexpected error');
                }
            }
        },
    });

    return (
        <form className="form-login" onSubmit={formik.handleSubmit}>
            {['username', 'password'].map((fieldName) => (
                <div key={fieldName} className="form-field">
                    <div className="input-container">
                        <Input
                            id={fieldName}
                            name={fieldName}
                            type={fieldName === 'password' ? 'password' : 'text'}
                            placeholder={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
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
                {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            {loginError && (
                <div className="error-container" role="alert">
                    <AlertCircle className="inline-block mr-2" size={20} />
                    <span className="error-message">{loginError}</span>
                </div>
            )}
        </form>
    );
};