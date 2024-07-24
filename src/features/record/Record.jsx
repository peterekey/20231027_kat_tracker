import PropTypes from 'prop-types'
import { useEffect, useState, useRef, createRef } from 'react';

const Record = ({record, inputs, handleEditRecord}) => {

    const [isEditing, setIsEditing] = useState(false)
    const cellRefs = useRef(inputs.map(() => createRef()))
    const [newRecord, setNewRecord] = useState(record)
    const difficultyObject = inputs.find(input => input.id == "difficulty")
    const difficultyOptions = difficultyObject ? difficultyObject.options : []

    const convertDateToISO = (timeInMilliseconds) => {
        if (Number.isFinite(timeInMilliseconds)) {
            const date = new Date(timeInMilliseconds);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
    
            const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
            return formattedDateTime;
        } else {
            return timeInMilliseconds;
        }
    }

    const renderInputField = (input, inputValue) => {
        if (!input) return null
        const defaultValue = input.id === 'datetime' ? convertDateToISO(inputValue) : inputValue
        const {options, ...rest} = input
        return (
            <>
                <input {...rest} value={defaultValue} onChange={handleInputChange}/>
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

    const renderInputValue = (input, newRecord) => {
        if(input.id === "datetime") {
            const date = new Date(parseInt(newRecord.datetime));
            const formattedDate = date.toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-AU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const formattedDateTime = `${formattedDate} ${formattedTime}`;
            return formattedDateTime;
        } else {
            return newRecord[input.id];
        }
    }

    const handleInputChange = (event) => {
        const keyToChange = event.target.name;
        let valueToChange;
        if (keyToChange === 'datetime') {
            valueToChange = Date.parse(event.target.value)
        } else {
            valueToChange = event.target.value;
        }
        console.log('keyToChange is:')
        console.log(keyToChange)
        console.log('valueToChange is:')
        console.log(valueToChange)
        setNewRecord((prev) => {
            return {
                ...prev,
                [keyToChange]: valueToChange
            }
        })
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            console.log('newRecord.datetime is:')
            console.log(newRecord.datetime)
            const isOutside = cellRefs.current.every(ref => {
                return ref.current && !ref.current.contains(event.target)
            })
            
            if (isOutside) {
                let isValid = true
                cellRefs.current.forEach(ref => {
                    const input = ref.current.querySelector('input')
                    if(input) {
                        const value = input.value
                        const inputId = input.id
                        if (inputId === "reps" || inputId === "weight") {
                            if (isNaN(value) || value < 0) {
                                console.log(`${inputId} is not a positive number!`)
                                isValid = false
                            }
                        }
                        if (inputId === "difficulty" && !difficultyOptions.includes(value) && value !== "") {
                            console.log('Option is not in difficulty!')
                            isValid = false
                        }
                    }
                })
    
                if(isValid) {
                    console.log('passed all validations');
                    console.log(newRecord);
                    handleEditRecord(newRecord);
                    setIsEditing(false);
                }
            }
        }
        
        if (isEditing) {
            document.addEventListener('click', handleOutsideClick)
        } else {
            document.removeEventListener('click', handleOutsideClick)
        }
    
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [isEditing, newRecord, difficultyOptions, handleEditRecord])

    return (
        <>
            <tr>
                {inputs.map((input, index) => (
                    <td ref={cellRefs.current[index]} key={input.id} onDoubleClick={() => setIsEditing(true)}>
                        {isEditing ? renderInputField(input, newRecord[input.id]) : renderInputValue(input, newRecord)}
                    </td>
                ))}
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
    handleTextChange: PropTypes.func,
    handleEditRecord: PropTypes.func
}