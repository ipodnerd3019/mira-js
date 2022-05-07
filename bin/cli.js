#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Mira from '../src/mira.js';

const mira = Mira.create();
if (!mira) {
  console.error('No Mira device found');
  process.exit(1);
}

yargs(hideBin(process.argv))
  .command('refresh', 'refresh the screen', () => { }, () => {
    mira.refresh();
  })
  .command('settings', 'apply settings', (args) => {
    args.option('speed', {
      type: 'number',
      description: 'The refresh speed (1-7)',
    }).option('contrast', {
      type: 'number',
      description: 'The contrast (0-15)',
    });
  }, (argv) => {
    if (argv.speed) {
      mira.setSpeed(argv.speed);
    }
    if (argv.contrast) {
      mira.setContrast(argv.contrast);
    }
  })
  .demandCommand(1, 1)
  .version()
  .parse();
