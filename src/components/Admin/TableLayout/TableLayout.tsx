import React from 'react';
import "./TableLayout.scss";

interface SortOption {
    value: string;
    label: string;
}

interface TableLayoutProps {
    title: string;
    children: React.ReactNode;
    onSearch: (value: string) => void;
    onSort: (value: string) => void;
    sortOptions: SortOption[];
    onAddNew?: () => void; // Optional callback for Add New button
}

export const TableLayout: React.FC<TableLayoutProps> = ({
                                                            title,
                                                            children,
                                                            onSearch,
                                                            // onSort,
                                                            // sortOptions,
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
                    {/*<select*/}
                    {/*    className="filters__select"*/}
                    {/*    onChange={(e) => onSort(e.target.value)}*/}
                    {/*>*/}
                    {/*    /!*<option value="">Sort by...</option>*!/*/}
                    {/*    {sortOptions.map(option => (*/}
                    {/*        <option key={option.value} value={option.value}>*/}
                    {/*            {option.label}*/}
                    {/*        </option>*/}
                    {/*    ))}*/}
                    {/*</select>*/}
                </div>
            </div>
            {children}
        </div>
    );
};