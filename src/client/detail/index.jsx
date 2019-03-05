import { render } from 'preact';

import menu from '$lib/common/menu';

// eslint-disable-next-line
import App from './app';

import './css';

render(<App />, document.body);

$(menu.ready);
