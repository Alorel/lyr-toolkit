import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import {noop} from 'lodash-es';
import {Fragment, h} from 'preact';
import {memo} from 'preact/compat';
import {useState} from 'preact/hooks';
import {MemoedDrawer} from './Drawer';
import {appBarCss, menuButtonCss, titleCss} from './navbar.scss';

export const MemoedNavbar = memo(function Navbar() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <AppBar position='static' className={appBarCss}>
        <IconButton edge='start'
                    onClick={() => {
                      setOpen(!isOpen);
                    }}
                    className={menuButtonCss}
                    color='inherit'
                    aria-label='menu'>
          <MenuIcon/>
        </IconButton>
        <Toolbar>
          <Typography variant='h6' className={titleCss}>Lyr Toolkit</Typography>
        </Toolbar>
      </AppBar>
      <MemoedDrawer open={isOpen} onClose={!isOpen ? noop : () => {
        setOpen(false);
      }}/>
    </Fragment>
  );
});
