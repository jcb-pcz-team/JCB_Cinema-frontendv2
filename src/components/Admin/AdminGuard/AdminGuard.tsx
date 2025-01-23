/**
 * AdminGuard component that protects routes requiring admin privileges.
 * Redirects non-admin users to the login page.
 *
 * @component
 */
import { Navigate } from 'react-router-dom';

/**
 * Props for the AdminGuard component
 * @interface
 * @property {React.ReactNode} children - Child components to render if user has admin access
 */
interface AdminGuardProps {
    children: React.ReactNode;
}

/**
 * A guard component that checks if the user has admin privileges.
 * If the user is not an admin, they are redirected to the login page.
 *
 * @param {AdminGuardProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if user has admin access
 * @returns {JSX.Element} Protected route content or redirect to login
 */
export const AdminGuard = ({ children }: AdminGuardProps) => {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'Admin') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};