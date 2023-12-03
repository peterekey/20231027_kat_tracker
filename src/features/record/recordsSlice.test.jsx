import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import Table from '../../components/Table'
import store from '../../app/store'
import records from '../../mocks/records.json'

import { http, HttpResponse } from 'msw'

const networkErrorHandlers = [
    http.get(import.meta.env.VITE_API_URL + '/api/records', () => {
        return HttpResponse.error()
    })
]

const { server } = await import('../../mocks/node')
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const filterRecordsByInput = async (columnName, userInput, records) => {
    const items = records.filter((record) => {
        if (isNaN(record[columnName])) {
            return record[columnName].includes(userInput)
        } else {
            const set = [record[columnName]]
            return set.includes(+userInput)
        }
    })
    const itemCount = items.length
    render(<Provider store={store}><Table /></Provider>)
    await waitFor(() => {
        const loadingText = screen.queryByText('loading data')
        expect(loadingText).toBeNull()
    })
    const regex = new RegExp(columnName, 'i')
    const exerciseInput = screen.getByLabelText(regex)

    await waitFor(() => {
        fireEvent.change(exerciseInput, { target: { value: userInput}})
    })
    const currentTableRows = screen.getAllByRole("row")
    expect(currentTableRows.length).toBe(itemCount + 2)
}

describe("Records", () => {
    it("shows data loading text", async () => {
        render(<Provider store={store}><Table /></Provider>)
        await expect(screen.queryByText(/loading data\.\.\./i)).toBeInTheDocument()
    })
    it("shows error message", async () => {
        server.use(...networkErrorHandlers)

        render(<Provider store={store}><Table /></Provider>)
        const errorMessage = await screen.findByText(/an error occurred/i)
        expect(errorMessage).toBeInTheDocument()
        expect(screen.queryByText(/loading data\.\.\./i)).not.toBeInTheDocument()
    })
    it("shows data on load", async () => {
        const recordsCount = records.length
        render(<Provider store={store}><Table /></Provider>)
        await waitFor(() => {
            const loadingText = screen.queryByText('loading data')
            expect(loadingText).toBeNull()
        })
        const allTableRows = screen.getAllByRole("row")
        expect(allTableRows.length).toBe(recordsCount + 2)
    })
    it("filters data in exercise column", async () => {
        await filterRecordsByInput('exercise', 'chest press', records)
    })
    it("filters data in the equipment column", async () => {
        await filterRecordsByInput('equipment', 'handle', records)
    })
    it("filters data in the reps column", async () => {
        await filterRecordsByInput('reps', '8', records)
    })
    it("filters data in the tempo or special column", async () => {
        await filterRecordsByInput('special', '+', records)
    })
    it("filters data in the weight column", async () => {
        await filterRecordsByInput('weight', '14', records)
    })
    it("filters data in the difficulty column", async () => {
        await filterRecordsByInput('difficulty', 'easy', records)
    })
})

