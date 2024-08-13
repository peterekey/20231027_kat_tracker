import Record from '../features/record/Record';

export default function TableBody({visibleRecords, isLoadingRecords, hasErrorRecords, handleEditRecord}) {
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
                    handleEditRecord={handleEditRecord}
                />
            ))}
        </>
    );
}