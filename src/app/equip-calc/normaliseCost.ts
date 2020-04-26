import {Currency} from '../../lib/Currency';

type K = keyof Currency;
const modPairs: [K, K][] = [
  ['copper', 'silver'],
  ['silver', 'gold'],
  ['gold', 'plat']
];

export function normaliseCost(cost: Currency): Currency {
  for (const [lower, higher] of modPairs) {
    if (cost[lower] > 100) {
      cost[higher] += Math.floor(cost[lower] / 100);
      cost[lower] = cost[lower] % 100;
    }
  }

  return cost;
}
