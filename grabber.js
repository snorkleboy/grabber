const fs = require('fs')
const http = require('http')
const https = require('https')

function buildOptionsObj(username) {
    return {
        hostname: `api.github.com`,
        path: `/users/${username}/starred`,
        headers: {
            'User-Agent': 'grabber'
        }
    }
}
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = ''
        req.on('data', d => {body += d })
        req.on('end', () => {  
            try{
                const username = JSON.parse(body).username
                console.log("looking up",username)
                getGitHubdata(username)
                    .then(data => {writeData(data,username);res.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);})
            } 
            catch (e) {
                console.log(e);
            }
        })
    }
})

function getGitHubdata(username){
    return new Promise((resolve,rej)=>{
        const opts = buildOptionsObj(username)
        https.get(opts, (dataStream) => {
            let repoData = ''
            dataStream.on('data', chunk => {
                repoData += chunk
            })
            dataStream.on('end', () => {
                const repos = JSON.parse(repoData)
                repos.map(repo => {
                    return `Repo: ${repo.name}. Stars: ${repo.stargazers_count}.`
                }).join('\n')
                console.log('here',repos);
                resolve(repos)
            })
        })
    })

}

function writeData(data,username){
    const ws = fs.createWriteStream(`./${username}_starred_repos.txt`)
    if (data.length>0){ws.write(data)}
}

server.listen(8080, () => console.log('Listening on 8080'))