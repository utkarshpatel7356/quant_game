import { useState } from "react";
import useInterval from "./useInterval";
import { nextPrice } from "../utils/gbm";

export default function usePriceFeed() {
  const [price, setPrice] = useState(100);
  const [priceHistory, setPriceHistory] = useState([100]);

  useInterval(() => {
    const newP = nextPrice(price);
    setPrice(newP);
    setPriceHistory(h => [...h.slice(-199), newP]);
  }, 300);

  return { price, priceHistory };
}