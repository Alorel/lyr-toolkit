import {createElement, h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {copperToCurrency} from '../../lib/Currency';
import {cCopper, cGold, cPlat, cSilver, currencyDisplay} from './CurrencyDisplay.scss';

interface Props {
  cost: number;

  /**
   * Element to wrap in
   * @default span
   */
  el?: string;
}

function CurrencyDisplay(props: Props) {
  const {cost, el} = props;
  // noinspection SuspiciousTypeOfGuard
  if (typeof cost !== 'number' || cost <= 0) {
    return null;
  }

  const {plat, gold, silver, copper} = copperToCurrency(cost);

  const children: VNode[] = [];
  plat && children.push(<span className={cPlat}>{plat.toLocaleString()}p</span>);
  gold && children.push(<span className={cGold}>{gold}g</span>);
  silver && children.push(<span className={cSilver}>{silver}s</span>);
  copper && children.push(<span className={cCopper}>{copper}c</span>);

  return createElement(el!, {className: currencyDisplay}, ...children);
}
const defaultProps: Partial<Props> = {el: 'span'};
CurrencyDisplay.defaultProps = defaultProps;

const memoed: typeof CurrencyDisplay = memo(CurrencyDisplay);

export {memoed as CurrencyDisplay};
