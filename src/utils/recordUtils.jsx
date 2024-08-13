import { editRecord } from "../features/record/recordsSlice";

export function filterAndSortRecords(records, filters, filterBy) {
    const filteredRecords = records.filter(record => 
        Object.entries(filters).every(([key, value]) => 
            String(record[key]).toLowerCase().includes(String(value).toLowerCase())
        )
    );

    return filteredRecords.sort((a, b) => {
        const aValue = a[filterBy.id];
        const bValue = b[filterBy.id];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return filterBy.descending ? bValue - aValue : aValue - bValue;
        }
        
        const comparison = String(aValue).localeCompare(String(bValue));
        return filterBy.descending ? -comparison : comparison;
    });
}