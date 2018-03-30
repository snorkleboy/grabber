const githubServer = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = ''
        req.on('data', d => {
            // d is an instance of Buffer, 
            // toString is implicitly called when we add it to body
            body += d
        })
        req.on('end', () => {
            // qs.parse will give us a nice object to retrieve the value
            const username = qs.parse(body).username
            res.end(username)
        })
    }
})