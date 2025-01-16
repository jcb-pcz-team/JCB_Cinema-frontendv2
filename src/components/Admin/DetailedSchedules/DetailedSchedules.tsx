import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TableLayout } from '../TableLayout/TableLayout';

interface ScheduleDetail {
    date: string;
    movieCount: number;
    movieProjectionsCount: number;
    activeCinemaHalls: number;
    totalBookingTickets: number;
}

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export const DetailedSchedules = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const { data: schedules = [], isLoading, error } = useQuery({
        queryKey: ['detailed-schedules'],
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Not authenticated');

            const response = await fetch('https://localhost:7101/api/schedules/detailed', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch detailed schedules');
            return response.json();
        }
    });

    const filteredSchedules = useMemo(() => {
        if (!searchTerm) return schedules;

        const searchStr = searchTerm.toLowerCase();
        return schedules.filter((schedule: ScheduleDetail) =>
            schedule.date.toLowerCase().includes(searchStr) ||
            schedule.movieCount.toString().includes(searchStr) ||
            schedule.movieProjectionsCount.toString().includes(searchStr) ||
            schedule.activeCinemaHalls.toString().includes(searchStr) ||
            schedule.totalBookingTickets.toString().includes(searchStr)
        );
    }, [schedules, searchTerm]);

    const sortedSchedules = useMemo(() => {
        if (!sortConfig) return filteredSchedules;

        return [...filteredSchedules].sort((a, b) => {
            if (sortConfig.key === 'date') {
                return sortConfig.direction === 'asc'
                    ? a.date.localeCompare(b.date)
                    : b.date.localeCompare(a.date);
            }

            const aValue = a[sortConfig.key as keyof ScheduleDetail];
            const bValue = b[sortConfig.key as keyof ScheduleDetail];

            if (sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return bValue > aValue ? 1 : -1;
        });
    }, [filteredSchedules, sortConfig]);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const handleSort = (sortKey: string) => {
        setSortConfig(current => {
            if (!current || current.key !== sortKey) {
                return { key: sortKey, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key: sortKey, direction: 'desc' };
            }
            return null;
        });
    };

    const sortOptions = [
        { value: 'date', label: 'Date' },
        { value: 'movieCount', label: 'Movie Count' },
        { value: 'movieProjectionsCount', label: 'Projections Count' },
        { value: 'activeCinemaHalls', label: 'Active Halls' },
        { value: 'totalBookingTickets', label: 'Total Tickets' }
    ];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <TableLayout
            title="Schedule Statistics"
            onSearch={handleSearch}
            onSort={handleSort}
            sortOptions={sortOptions}
        >
            <table className="admin-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort('date')}>
                        Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('movieCount')}>
                        Movies {sortConfig?.key === 'movieCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('movieProjectionsCount')}>
                        Projections {sortConfig?.key === 'movieProjectionsCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('activeCinemaHalls')}>
                        Active Halls {sortConfig?.key === 'activeCinemaHalls' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('totalBookingTickets')}>
                        Total Tickets {sortConfig?.key === 'totalBookingTickets' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedSchedules.map((schedule) => (
                    <tr key={schedule.date}>
                        <td>{new Date(schedule.date).toLocaleDateString()}</td>
                        <td>{schedule.movieCount}</td>
                        <td>{schedule.movieProjectionsCount}</td>
                        <td>{schedule.activeCinemaHalls}</td>
                        <td>{schedule.totalBookingTickets}</td>
                    </tr>
                ))}
                {sortedSchedules.length === 0 && (
                    <tr>
                        <td colSpan={5} style={{textAlign: 'center'}}>
                            No schedules found{searchTerm ? ` matching "${searchTerm}"` : ''}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </TableLayout>
    );
};