import { Connection } from "@solana/web3.js";
import { cpAddLiquidityLayout } from "./types";



export default class Cpmm {

  private rpc;
  private ws;
  constructor(ws: any, rpc: Connection) {
    this.rpc = rpc;
    this.ws = ws;

  }
  public async initialize() {

    const payload = {
      jsonrpc: "2.0",
      id: 1,
      method: "logsSubscribe",
      params: [
        {
          mentions: ["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"],
        },
        {
          commitment: "finalized",
        },
      ],
    };

    this.ws.onopen = () => {
      console.log("WebSocket connection established");

      //send a request to get the current epoch height
      this.ws.send(JSON.stringify(payload));
    };

    this.ws.onmessage = async (event) => {
      const initializeInsHint = "initialize";
      if (event.data) {
        const notificationString: string = event.data.toString();
        //console.log(event.data.toString());
        const isItNewToken = notificationString.includes(initializeInsHint);
        if (isItNewToken) {
          const notificationObject = JSON.parse(notificationString);
          //get tx signature
          const signature: string =
            notificationObject.params.result.value.signature;
          console.log(`TXID: ${signature}`);
          const fullTx = await this.rpc.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0,
          });
          console.dir(fullTx, { depth: null });

        }
      }
    }

  }

}
