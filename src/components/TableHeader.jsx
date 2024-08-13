import inputs from '../config/inputsConfig';

export default function TableHeader({filterBy, changeSortOrder}) {
    return (
        <thead>
            <tr>
                {inputs.map(input => (
                    <th key={input.id} onClick={() => changeSortOrder(input.id)}>
                        <label htmlFor={input.id}>{input.id}</label>
                        <span>
                            {input.id === filterBy.id && (
                                <i className={filterBy.descending ? 'arrow down' : 'arrow up'}></i>)}
                        </span>
                    </th>
                ))}
                <th key="addButton"></th>
                <th key="deleteButton"></th>
            </tr>
        </thead>
    )
}

