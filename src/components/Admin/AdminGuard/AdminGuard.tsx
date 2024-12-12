import { Navigate } from 'react-router-dom';

interface AdminGuardProps {
    children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'Admin') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};