import { EventEmitter } from 'events';

import logic from './logic';

import './css';

$.fx.interval = 16.67;
const bus = new EventEmitter();

logic(bus);

bus.emit('init');

$(() => bus.emit('ready'));

