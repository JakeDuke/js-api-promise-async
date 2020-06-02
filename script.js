      
async function sha256(string) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(string)                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
    return hashHex
}

const getJsonRequest = new XMLHttpRequest()
const postContentRequest = new XMLHttpRequest()

function promiseChaining () {
    getJsonRequest.open('GET', 'https://test-hermes.profisms.cz/work-tests/test1.php')
    getJsonRequest.send()
    getJsonRequest.onreadystatechange = () => {
        if (getJsonRequest.readyState === XMLHttpRequest.DONE) {
            if (getJsonRequest.status === 200) {
            
                const content = JSON.parse(getJsonRequest.responseText).content;

                sha256(content).then(res => {
                    postContentRequest.send(JSON.stringify({
                        'content': content,
                        'sha256': res,
                    }))
                })

                postContentRequest.open('POST', 'https://test-hermes.profisms.cz/work-tests/test1a.php')
                postContentRequest.setRequestHeader("Content-Type", "application/json")
                postContentRequest.onreadystatechange = () => {
                    if (postContentRequest.readyState === XMLHttpRequest.DONE) {
                        console.log(postContentRequest.responseText)
                        alert(postContentRequest.responseText)
                    }
                }
            
            }
        }  
    }
}

async function asyncFunction () {
    getJsonRequest.open('GET', 'https://test-hermes.profisms.cz/work-tests/test1.php')
    getJsonRequest.send()
    getJsonRequest.onreadystatechange = async () => {
        if (getJsonRequest.readyState === XMLHttpRequest.DONE) {
            if (getJsonRequest.status === 200) {
            
                const content = JSON.parse(getJsonRequest.responseText).content

                const sha = await sha256(content)
                
                postContentRequest.open('POST', 'https://test-hermes.profisms.cz/work-tests/test1a.php')
                postContentRequest.setRequestHeader("Content-Type", "application/json")
                postContentRequest.send(JSON.stringify({
                    'content': content,
                    'sha256': sha,
                }))   
                postContentRequest.onreadystatechange = () => {
                    if (postContentRequest.readyState === XMLHttpRequest.DONE) {
                        console.log(postContentRequest.responseText)
                        alert(postContentRequest.responseText)
                        promiseChaining()
                    }
                }
            
            }
        }  
    }
}

asyncFunction()