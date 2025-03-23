"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const borsh_1 = require("borsh");
const types_1 = require("./types");
const aura_1 = __importDefault(require("../aura"));
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
                        fullTx.transaction.message.compiledInstructions.forEach(async (instruction) => {
                            //21 addresses = create instruction
                            if (instruction.accountKeyIndexes.length == 21) {
                                //address with the index == token
                                const tokenIndex = instruction.accountKeyIndexes[8];
                                const mintToken = fullTx.transaction.message.staticAccountKeys[tokenIndex].toBase58();
                                const baseToken = fullTx.transaction.message.staticAccountKeys[instruction.accountKeyIndexes[9]].toBase58();
                                console.log(`Mint Token: ${mintToken}`);
                                console.log(`Mint name:`, await (0, aura_1.default)(mintToken));
                                console.log(`Base token: ${baseToken}`);
                                const parsedAddLiquidityParams = (0, borsh_1.deserialize)(types_1.addLiquidityLayout, instruction.data);
                                if (parsedAddLiquidityParams) {
                                    console.log("Open Time:", parsedAddLiquidityParams["openTime"], new Date(Number((parsedAddLiquidityParams["openTime"] * 1000n).toString())));
                                    console.log("Initial Base Token Amount:", parsedAddLiquidityParams["initPcAmount"]);
                                    console.log("Initial Mint Token Amount:", parsedAddLiquidityParams["initCoinAmount"]);
                                    console.log("Market:", mintToken.includes("pump") ? "AMMV4" : "CPMM");
                                }
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
