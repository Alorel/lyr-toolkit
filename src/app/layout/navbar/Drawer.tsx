import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {noop} from 'lodash-es';
import {h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {createStaticComponent} from '../../../lib/createStaticComponent';
import {drawerListCss} from './navbar.scss';

interface DrawerProps {
  open: boolean;

  onClose?(): void;
}

const DrawerList = createStaticComponent(function RawDrawerList(): VNode {
  return (
    <List>
      <ListItem button>
        <ListItemText primary='Equipment leveling calculator'/>
      </ListItem>
    </List>
  );
});

function RawDrawer({open, onClose}: DrawerProps): VNode {
  return (
    <Drawer anchor='left' open={open} onClose={onClose!}>
      <div className={drawerListCss}
           role='presentation'
           onClick={onClose!}>
        <DrawerList/>
      </div>
    </Drawer>
  );
}

RawDrawer.defaultProps = {onClose: noop};

export const MemoedDrawer = memo(RawDrawer);
