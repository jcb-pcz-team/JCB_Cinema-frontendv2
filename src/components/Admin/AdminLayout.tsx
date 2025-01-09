import { Outlet, NavLink } from 'react-router-dom';
import './AdminLayout.scss';

export const AdminLayout = () => {
    const menuItems = [
        { path: '/admin/movies', label: 'Movies' },
        { path: '/admin/projections', label: 'Movie Projections' },
        { path: '/admin/halls', label: 'Cinema Halls' },
        { path: '/admin/schedules', label: 'Schedules' },
        { path: '/admin/users', label: 'Users' },
        // { path: '/admin/tickets', label: 'Booking Tickets' },
    ];

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
