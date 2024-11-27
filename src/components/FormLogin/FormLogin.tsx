import "./FormLogin.scss";
import {Input} from "../Input/Input.tsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Button} from "../Button/Button.tsx";

export const FormLogin = () => {
    const formik = useFormik<{
        email: string;
        password: string;
    }>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid is required")
                .required("Email is required"),
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
        <form className="form-login" action="">
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
            ></Input>
            <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
            ></Input>
            <Button className="button">Login</Button>
        </form>
    );
};