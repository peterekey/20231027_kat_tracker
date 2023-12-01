import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../app/store'
import Table from './Table'

let renderObject
let container

beforeEach(() => {
    renderObject = render(
        <Provider store={store}>
            <Table />
        </Provider>
    )
    container = renderObject.container

})

describe("Table component", () => {
    it("should render the headers correctly", async () => {
        const headerCells = await renderObject.getAllByRole("columnheader")
        expect(headerCells.length).toBe(7)

        const expectedHeaders = ["Date & time", "Exercise", "Equipment", "Reps", "Tempo or special", "Weight", "Difficulty"]
        expectedHeaders.forEach(header => {
            const thisHeader = screen.getByRole("columnheader", {name: header})
            expect(thisHeader).toBeInTheDocument()
        })
    })

    it("should have input cells in the first row", () => {
        const inputElements = container.querySelectorAll("tbody tr:first-child input")
        expect(inputElements.length).toBe(7)
    })
})