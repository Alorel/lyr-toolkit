import {makeStyles} from '@material-ui/core/styles';
import {h, RenderableProps, VNode} from 'preact';
import {createStaticComponent} from '../../../lib/createStaticComponent';
import {hostCss} from './Footer.scss';

const useStyles = makeStyles(theme => ({
  link: {color: theme.palette.primary.main}
}));

function RefLink(props: RenderableProps<{}>): VNode {
  const s = useStyles();

  return <a href="https://lyrania.co.uk/?r=237937"
            target="blank"
            rel="nofollow noopener"
            className={s.link}>{props.children}</a>;
}

function UnmemoedFooter(): VNode {
  return (
    <footer className={hostCss}>
      <span>Created by Goosetopher for </span>
      <RefLink>Lyrania</RefLink>
    </footer>
  );
}

export const Footer = createStaticComponent(UnmemoedFooter);
