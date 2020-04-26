import {Fragment, h, VNode} from 'preact';
import {PureComponent} from 'preact/compat';
import {CurrencyDisplay} from '../layout/CurrencyDisplay';
import {Missing} from './EquipmentCalc';
import {equipmentCostData} from './equipmentCostData';

interface Props {
  bsLvl?: number;

  missing: Missing;
}

interface State {
  cost: number;
}

export class EquipmentLevelingCost extends PureComponent<Props, State> {
  public static readonly defaultProps: Partial<Props> = {bsLvl: 0};

  public readonly state: State;

  public constructor() {
    super(...arguments as any);
    this.state = {
      cost: this.costFromProps()
    };
  }

  public componentDidUpdate(previousProps): void {
    if (previousProps.missing !== this.props.missing || previousProps.bsLvl !== this.props.bsLvl) {
      const cost = this.costFromProps();
      if (cost !== this.state.cost) {
        this.setState({cost});
      }
    }
  }

  public render(): VNode {
    const {cost} = this.state;
    if (!cost) {
      return <Fragment>You're all leveled!</Fragment>;
    }

    return <CurrencyDisplay cost={cost}/>;
  }

  private costFromProps(): number {
    const {missing, bsLvl} = this.props;
    if (!missing) {
      return 0;
    }

    const withoutBs: number = Object.values(missing).reduce(reduceCost, 0);
    const modifier: number = parseFloat((1 - (bsLvl! * 0.01)).toFixed(2));

    return Math.ceil(withoutBs * modifier);
  }
}

const reduceCost: (acc: number, levels: number[]) => number = (() => {
  function innerReducer(acc: number, lv: number): number {
    return acc + equipmentCostData[lv - 1];
  }

  function getCostFromData(levels: number[]): number {
    return levels.reduce(innerReducer, 0);
  }

  return (acc: number, levels: number[]): number => {
    return levels.length ? acc + getCostFromData(levels) : acc;
  };
})();
