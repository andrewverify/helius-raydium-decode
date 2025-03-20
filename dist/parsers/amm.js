"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const idl_json_1 = __importDefault(require("./idl.json"));
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
class Amm {
    constructor(websocket, rpc) {
        this.ws = websocket;
        this.rpc = rpc;
    }
    async initialize() {
        const payload = {
            jsonrpc: "2.0",
            id: 1,
            method: "logsSubscribe",
            params: [
                {
                    mentions: ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
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
            const initializeInsHint = "initialize2";
            if (event.data) {
                const notificationString = event.data.toString();
                const isItNewToken = notificationString.includes("initialize2");
                if (isItNewToken) {
                    const notificationObject = JSON.parse(notificationString);
                    //get tx signature
                    const signature = notificationObject.params.result.value.signature;
                    console.log(`TXID: ${signature}`);
                    const fullTx = await this.rpc.getTransaction(signature, {
                        maxSupportedTransactionVersion: 0,
                    });
                    if (fullTx && fullTx.meta) {
                        fullTx.transaction.message.compiledInstructions.forEach((instruction) => {
                            //21 addresses = create instruction
                            if (instruction.accountKeyIndexes.length == 21) {
                                //address with the index == token
                                const tokenIndex = instruction.accountKeyIndexes[8];
                                console.log("Market: AMMV4");
                                console.log(`Mint Token: ${fullTx.transaction.message.staticAccountKeys[tokenIndex].toBase58()}`);
                                console.log(`Base token: ${fullTx.transaction.message.staticAccountKeys[instruction.accountKeyIndexes[9]].toBase58()}`);
                                let coder = new anchor_1.BorshCoder(idl_json_1.default);
                                console.dir(fullTx.meta?.innerInstructions, { depth: null });
                                fullTx.meta?.innerInstructions?.forEach((ins) => {
                                    ins.instructions.forEach((oneinst) => {
                                        console.log(coder.instruction.decode(bytes_1.bs58.decode(oneinst.data)));
                                    });
                                });
                            }
                        });
                    }
                    else {
                        console.log("cant get AMM transaction!");
                    }
                }
            }
        };
        this.ws.onerror = (error) => {
            console.error(`WebSocket error: ${JSON.stringify(error)}`);
        };
        this.ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }
}
exports.default = Amm;
