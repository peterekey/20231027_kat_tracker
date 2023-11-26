if (typeof process === 'object') {
    console.log('this is node...')
} else {
    const { worker } = await import('./browser')
    worker.start()
}
