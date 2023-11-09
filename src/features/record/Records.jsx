import { useDispatch, useSelector } from 'react-redux'
import {
    loadAllRecords,
    selectAllRecords,
    isLoading,
    hasError
} from './recordsSlice'
import { useEffect } from 'react'

const Records = () => {
    const dispatch = useDispatch()
    const recordsObject = useSelector(selectAllRecords)
    const records = recordsObject.records

    const isLoadingRecords = useSelector(isLoading)
    const hasErrorRecords = useSelector(hasError)

    useEffect(() => {
        dispatch(loadAllRecords())
    }, [dispatch])

    console.log(records)

    if (records.length === 0 && !isLoadingRecords && !hasErrorRecords) {
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
            {records.map((record) => (
                <tr key={record.datetime}>
                    <td>{record.exercise}</td>
                    <td>{record.equipment}</td>
                    <td>{record.reps}</td>
                    <td>{record.special}</td>
                    <td>{record.weight}</td>
                    <td>{record.difficulty}</td>
                    <td>{record.datetime}</td>
                </tr>
            ))}
        </>
    )
}

export default Records