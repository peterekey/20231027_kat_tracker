import PropTypes from 'prop-types'

const Records = ({records, isLoadingRecords, hasErrorRecords}) => {
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

Records.propTypes = {
    records: PropTypes.array,
    isLoadingRecords: PropTypes.bool,
    hasErrorRecords: PropTypes.bool
}