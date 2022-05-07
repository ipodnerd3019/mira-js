#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Mira, { REFRESH_MODE } from '../src/mira.js';

const mira = Mira.create();
if (!mira) {
  console.error('No Mira device found');
  process.exit(1);
}

yargs(hideBin(process.argv))
  .command('refresh', 'refresh the screen', () => { }, () => {
    mira.refresh();
  })
  .command('settings', 'apply settings', {
    speed: {
      type: 'number',
      description: 'The refresh speed (1-7)',
    },
    contrast: {
      type: 'number',
      description: 'The contrast (0-15)',
    },
    'refresh-mode': {
      type: 'string',
      description: 'The refresh mode',
      choices: ['a2', 'direct', 'gray'],
    },
    'dither-mode': {
      type: 'number',
      description: 'The dither mode (0-3)',
    },
  }, (argv) => {
    if (argv.speed) {
      mira.setSpeed(argv.speed);
    }

    if (argv.contrast) {
      mira.setContrast(argv.contrast);
    }

    if (argv.refreshMode) {
      switch (argv.refreshMode) {
        case 'a2':
          mira.setRefreshMode(REFRESH_MODE.a2);
          break;
        case 'direct':
          mira.setRefreshMode(REFRESH_MODE.direct_update);
          break;
        case 'gray':
          mira.setRefreshMode(REFRESH_MODE.gray_update);
          break;
        default:
          throw new Error('Invalid refresh mode');
      }
    }

    if (argv.ditherMode) {
      mira.setDitherMode(argv.ditherMode);
    }
  })
  .demandCommand(1, 1)
  .version()
  .parse();

mira.close();
