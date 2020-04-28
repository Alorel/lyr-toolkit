import deepPurple from '@material-ui/core/colors/deepPurple';
import purple from '@material-ui/core/colors/purple';
import CssBaseline from '@material-ui/core/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/styles/ThemeProvider/ThemeProvider';
import {h, VNode} from 'preact';
import {EquipmentCalc} from './equip-calc/EquipmentCalc';
import {Footer} from './layout/footer/Footer';
import {MemoedNavbar} from './layout/navbar/Navbar';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: deepPurple,
    type: 'dark'
  }
});

export default function App(): VNode {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <MemoedNavbar/>
      <EquipmentCalc/>
      <Footer/>
    </ThemeProvider>
  );
}
