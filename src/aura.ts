// fetch token details using MetaPlex AURA API

const url = "https://aura-mainnet.metaplex.com";

export interface AuraResponse {
  result: { content: { metadata: { name: string } } };
}

export default async function (mintAddress: string) {
  // return only token data
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAsset",
        params: {
          id: mintAddress,
        },
      }),
    });
    const responseJson: AuraResponse = await response.json();
    return responseJson.result.content.metadata.name;
  } catch (error) {
    console.log(error);
    return error;
  }
}
