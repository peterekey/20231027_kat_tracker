import './Table.css'
import Record from '../features/record/Record'
import { useDispatch, useSelector } from 'react-redux'
import {
    loadAllRecords,
    selectAllRecords,
    isLoading,
    hasError,
    addNewRecord
} from '../features/record/recordsSlice'
import { useEffect, useState } from 'react'
import addLogo from '../assets/add.png'

export default function Table() {
    const [visibleRecords, setVisibleRecords] = useState([])
    const [filters, setFilters] = useState({})
    
    const dispatch = useDispatch()
    
    const allRecords = useSelector(selectAllRecords)

    useEffect(() => {
        dispatch(loadAllRecords())
        setVisibleRecords(allRecords.records)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(() => {
    //     setVisibleRecords(allRecords.records)
    //     // setVisibleRecords(recordsToShowII(filters))
    // }, [allRecords])

    const isLoadingRecords = useSelector(isLoading)
    const hasErrorRecords = useSelector(hasError)

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
        return filteredItems
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
        const input = {}
        input.datetime =  document.getElementById('datetime').value || Date.now()
        const keys = ['exercise', 'equipment', 'reps', 'special', 'weight', 'difficulty']
        for (const key of keys) {
            switch (true) {
                case (key === 'reps' || key === 'weight'):
                    input[key] = Number(document.getElementById(key).value) || 0
                    break
                case (key === 'exercise' || key === 'equipment' || key === 'special' || key === 'difficulty'):
                    input[key] = document.getElementById(key).value || ''
                    break
            }
            
        }
        dispatch(addNewRecord(input))
    }
    
    useEffect(() => {
        // console.log('running setVisibleREcords')
        setVisibleRecords(recordsToShowII(filters))
        const logo = document.getElementById("addLogoImage")
        if (Object.keys(filters).length > 0) {
            logo.style.visibility = 'visible'
        } else {
            logo.style.visibility = 'hidden'
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, allRecords])

    const inputs = [
        {
            type: "text",
            id: "exercise",
            name: "exercise", 
        },
        {
            type: "text",
            id: "equipment", 
            name: "equipment"
        },
        {
            type: "number",
            id: "reps", 
            name: "reps"
        },
        {
            type: "text",
            id: "special", 
            name: "special"
        },
        {
            type: "number",
            id: "weight", 
            name: "weight"
        },
        {
            type: "text",
            id: "difficulty",
            name: "difficulty",
            list: "difficultynames",
            options: ["easy", "manageable", "hard", "couldn't complete"] 
        },
        {
            type: "datetime-local",
            id: "datetime", 
        },
    ]

    const handleServerReponses = () => {
        if (visibleRecords.length === 0 && !isLoadingRecords && !hasErrorRecords) {
            return <td><td>no data...</td></td>
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
                        key={record.datetime}
                        record={record}
                        inputs={inputs}
                        handleTextChange={handleTextChange}
                    />
                ))}
            </>
        )
    }
    
    return (
        <table>
            <thead>
                <tr>
                    {inputs.map(input => (
                        <th key={input.id}><label htmlFor={input.id}>{input.id}</label></th>
                    ))}
                    <th key="editButton"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {inputs.map((input) => {
                            const {options, ...rest} = input
                            return (
                                <td key={input.id} >
                                    <input {...rest} onChange={handleTextChange}/>
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
                    <td id="addLogo">
                        <img 
                            src={addLogo} 
                            id="addLogoImage" 
                            alt="Add as new record"
                            aria-label="Add as new record"
                            onClick={handleAddRecord}
                        />
                    </td>
                </tr>
                {handleServerReponses()}
            </tbody>
        </table>
    )
}