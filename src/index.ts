//create a helius rpc websocket connection with "ws library"

import Websocket from "ws";
import Amm from "./parsers/amm";
import { Connection } from "@solana/web3.js";

const main = async function () {
  const ammConnection = new Websocket(
    "wss://mainnet.helius-rpc.com/?api-key=14734112-cfa3-409e-81d6-3192bdbadbde"
  );
  const rpcConnection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=14734112-cfa3-409e-81d6-3192bdbadbde"
  );
  const amm = new Amm(ammConnection, rpcConnection);
  await amm.initialize();
};

main()
  .then((value) => console.log(value))
  .catch((error) => console.error(error));
