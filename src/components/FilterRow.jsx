import inputs from '../config/inputsConfig';
import addLogo from '../assets/add.png';
import deleteLogo from '../assets/delete.png';
import PropTypes from 'prop-types';

export default function FilterRow({ handleTextChange, handleClearInputs, handleAddRecord}) {
    return (
        <tr>
            {inputs.map((input) => {
                    const {options, ...rest} = input;
                    return (
                        <td key={input.id} >
                            <input 
                                name="input" 
                                {...rest} 
                                onChange={handleTextChange}
                            />
                            { input.list && (
                                    <datalist id={input.list}>
                                        {options.map((optionValue) => (
                                            <option key={optionValue} value={optionValue}></option>
                                        ))}
                                    </datalist>
                            )}
                        </td>
                    );
            })}
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
    );
}

FilterRow.propTypes = {
    handleTextChange: PropTypes.func,
    handleClearInputs: PropTypes.func,
    handleAddRecord: PropTypes.func
}