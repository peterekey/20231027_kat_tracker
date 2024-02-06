import PropTypes from 'prop-types'
import { useState } from 'react'

const Record = ({record, inputs, handleTextChange}) => {

    const [isEditing, setIsEditing] = useState(false)

    const renderInputField = (input, handleTextChange, inputValue) => {
        if (!input) return null
        const {options, ...rest} = input
        return (
            <>
                <input {...rest} onChange={handleTextChange} value={inputValue}/>
                { !("list" in input) ? null : (
                    <datalist id={input.list}>
                        {options.map((optionValue) => {
                            return (<option key={optionValue} value={optionValue}></option>)
                        })}
                    </datalist>
                )}
            </>
        )
    }

    const handleEdit = (event) => {
        setIsEditing(true)
        console.log(event.target)
        console.log(event.target.innerText)
    }

    return (
        <>
            <tr>
                {inputs.map(input => (
                    <td key={input.id} onDoubleClick={handleEdit}>
                        {isEditing ? renderInputField(input, handleTextChange, record[input.id]) : record[input.id]}
                    </td>
                ))}
                <td id="editLogo">
                    <img 
                        // src={editLogo}
                        id="editLogoImage"
                        alt="Edit record"
                        aria-label="Edit current record"
                    />
                </td>
            </tr>
        </>
    )
}

export default Record

Record.propTypes = {
    record: PropTypes.object,
    isLoadingRecords: PropTypes.bool,
    hasErrorRecords: PropTypes.bool,
    inputs: PropTypes.array,
    handleTextChange: PropTypes.func
}