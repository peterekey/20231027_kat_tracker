import './Table.css'
import Records from '../features/record/Records'
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
        const filteredItems = allRecords.records.filter(object => {
            const result = filtersArr.every(([key, values]) => {
                if(isNaN(object[key])) {
                    return object[key].includes(values)
                } else {
                    return [object[key]].includes(+values)
                } 
            })
            if (result) {
                return object
            }
        })

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
            input[key] = document.getElementById(key).value || ''
        }
        // console.log('here\'s the new record I\'m adding: ', JSON.stringify(input))
        dispatch(addNewRecord(input))
    }
    
    useEffect(() => {
        console.log('running setVisibleREcords')
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
    
    return (
        <table>
            <thead>
                <tr>
                    <th><label htmlFor="exercise">Exercise</label></th>
                    <th><label htmlFor="equipment">Equipment</label></th>
                    <th><label htmlFor="reps">Reps</label></th>
                    <th><label htmlFor="special">Tempo or special</label></th>
                    <th><label htmlFor="weight">Weight</label></th>
                    <th><label htmlFor="difficulty">Difficulty</label></th>
                    <th><label htmlFor="datetime">Date & time</label></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {inputs.map((input) => {
                            // eslint-disable-next-line no-unused-vars
                            const {options, title: _, ...rest} = input
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
            <Records 
                records={visibleRecords}
                isLoadingRecords={isLoadingRecords}
                hasErrorRecords={hasErrorRecords}
            />
            </tbody>
        </table>
    )
}