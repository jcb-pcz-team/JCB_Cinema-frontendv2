import "./FormLogin.scss";
import {Input} from "../Input/Input.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import {Button} from "../Button/Button.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

/**
 * Represents the structure of a server error response
 */
interface ServerErrorResponse {
    message?: string;
}
//
// interface LoginResponse {
//     token: string;
//     role: string;
//     userName: string;
// }

/**
 * Decodes a JWT token to extract user role and username
 *
 * @param token - The JWT token to decode
 * @returns An object with decoded user role and username, or null if decoding fails
 */
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


/**
 * Login Form Component
 *
 * Provides a login form with:
 * - Username and password inputs
 * - Form validation
 * - Authentication via API
 * - Role-based navigation
 *
 * @returns A React component for user login
 */
export const FormLogin = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();

    /**
     * Axios instance with predefined configuration
     * Includes base URL and default headers
     */
    const axiosInstance = axios.create({
        baseURL: 'https://localhost:7101/api',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Axios interceptors for token management and error handling
    // (existing interceptor code remains unchanged)

    /**
     * Formik configuration for login form
     * Includes initial values, validation schema, and submission handler
     */
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
                // Reset any previous login errors
                setLoginError(null);

                // Send login request
                const response = await axiosInstance.post<string>('/auth/login', {
                    userName: values.username,
                    password: values.password,
                });

                const token = response.data;
                const decodedToken = decodeToken(token);

                if (decodedToken) {
                    // Store authentication details
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userRole', decodedToken.role);
                    localStorage.setItem('userName', values.username);

                    // Set default authorization header
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Navigate based on user role
                    if (decodedToken.role === 'Admin') {
                        navigate('/admin/movies');
                    } else {
                        navigate('/');
                    }
                } else {
                    setLoginError('Invalid token received');
                }

            } catch (error) {
                // Comprehensive error handling
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
                console.error('Login error:', error);
            }
        },
    });

    return (
        <form className="form-login" onSubmit={formik.handleSubmit}>
            {/*<div>*/}
            {/*    <Input*/}
            {/*        id="email"*/}
            {/*        name="email"*/}
            {/*        type="email"*/}
            {/*        placeholder="Email"*/}
            {/*        onChange={formik.handleChange}*/}
            {/*        value={formik.values.email}*/}
            {/*    ></Input>*/}
            {/*    {formik.touched.email && formik.errors.email ? (*/}
            {/*        <span className="error">*/}
            {/*        {formik.errors.email}*/}
            {/*        </span>*/}
            {/*    ) : null}*/}
            {/*</div>*/}
            <div>
                <Input
                    id="username"
                    name="username"
                    type="username"
                    placeholder="Username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                ></Input>
                {formik.touched.username && formik.errors.username ? (
                    <span className="error">
                    {formik.errors.username}
                    </span>
                ) : null}
            </div>
            <div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                ></Input>
                {formik.touched.password && formik.errors.password ? (
                    <span className="error">
                {formik.errors.password}
              </span>
                ) : null}
            </div>
            <Button type="submit" className="button">Login</Button>
            {loginError && (
                <div className="registration__errors">
                    <span>{loginError}</span>
                </div>
            )}
        </form>
    );
};