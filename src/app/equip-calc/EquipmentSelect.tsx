import {Memoise} from '@aloreljs/memoise-decorator';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import {capitalize, identity, noop} from 'lodash-es';
import {h, VNode} from 'preact';
import {PureComponent} from 'preact/compat';
import TrackableNumberInput from '../controls/TrackableNumberInput';
import {Missing} from './EquipmentCalc';
import {EquipmentCalcLimits} from './EquipmentCalcLimits';
import {invisible} from './EquipmentSelect.scss';
import {equipmentTypes} from './equipmentTypes';

export interface EquipmentLevels {
  boots: number;

  chestpiece: number;

  dagger: number;

  gloves: number;

  helm: number;

  leggings: number;

  shortsword: number;

  shoulders: number;

  wrists: number;
}

interface Props {
  keyPrefix: string;

  missing?: Missing;

  onChange?(v: EquipmentLevels): void;
}

export class EquipmentSelect extends PureComponent<Props, EquipmentLevels> {
  public static readonly defaultProps: Partial<Props> = {
    onChange: noop
  };

  public readonly state: EquipmentLevels;

  public componentDidUpdate(): void {
    this.props.onChange!(this.state);
  }

  public render(props): VNode {
    return (
      <Card>
        <CardHeader title={props.children}/>
        <CardContent>
          <Grid container direction='column' spacing={1} alignItems='center'>
            {equipmentTypes.map(this.renderSelect, this)}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  @Memoise(identity)
  private createOnChange(key: keyof EquipmentLevels): (v: number) => void {
    return v => {
      if (v !== this.state[key]) {
        this.setState({[key]: v});
      }
    };
  }

  private renderMissing(key: keyof EquipmentLevels): VNode {
    const {missing} = this.props;
    let clazz: string;
    let contents: string;

    if (!missing || !missing[key] || !missing[key]!.length) {
      clazz = invisible;
      contents = '0';
    } else {
      clazz = '';
      contents = missing[key]!.length.toLocaleString();
    }

    return (
      <Grid item>
        <Box className={clazz} color='primary.main'>-{contents}</Box>
      </Grid>
    );
  }

  private renderSelect(key: keyof EquipmentLevels): VNode {
    return (
      <Grid item key={key}>
        <Grid container direction='row' spacing={1} alignItems='center'>
          <Grid item>
            <TrackableNumberInput name={`${this.props.keyPrefix}-${key}-eq-lv`}
                                  key={key}
                                  onChange={this.createOnChange(key)}
                                  defaultMin={EquipmentCalcLimits.EQ_LVL_MIN}
                                  min={EquipmentCalcLimits.EQ_LVL_MIN}
                                  max={EquipmentCalcLimits.EQ_LVL_MAX}
                                  label={capitalize(key)}/>
          </Grid>
          <Grid item>{this.renderMissing(key)}</Grid>
        </Grid>
      </Grid>
    );
  }
}
