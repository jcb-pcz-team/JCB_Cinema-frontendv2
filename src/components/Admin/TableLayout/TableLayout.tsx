import React from 'react';
import "./TableLayout.scss";

/**
 * Represents a sorting option for the table
 */
interface SortOption {
    /** The value used for sorting */
    value: string;
    /** The label displayed for the sort option */
    label: string;
}

/**
 * Props for the TableLayout component
 */
interface TableLayoutProps {
    /** The title of the table */
    title: string;
    /** Child components to be rendered within the table layout */
    children: React.ReactNode;
    /**
     * Callback function for search functionality
     * @param value - The search term entered by the user
     */
    onSearch: (value: string) => void;
    /**
     * Callback function for sorting functionality
     * @param value - The sort option selected by the user
     */
    onSort: (value: string) => void;
    /** Available sorting options for the table */
    sortOptions: SortOption[];
    /**
     * Optional callback for adding a new item
     * @returns void
     */
    onAddNew?: () => void;
}

/**
 * A reusable layout component for tables with search and sort functionality
 *
 * @param props - The component props
 * @returns A React component representing the table layout
 */
export const TableLayout: React.FC<TableLayoutProps> = ({
                                                            title,
                                                            children,
                                                            onSearch,
                                                            onSort,
                                                            sortOptions,
                                                            onAddNew
                                                        }) => {
    return (
        <div className="table-layout">
            <div className="table-layout__header">
                <div className="table-layout__title">
                    <h1>{title}</h1>
                    {onAddNew && (
                        <button
                            className="button button--primary"
                            onClick={onAddNew}
                        >
                            Add New
                        </button>
                    )}
                </div>
            </div>
            <div className="table-layout__filters">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="filters__search"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    {/*{sortOptions && (*/}
                    {/*    <select*/}
                    {/*        className="filters__select"*/}
                    {/*        onChange={(e) => onSort(e.target.value)}*/}
                    {/*    >*/}
                    {/*        <option value="">Sort by...</option>*/}
                    {/*        {sortOptions.map(option => (*/}
                    {/*            <option key={option.value} value={option.value}>*/}
                    {/*                {option.label}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </select>*/}
                    {/*)}*/}
                </div>
            </div>
            {children}
        </div>
    );
};