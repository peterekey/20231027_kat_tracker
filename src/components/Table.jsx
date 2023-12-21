import './Table.css'
import Records from '../features/record/Records'
import { useDispatch, useSelector } from 'react-redux'
import {
    loadAllRecords,
    selectAllRecords,
    isLoading,
    hasError
} from '../features/record/recordsSlice'
import { useEffect, useState } from 'react'

export default function Table() {

    // console.log('Starting at the top!')
    const [records, setRecords] = useState([])
    const [filters, setFilters] = useState({})
    
    const dispatch = useDispatch()
    
    const recordsObject = useSelector(selectAllRecords)

    // console.log(recordsObject.records)
    
    useEffect(() => {
        dispatch(loadAllRecords())
        setRecords(recordsObject.records)
    }, [])
    
    // console.log('records is ', records)
    // console.log('filters is: ', filters)

    const isLoadingRecords = useSelector(isLoading)
    const hasErrorRecords = useSelector(hasError)

    const recordsToShowII = (columnFilters) => {
        // console.log('starting recordsToShowII...')
        if (columnFilters == null) {
            // console.log('columnFilters is empty')
            return
        }

        // console.log('columnFilters is not empty! continuing...')
        // console.log('columnFilters is ', JSON.stringify(columnFilters))
        const filtersArr = Object.entries(columnFilters)
        // console.log('filtersArr is ', filtersArr)

        const filteredItems = recordsObject.records.filter(object => {
            // console.log('object is ', object)
            const result = filtersArr.every(([key, values]) => {
                // console.log('object[key] is ', object[key])
                // console.log('key is: ', key)
                // console.log('values is: ', values)
                // console.log('object[key].includes(values) is ', object[key].includes(values))
                if(isNaN(object[key])) {
                    // console.log('in the NaN')
                    // console.log('returning ', object[key].includes(values))
                    return object[key].includes(values)
                } else {
                    // console.log('is a number')
                    // console.log('returning ', [object[key]].includes(+values))
                    return [object[key]].includes(+values)
                } 
            })
            // console.log('result is: ', result)
            if (result) {
                // console.log('returning ', object)
                return object
            }
        })

        // console.log('returning ', filteredItems)
        return filteredItems
    }

    const handleTextChange = (event) => {
        // console.log('event is ', event)
        const { value, id } = event.target
        // console.log(`value is ${value} and id is ${id}`)
        if (value === '') {
            // console.log('empty value')
            setFilters((prev) => {
                const filteredObject = {}
                for (const key in prev) {
                    if (key !== id) {
                        filteredObject[key] = prev[key]
                    }
                }
                // console.log('filteredObject is ', filteredObject)
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
    
    useEffect(() => {
        // console.log('after a filter change, the filters are now:')
        // console.log(filters)
        setRecords(recordsToShowII(filters))
    }, [filters])

    
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
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" id="exercise" name="exercise" onChange={handleTextChange} /></td>
                    <td><input type="text" id="equipment" name="equipment" onChange={handleTextChange} /></td>
                    <td><input type="number" id="reps" name="reps" onChange={handleTextChange} /></td>
                    <td><input type="text" id="special" name="special" onChange={handleTextChange} /></td>
                    <td><input type="number" id="weight" name="weight" onChange={handleTextChange} /></td>
                    <td>
                        <input type="text" id="difficulty" name="difficulty" list="difficultynames" onChange={handleTextChange} />
                            <datalist id="difficultynames">
                                <option value="Easy"></option>
                                <option value="Manageable"></option>
                                <option value="Hard"></option>
                                <option value="Couldn't complete"></option>
                            </datalist>
                    </td>
                    <td><input type="date" id="datetime" name="datetime" onChange={handleTextChange} /></td>
                </tr>
            <Records 
                records={records}
                isLoadingRecords={isLoadingRecords}
                hasErrorRecords={hasErrorRecords}
            />
            </tbody>
        </table>
    )
}