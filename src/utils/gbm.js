// Geometric Brownian Motion price simulator
export function nextPrice(prevPrice, mu = 0.0001, sigma = 0.01) {
    const dt = 0.2;
    const rand = Math.random() * 2 - 1; // uniform approximation of noise
    const price =
      prevPrice * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * rand);
  
    return Math.max(price, 0.1); // prevent negative prices
  }