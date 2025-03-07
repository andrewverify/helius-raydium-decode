//create a helius rpc websocket connection with "ws library"

import Websocket from 'ws'

const main = async function () {
    const payload = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "programSubscribe",
      "params": [
        "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        {
          "encoding": "jsonParsed"
        }
      ]
    }

    const ws = new Websocket(
        'wss://mainnet.helius-rpc.com/?api-key=14734112-cfa3-409e-81d6-3192bdbadbde'
    )

    ws.onopen = () => {
        console.log('WebSocket connection established')

        //send a request to get the current epoch height
        ws.send(JSON.stringify(payload))
    }

    ws.onmessage = (event) => {
        console.log(event.data)
    }

    ws.onerror = (error) => {
        console.error(`WebSocket error: ${JSON.stringify(error)}`)
    }

    ws.onclose = () => {
        console.log('WebSocket connection closed')
    }
}

main()
    .then((value) => console.log(value))
    .catch((error) => console.error(error))
