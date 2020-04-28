import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import {isEqual, range} from 'lodash-es';
import {h, VNode} from 'preact';
import {PureComponent} from 'preact/compat';
import TrackableNumberInput from '../controls/TrackableNumberInput';
import {EquipmentLevelingCost} from './EquipmentLevelingCost';
import {EquipmentLevels, EquipmentSelect} from './EquipmentSelect';
import {equipmentTypes} from './equipmentTypes';

export type Missing = {
  [K in keyof EquipmentLevels]?: number[];
};

const enum Numbers {
  SPACING = 2,
  MAX_BS_LVL = 50
}

interface State {
  bsLvl: number;

  curr: EquipmentLevels;

  missing: Missing;

  target: EquipmentLevels;
}

function RenderedSubheading(): VNode {
  const txt = 'I only have data for levels 1-400 - if you have the rest or know the math let me know please!';

  return <Box textAlign='center'>{txt}</Box>;
}

export class EquipmentCalc extends PureComponent<any, State> {
  public readonly state: State = {
    bsLvl: 0,
    curr: {} as any,
    missing: {},
    target: {} as any
  };

  public componentDidUpdate(): void {
    const missing: Missing = {};
    const {curr, target} = this.state;

    for (const t of equipmentTypes) {
      if (curr[t] < target[t]) {
        missing[t] = range(curr[t] + 1, target[t] + 1);
      }
    }

    if (!isEqual(missing, this.state.missing)) {
      this.setState({missing});
    }
  }

  public render() {
    const {missing, bsLvl} = this.state;

    return (
      <Grid container justify='center' spacing={Numbers.SPACING}>
        {this.renderSelect()}
        <Grid item>
          <Grid container direction='column' spacing={Numbers.SPACING}>
            <Grid item>
              <Card>
                <CardHeader title={<Box textAlign='center'>Blacksmith level</Box>}/>
                <CardContent>
                  <TrackableNumberInput name='bs-lvl'
                                        onChange={this.onBsChange}
                                        max={Numbers.MAX_BS_LVL}/>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardHeader title={<Box textAlign='center'>Cost</Box>}/>
                <CardContent>
                  <EquipmentLevelingCost bsLvl={bsLvl} missing={missing}/>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  private readonly onBsChange = (bsLvl: number): void => {
    this.setState({bsLvl});
  };

  private readonly onCurrChange = (curr: EquipmentLevels): void => {
    this.setState({curr});
  };

  private readonly onTargetChange = (target: EquipmentLevels): void => {
    this.setState({target});
  };

  private renderSelect(): VNode {
    return (
      <Grid item>
        <Card>
          <CardHeader title={<Box textAlign='center'>Equipment levels</Box>}
                      subheader={<RenderedSubheading/>}/>
          <CardContent>
            <Grid container direction='row' justify='center' spacing={Numbers.SPACING}>
              <Grid item>
                <EquipmentSelect onChange={this.onCurrChange}
                                 keyPrefix='curr'>Current</EquipmentSelect>
              </Grid>
              <Grid item>
                <EquipmentSelect missing={this.state.missing}
                                 onChange={this.onTargetChange}
                                 keyPrefix='target'>Target</EquipmentSelect>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
