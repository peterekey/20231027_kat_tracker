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

    const [records, setRecords] = useState([])
    
    const dispatch = useDispatch()

    const recordsObject = useSelector(selectAllRecords)

    useEffect(() => {
        dispatch(loadAllRecords())
        setRecords(recordsObject.records)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])
    
    const isLoadingRecords = useSelector(isLoading)
    const hasErrorRecords = useSelector(hasError)

    const recordsToShow = (userInput, columnName) => {
        const result = recordsObject.records.filter((record) => {
            if (isNaN(record[columnName])) {
                return record[columnName].includes(userInput)
            } else {
                const set = [record[columnName]]
                return set.includes(+userInput)
            }
        })
        return result
    }

    const handleTextChange = ({target}) => {
        if (target.value === '') {
            setRecords(recordsObject.records)
        } else {
            const newRecords = recordsToShow(target.value, target.id)
            setRecords(newRecords)
        }
    }

    return (
        <table>
            <thead>
                <tr>
                    <th><label htmlFor="exercise">Exercise</label></th>
                    <th><label htmlFor="equipment">Equipment</label></th>
                    <th><label htmlFor="reps">Reps</label></th>
                    <th><label htmlFor="tempo">Tempo or special</label></th>
                    <th><label htmlFor="weight">Weight</label></th>
                    <th><label htmlFor="difficulty">Difficulty</label></th>
                    <th><label htmlFor="datetime">Date & time</label></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" id="exercise" name="exercise" onChange={handleTextChange}></input></td>
                    <td><input type="text" id="equipment" name="equipment" onChange={handleTextChange}></input></td>
                    <td><input type="number" id="reps" name="reps" onChange={handleTextChange}></input></td>
                    <td><input type="text" id="special" name="special" onChange={handleTextChange}></input></td>
                    <td><input type="number" id="weight" name="weight" onChange={handleTextChange}></input></td>
                    <td><input type="text" id="difficulty" name="difficulty" onChange={handleTextChange}></input></td>
                    <td><input type="date" id="datetime" name="datetime" onChange={handleTextChange}></input></td>
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