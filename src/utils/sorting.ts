// Generic type for sortable items
type SortableItem = {
    [key: string]: any;
};

// Sort direction type
export type SortDirection = 'asc' | 'desc';

// Sort configuration type
export type SortConfig = {
    key: string;
    direction: SortDirection;
};

// Helper function to compare values for sorting
const compareValues = (a: any, b: any, direction: SortDirection): number => {
    // Handle null/undefined values
    if (a === null || a === undefined) return direction === 'asc' ? -1 : 1;
    if (b === null || b === undefined) return direction === 'asc' ? 1 : -1;

    // Convert dates to timestamps for comparison
    if (a instanceof Date && b instanceof Date) {
        return direction === 'asc'
            ? a.getTime() - b.getTime()
            : b.getTime() - a.getTime();
    }

    // Handle string comparisons
    if (typeof a === 'string' && typeof b === 'string') {
        const comparison = a.localeCompare(b);
        return direction === 'asc' ? comparison : -comparison;
    }

    // Handle number comparisons
    if (typeof a === 'number' && typeof b === 'number') {
        return direction === 'asc' ? a - b : b - a;
    }

    // Default comparison
    return direction === 'asc'
        ? String(a).localeCompare(String(b))
        : String(b).localeCompare(String(a));
};

// Main sorting function
export const sortItems = <T extends SortableItem>(
    items: T[],
    sortConfig: SortConfig | null
): T[] => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return compareValues(aValue, bValue, sortConfig.direction);
    });
};