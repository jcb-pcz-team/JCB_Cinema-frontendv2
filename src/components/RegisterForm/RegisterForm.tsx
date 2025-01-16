import "./RegisterForm.scss";
import {Input} from "../Input/Input.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button} from "../Button/Button.tsx";

/**
 * Registration Form Component
 *
 * Provides a comprehensive user registration form with:
 * - Personal information inputs
 * - Contact details
 * - Address information
 * - Password creation
 *
 * Uses Formik for form management and Yup for validation
 *
 * @returns A React component for user registration
 */
export const FormRegister = () => {
    /**
     * Formik configuration for registration form
     * Includes:
     * - Initial form values
     * - Validation schema
     * - Form submission handler
     */
    const formik = useFormik<{
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        city: string;
        street: string;
        houseNumber: string;
        password: string;
        confirmPassword: string;
        }>({
        // Initial form values with empty strings
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            city: "",
            street: "",
            houseNumber: "",
            password: "",
            confirmPassword: "",
        },
        // Validation rules using Yup
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required("First Name is required"),
            lastName: Yup.string()
                .required("Last Name is required"),
            email: Yup.string()
                .email("Invalid is required")
                .required("Email is required"),
            phoneNumber: Yup.number()
                .max(9),
            city: Yup.string(),
            street: Yup.string(),
            houseNumber: Yup.number()
                .max(5),
            password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters")
                .matches(/[a-zA-Z]/, "Password must contain letters")
        }),
            onSubmit: (values) => {
                console.log(values);
            },
    });

    return (
        <form className="form-register" action="">
            <div className="data-row">
                <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                ></Input>
                <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                ></Input>
            </div>
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
            ></Input>
            <Input
                id="phoneNumber"
                name="phoneNumber"
                type="phoneNumber"
                placeholder="Phone Number"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
            ></Input>
            <div className="data-row">
                <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City"
                    onChange={formik.handleChange}
                    value={formik.values.city}
                ></Input>
                <Input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Street"
                    onChange={formik.handleChange}
                    value={formik.values.street}
                ></Input>
                <Input
                    id="houseNumber"
                    name="houseNumber"
                    type="text"
                    placeholder="House Number"
                    onChange={formik.handleChange}
                    value={formik.values.houseNumber}
                ></Input>
            </div>
            <div className="data-row">
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                ></Input>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                ></Input>
            </div>
            <Button className="button">Sign up</Button>
        </form>
    );
};