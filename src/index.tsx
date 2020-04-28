import {h, hydrate, render} from 'preact';
import App from './app/App';

const rootElement = document.getElementById('root') as HTMLDivElement;
if (rootElement.innerHTML.trim()) {
  hydrate(<App/>, rootElement);
} else {
  render(<App/>, rootElement);
}
