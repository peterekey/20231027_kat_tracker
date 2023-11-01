import { render, screen } from '@testing-library/react'
import Table from './Table'

let renderObject
let container

beforeEach(() => {
    renderObject = render(<Table />)
    container = renderObject.container

})

describe("Table component", () => {
    it("should render the headers correctly", () => {
        const headerCells = renderObject.getAllByRole("columnheader")
        expect(headerCells.length).toBe(6)

        const expectedHeaders = ["Date & time", "Exercise", "Equipment", "Reps", "Weight", "Difficulty"]
        expectedHeaders.forEach(header => {
            const thisHeader = screen.getByRole("columnheader", {name: header})
            expect(thisHeader).toBeInTheDocument()
        })
    })

    it("should have input cells in the first row", () => {
        const inputElements = container.querySelectorAll("tbody tr:first-child input[type='text']")
        expect(inputElements.length).toBe(6)
    })
})