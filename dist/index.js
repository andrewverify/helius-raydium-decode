"use strict";
//create a helius rpc websocket connection with "ws library"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const web3_js_1 = require("@solana/web3.js");
const clmm_1 = __importDefault(require("./parsers/clmm"));
const main = async function () {
    const ammConnection = new ws_1.default("wss://mainnet.helius-rpc.com/?api-key=14734112-cfa3-409e-81d6-3192bdbadbde");
    const rpcConnection = new web3_js_1.Connection("https://mainnet.helius-rpc.com/?api-key=14734112-cfa3-409e-81d6-3192bdbadbde");
    const amm = new clmm_1.default(ammConnection, rpcConnection);
    await amm.initialize();
};
main()
    .then((value) => console.log(value))
    .catch((error) => console.error(error));
