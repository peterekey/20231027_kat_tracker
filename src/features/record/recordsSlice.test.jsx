import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import Table from '../../components/Table'
import store from '../../app/store'
import { handlers } from '../../mocks/handlers'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

const networkErrorHandlers = [
    http.get('/api/records', () => {
        return HttpResponse.error('There was an error')
    })
]

const server = setupServer(...handlers)

beforeAll(() => {
    server.listen({onUnhandledRequest: 'error'})
})

afterEach(() => {
    server.resetHandlers()
}
)
afterAll(() => server.close())

describe("Records", () => {
    it("shows data loading text", async () => {
        // server.use(...handlers)
        render(<Provider store={store}><Table /></Provider>)
        await expect(screen.queryByText(/loading data\.\.\./i)).toBeInTheDocument()
    })
    it("shows error message", async () => {
        // server.use(...networkErrorHandlers)
        render(<Provider store={store}><Table /></Provider>)
        const errorMessage = await screen.findByText(/an error occurred/i)
        expect(errorMessage).toBeInTheDocument()
        expect(screen.queryByText(/loading data\.\.\./i)).not.toBeInTheDocument()
    })
    it("shows data on load", async () => {
        // server.use(...handlers)
        render(<Provider store={store}><Table /></Provider>)
        // console.log(JSON.stringify(server))
        const dataMessage = await screen.findByText(/chest press/i)
        waitFor(() => expect(dataMessage).toBeInTheDocument())
    })
    })