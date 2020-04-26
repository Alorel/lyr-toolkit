import TextField from '@material-ui/core/TextField';
import {noop} from 'lodash-es';
import {Component, h, VNode} from 'preact';
import safeLocalStorage from '../../lib/safeLocalstorage';

interface Props {
  defaultMin?: number;

  label?: string;

  max?: number;

  min?: number;

  name: string;

  onChange?(v: number): void;
}

interface State {
  value: number;
}

export default class TrackableNumberInput extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    defaultMin: 0,
    label: '',
    max: 400,
    min: 0,
    onChange: noop
  };

  public readonly state: Readonly<State>;

  private readonly cfgKey: string;

  public constructor(props: Props) {
    super(...arguments as any);
    this.cfgKey = `app-value-${props.name}`;

    this.state = {
      value: this.resolveInitialValue()
    };
  }

  public componentDidMount(): void {
    this.props.onChange!(this.state.value);
  }

  public render(props, state): VNode {
    return <TextField
      label={props.label}
      autoComplete='off'
      type='number'
      value={state.value}
      onChange={this._onInput}
      inputProps={{min: props.min, max: props.max}}/>;
  }

  private readonly _onInput = (e: Pick<Event, 'target'>): void => {
    const rawValue: string = (e.target as HTMLInputElement).value;
    const strValue: string = rawValue.trim();

    if (strValue === rawValue && !isNaN(strValue as any)) {
      const num = parseInt(strValue);
      const {min, max} = this.props;

      if ((min == null || num >= min) && (max == null || num <= max)) {
        safeLocalStorage.setItem(this.cfgKey, strValue);
        this.setState({value: num});
        this.props.onChange!(num);

        return;
      }
    }

    this.rerender();
  };

  private rerender(): void {
    this.setState({value: this.state.value});
  }

  private resolveInitialValue(): number {
    const storeValue = safeLocalStorage.getItem(this.cfgKey);
    const {min, max} = this.props;

    if (storeValue == null || isNaN(storeValue as any)) {
      return Math.max(min!, 0);
    }

    const asNumber = parseInt(storeValue);

    return Math.max(min!, Math.min(asNumber, max!));
  }
}
