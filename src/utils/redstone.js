import redstone from "redstone-api";

export async function getTokenPrice(token) {
  try {
    const price = await redstone.getPrice(token);

    return price?.value;
  } catch (error) {
    return 0;
  }
}
