export const addLiquidityLayout = {
  struct: {
    discriminator: "u8",
    nonce: "u8",
    openTime: "u64",
    initPcAmount: "u64",
    initCoinAmount: "u64",
  },
};


export const cpAddLiquidityLayout = {
  struct: {
    initAmount0: "u64",
    initAmount1: "u64",
    openTime: "u64"
  }
}
