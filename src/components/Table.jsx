// Table.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    loadAllRecords, 
    selectAllRecords, 
    isLoading, 
    hasError, 
    editRecord, 
    addNewRecord } from '../features/record/recordsSlice';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import FilterRow from './FilterRow';
import { filterAndSortRecords } from '../utils/recordUtils';
import './Table.css';

export default function Table() {
    const [visibleRecords, setVisibleRecords] = useState([]);
    const [filters, setFilters] = useState({});
    const [filterBy, setFilterBy] = useState({ id: 'datetime', descending: true });
    
    const dispatch = useDispatch();
    const allRecords = useSelector(selectAllRecords);
    const isLoadingRecords = useSelector(isLoading);
    const hasErrorRecords = useSelector(hasError);

    useEffect(() => {
        dispatch(loadAllRecords());
    }, [dispatch]);

    useEffect(() => {
        setVisibleRecords(filterAndSortRecords(allRecords.records, filters, filterBy));
    }, [allRecords, filters, filterBy]);

    const handleTextChange = (event) => {
        const { value, id } = event.target;
        setFilters(prev => {
            if (value === '') {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: value };
        });
    };

    const handleClearInputs = () => {
        setFilters({});
    };

    const changeSortOrder = (fieldname) => {
        setFilterBy(prev => ({
            id: fieldname,
            descending: prev.id === fieldname ? !prev.descending : true
        }));
    };

    const handleEditRecord = (editedRecord) => {
        dispatch(editRecord(editedRecord));
    }

    return (
        <table>
            <TableHeader 
                filterBy={filterBy} 
                changeSortOrder={changeSortOrder} 
            />
            <tbody>
                <FilterRow 
                    handleTextChange={handleTextChange}
                    handleClearInputs={handleClearInputs}
                />
                <TableBody 
                    visibleRecords={visibleRecords}
                    isLoadingRecords={isLoadingRecords}
                    hasErrorRecords={hasErrorRecords}
                    handleEditRecord={handleEditRecord}
                />
            </tbody>
        </table>
    );
}