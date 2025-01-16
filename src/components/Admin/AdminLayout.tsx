import { Outlet, NavLink } from 'react-router-dom';
import './AdminLayout.scss';

/**
 * Admin Layout component that provides a consistent layout for the admin dashboard
 *
 * This component includes:
 * - A sidebar with navigation links
 * - A logout button
 * - A main content area that renders child routes
 *
 * @returns A React component representing the admin layout
 */
export const AdminLayout = () => {
    /**
     * Configuration for admin sidebar menu items
     * Each item represents a different admin section
     */
    const menuItems = [
        { path: '/admin/movies', label: 'Movies' },
        { path: '/admin/projections', label: 'Movie Projections' },
        { path: '/admin/schedules', label: 'Schedules' },
        { path: '/admin/schedules-detailed', label: 'Schedules Detailed' },
        { path: '/admin/users', label: 'Users' },
        // { path: '/admin/tickets', label: 'Booking Tickets' },
    ];

    /**
     * Handles user logout by clearing authentication tokens
     * and redirecting to the home page
     */
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.href = '/';
    };
    return (
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className="admin-sidebar__header">
                        <h2>Admin Panel</h2>
                        <button
                            className="button button--primary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                    <nav className="admin-sidebar__nav">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
    );
};
