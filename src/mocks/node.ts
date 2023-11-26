// import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export let server

if (typeof process === 'object') {
    console.log('this is node')
    const { setupServer } = await import('msw/node') 
    server = setupServer(...handlers)
} else {
    console.log('this is browser')
}