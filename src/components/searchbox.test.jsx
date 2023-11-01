import { render, screen } from '@testing-library/react'
import SearchBox from './SearchBox'

describe("SearchBox component", () => {
    it("should render SearchBox component correctly", () => {
        render(<SearchBox />)
        const element = screen.getByRole("textbox")
        expect(element).toBeInTheDocument()
    })
})