/**
 * @fileoverview Funkcje pomocnicze do sortowania danych w aplikacji.
 */

/**
 * Typ generyczny dla elementów, które można sortować
 * @template T
 */
type SortableItem = {
    [key: string]: any;
};

/**
 * Kierunek sortowania
 * @type {('asc' | 'desc')}
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Konfiguracja sortowania
 * @interface
 */
export type SortConfig = {
    /** Klucz po którym sortujemy */
    key: string;
    /** Kierunek sortowania */
    direction: SortDirection;
};

/**
 * Porównuje dwie wartości dla celów sortowania
 * @private
 * @param {any} a - Pierwsza wartość do porównania
 * @param {any} b - Druga wartość do porównania
 * @param {SortDirection} direction - Kierunek sortowania
 * @returns {number} Wynik porównania (-1, 0, lub 1)
 */
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

/**
 * Sortuje tablicę elementów według zadanej konfiguracji
 * @template T
 * @param {T[]} items - Tablica elementów do posortowania
 * @param {SortConfig | null} sortConfig - Konfiguracja sortowania
 * @returns {T[]} Posortowana tablica elementów
 *
 * @example
 * ```typescript
 * const items = [{name: 'B'}, {name: 'A'}];
 * const sorted = sortItems(items, { key: 'name', direction: 'asc' });
 * // Returns: [{name: 'A'}, {name: 'B'}]
 * ```
 */
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