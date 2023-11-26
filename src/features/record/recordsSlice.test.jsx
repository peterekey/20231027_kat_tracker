import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import Table from '../../components/Table'
import store from '../../app/store'

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
        render(<Provider store={store}><Table /></Provider>)
        await waitFor(() => {
            const loadingText = screen.queryByText('loading data')
            expect(loadingText).toBeNull()
        })
        const allTableRows = screen.getAllByRole("row")
        expect(allTableRows.length).toBe(10)
    })
})

