import "./FormLogin.scss";
import {Input} from "../Input/Input.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import {Button} from "../Button/Button.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface ServerErrorResponse {
    message?: string;
}
//
// interface LoginResponse {
//     token: string;
//     role: string;
//     userName: string;
// }

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

    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

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
                    console.log('Token payload:', JSON.parse(atob(token.split('.')[1])));

                if (decodedToken) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userRole', decodedToken.role);
                    localStorage.setItem('userName', values.username);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Przekierowanie w zależności od roli
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