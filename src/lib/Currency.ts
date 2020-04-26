export interface Currency {
  copper: number;

  gold: number;

  plat: number;

  silver: number;
}

export function copperToCurrency(totalCopper: number): Currency {
  let currTotal = totalCopper;
  const out: Currency = {
    copper: currTotal % 100,
    gold: 0,
    plat: 0,
    silver: 0
  };
  currTotal -= out.silver;

  if (currTotal >= CopperIn.SILVER) {
    out.silver = Math.floor(currTotal / CopperIn.SILVER) % 100;
    currTotal -= out.silver * CopperIn.SILVER;

    if (currTotal >= CopperIn.GOLD) {
      out.gold = Math.floor(currTotal / CopperIn.GOLD) % 100;
      currTotal -= out.gold * CopperIn.GOLD;

      if (currTotal >= CopperIn.PLAT) {
        out.plat = currTotal / CopperIn.PLAT;
      }
    }
  }

  return out;
}

const enum CopperIn {
  SILVER = 100,
  GOLD = 10000,
  PLAT = 1000000
}
