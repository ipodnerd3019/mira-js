#!/usr/bin/env node

import HID from 'node-hid';
import  * as commands from './commands.js'

const VID = 0x0416;
const PID = 0x5020;

let device = new HID.HID(VID, PID);

if (!device) {
  console.error('No Mira device found');
  process.exit(1);
}
console.log('Mira device found');

console.log('Sending Refresh command');
device.write(commands.buildRefreshCommand());