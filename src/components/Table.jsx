import './Table.css'
import Records from '../features/record/Records'

export default function Table() {

    return (
        <table>
            <thead>
                <tr>
                    <th>Exercise</th>
                    <th>Equipment</th>
                    <th>Reps</th>
                    <th>Tempo or special</th>
                    <th>Weight</th>
                    <th>Difficulty</th>
                    <th>Date & time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text"></input></td>
                    <td><input type="text"></input></td>
                    <td><input type="text"></input></td>
                    <td><input type="text"></input></td>
                    <td><input type="text"></input></td>
                    <td><input type="text"></input></td>
                    <td><input type="text"></input></td>
                </tr>
            <Records />
            </tbody>
        </table>
    )
}