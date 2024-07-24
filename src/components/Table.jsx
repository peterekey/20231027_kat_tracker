import './Table.css';
import Record from '../features/record/Record';
import { useDispatch, useSelector } from 'react-redux'
import {
    loadAllRecords,
    selectAllRecords,
    isLoading,
    hasError,
    addNewRecord,
    editRecord
} from '../features/record/recordsSlice';
import { useEffect, useState } from 'react';
import inputs from '../config/inputsConfig';
import addLogo from '../assets/add.png';
import deleteLogo from '../assets/delete.png';

export default function Table() {
    const [visibleRecords, setVisibleRecords] = useState([]);
    const [filters, setFilters] = useState({});
    const [filterBy, setFilterBy] = useState({id: 'datetime', descending: true});
    
    const dispatch = useDispatch()
    
    const allRecords = useSelector(selectAllRecords)

    useEffect(() => {
        dispatch(loadAllRecords())
        setVisibleRecords(allRecords.records)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isLoadingRecords = useSelector(isLoading)
    const hasErrorRecords = useSelector(hasError)


    // Filter records based on column filters
    const recordsToShowII = (columnFilters) => {
        const filtersArr = Object.entries(columnFilters)
        // console.log('allRecords.records is ', allRecords.records)
        const filteredItems = allRecords.records.filter(object => {
            // console.log('in filteredItems, object is ', object)
            const result = filtersArr.every(([key, values]) => {
                // console.log('current key is ', key)
                // console.log('current values is ', values)
                if(isNaN(object[key])) {
                    // console.log(`In the isNaN for ${object[key]}`)
                    return object[key].includes(values)
                } else {
                    // console.log(`Not in the isNaN for ${object[key]}`)
                    return [object[key]].includes(+values)
                } 
            })
            if (result) {
                // console.log(result)
                // console.log(object)
                return object
            }
        })
        // console.log('filteredItems is ', filteredItems)

        const compareFunction = (firstItem, secondItem) => {
            let a, b;
            let fieldName = filterBy.id;
            switch(fieldName) {
                case 'datetime':
                case 'reps':
                case 'weight':
                    a = Number(firstItem[fieldName]);
                    b = Number(secondItem[fieldName]);
                    return filterBy.descending ? b - a : a - b;
                case 'exercise':
                case 'equipment':
                case 'special':
                case 'difficulty':
                    a = String(firstItem[fieldName]).toLowerCase();
                    b = String(secondItem[fieldName]).toLowerCase();
                    if (a < b) { return filterBy.descending ? 1 : -1; }
                    if (a > b) { return filterBy.descending ? -1 : 1; }
                    return 0;
                default:
                    console.log('oh nooo something happened :(');
                    break;
            }
            
            
        }

        const filtered = filteredItems.sort(compareFunction);
        return filtered
    }

    const handleTextChange = (event) => {
        const { value, id } = event.target
        if (value === '') {
            setFilters((prev) => {
                const filteredObject = {}
                for (const key in prev) {
                    if (key !== id) {
                        filteredObject[key] = prev[key]
                    }
                }
                return filteredObject
            })
        }

        else {
            setFilters((prev) => ({
                ...prev,
                [id]: value
            }))
        }

    }

    const handleAddRecord = () => {
        const lastRecord = allRecords.records[allRecords.records.length - 1];
        const newExerciseId = lastRecord.exerciseId + 1;
        const input = { "exerciseId": newExerciseId };
        input.datetime =  document.getElementById('datetime').value || Date.now();
        const keys = ['exercise', 'equipment', 'reps', 'special', 'weight', 'difficulty'];
        for (const key of keys) {
            switch (true) {
                case (key === 'reps' || key === 'weight'):
                    input[key] = Number(document.getElementById(key).value) || 0;
                    break
                case (key === 'exercise' || key === 'equipment' || key === 'special' || key === 'difficulty'):
                    input[key] = document.getElementById(key).value || '';
                    break
            }
            
        }
        dispatch(addNewRecord(input))
    }

    const handleClearInputs = () => {
        setFilters({});
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.value = '');
    }

    const handleEditRecord = (editedRecord) => {
        // console.log(editedRecord);
        dispatch(editRecord(editedRecord));
    }
    
    useEffect(() => {
        setVisibleRecords(recordsToShowII(filters))
        const logos = [...document.getElementsByClassName("icon")];
        if (Object.keys(filters).length > 0) {
            logos.forEach(logo => logo.style.visibility = 'visible');
        } else {
            logos.forEach(logo => logo.style.visibility = 'hidden');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, allRecords, filterBy])

    const handleServerReponses = () => {
        if (visibleRecords.length === 0 && !isLoadingRecords && !hasErrorRecords) {
            return <tr><td>no data...</td></tr>
        }

        if (isLoadingRecords) {
            return <tr><td>loading data...</td></tr>
        }
    
        if (hasErrorRecords) {
            return <tr><td>an error occurred</td></tr>
        }

        return (
            <>
                {visibleRecords.map(record => (
                    <Record 
                        key={record.exerciseId}
                        record={record}
                        inputs={inputs}
                        handleEditRecord={handleEditRecord}
                    />
                ))}
            </>
        )
    }

    const changeSortOrder = (event, fieldname) => {
        const columnHeader = event.target.tagName.toLowerCase() === ('i' || 'label' || 'span') ? event.target.parentElement : event.target;

        console.log(columnHeader)
        console.log(fieldname);
        
        setFilterBy((prev) => (
            {
                ...prev,
                id: fieldname,
                descending: !prev.descending
            }
        ));
    }
    
    return (
        <table>
            <thead>
                <tr>
                    {inputs.map(input => (
                        <th key={input.id} onClick={(event) => changeSortOrder(event, input.id)}>
                            <label htmlFor={input.id}>{input.id}</label>
                            <span>
                                {input.id === filterBy.id ? <i className={filterBy.descending == true ? 'arrow down' : 'arrow up'}></i> : (<span></span>)}
                            </span>
                        </th>
                    ))}
                    <th key="addButton"></th>
                    <th key="deleteButton"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {inputs.map((input) => {
                            const {options, ...rest} = input
                            return (
                                <td key={input.id} >
                                    <input name="input" {...rest} onChange={handleTextChange}/>
                                    { !("list" in input) ? null : (
                                            <datalist id={input.list}>
                                                {options.map((optionValue) => {
                                                    return (<option key={optionValue} value={optionValue}></option>)
                                                })}
                                            </datalist>
                                        )
                                    }
                                </td>
                            )
                        }
                    )}
                    <td id="addLogo" className="header-icon">
                        <img 
                            src={addLogo} 
                            className="icon"
                            id="addLogoImage" 
                            alt="Add as new record"
                            aria-label="Add as new record"
                            onClick={handleAddRecord}
                        />
                    </td>
                    <td id="deleteLogo" className="header-icon">
                        <img
                            src={deleteLogo}
                            className="icon"
                            id="deleteLogoImage"
                            alt="Clear inputs"
                            aria-label="Delete all inputs"
                            onClick={handleClearInputs}
                        />
                    </td>
                </tr>
                {handleServerReponses()}
            </tbody>
        </table>
    )
}