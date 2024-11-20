import "./Profile.scss";

import React, {useState} from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import {Input} from "../Input/Input.tsx";
import {Button} from "../Button/Button.tsx";

export const Profile: React.FC = () => {
    const [formError, setFormError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            city: '',
            street: '',
            currentPassword: '',
            newPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('This field is required'),
            // password: Yup.string()
            //     .required('Password is required')
            //     .min(8, 'Password must be at least 8 characters')
            //     .matches(/[a-zA-Z]/, 'Password must contain letters'),
        }),
        onSubmit: (values) => {
            if (values.email) {
                setFormError(null);
            } else {
                setFormError("Invalid email or password");
            }
        },
    });

    return (
        <div className="profile">
            <h2 className="profile__header">
                General Info
            </h2>
            <form onSubmit={formik.handleSubmit} className="profile__form">
                <div>
                    <label className="label" htmlFor="">Email</label>
                    <Input className="profile__input" type="text" placeholder="Email" value={formik.values.email}
                           onChange={formik.handleChange}/>
                    {formik.touched.email && formik.errors.email ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.email}
                        </span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="">First Name</label>
                    <Input className="profile__input" type="text" placeholder="First Name"
                           value={formik.values.firstName} onChange={formik.handleChange}/>
                    {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.firstName}
                        </span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="">Last Name</label>
                    <Input className="profile__input" type="text" placeholder="Last Name" value={formik.values.lastName}
                           onChange={formik.handleChange}/>
                    {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.lastName}
                        </span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="">Phone Number</label>
                    <Input className="profile__input" type="text" placeholder="Email" value={formik.values.email}
                           onChange={formik.handleChange}/>
                    {formik.touched.email && formik.errors.email ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.email}
                        </span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="">City</label>
                    <Input className="profile__input" type="text" placeholder="City" value={formik.values.city}
                           onChange={formik.handleChange}/>
                    {formik.touched.city && formik.errors.city ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.city}
                        </span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="">Street</label>
                    <Input className="profile__input" type="text" placeholder="Street" value={formik.values.street}
                           onChange={formik.handleChange}/>
                    {formik.touched.street && formik.errors.street ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.street}
                        </span>
                        </div>
                    ) : null}
                </div>

                <Button type="submit" className="button--white">
                    SAVE CHANGES
                </Button>

                {formError && (
                    <div className="error-message">
                        <span>{formError}</span>
                    </div>
                )}
            </form>

            <h2 className="profile__header">
                Change Password
            </h2>
            <div className="password-restriction">
                <p className="paragraph">
                    Your new password must not be the same as your current password, and it must contain at least 8
                    characters including two of the following:
                </p>
                <ul>
                    <li className="password-restriction__item">
                        <p className="paragraph">
                            Uppercase Letter (A-Z)
                        </p>
                    </li>
                    <li>
                        <p className="paragraph">
                            Number (0-9)
                        </p>
                    </li>
                    <li>
                        <p className="paragraph">
                            Special Character (#$%! for example)
                        </p>
                    </li>
                </ul>
            </div>

            <form onSubmit={formik.handleSubmit} className="profile__form">
                <div>
                    <label className="label" htmlFor="">Current Password</label>
                    <Input className="profile__input" type="text" placeholder="Current Password"
                           value={formik.values.currentPassword}
                           onChange={formik.handleChange}/>
                    {formik.touched.currentPassword && formik.errors.currentPassword ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.currentPassword}
                        </span>
                        </div>
                    ) : null}
                </div>

                <div>
                    <label className="label" htmlFor="">New Password</label>
                    <Input className="profile__input" type="text" placeholder="New Password"
                           value={formik.values.newPassword} onChange={formik.handleChange}/>
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                        <div className="error-message">
                        <span>
                            {formik.errors.newPassword}
                        </span>
                        </div>
                    ) : null}
                </div>

                <Button type="submit" className="button--white">
                    CHANGE PASSWORD
                </Button>

                {formError && (
                    <div className="error-message">
                        <span>{formError}</span>
                    </div>
                )}
            </form>
        </div>
    );
};