#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Mira, { REFRESH_MODE } from '../src/mira.js';

const mira = Mira.create();
if (!mira) {
  console.error('No Mira device found');
  process.exit(1);
}

await yargs(hideBin(process.argv))
  .command('refresh', 'refresh the screen', () => { }, async () => {
    await mira.refresh();
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
  }, async (argv) => {
    if (argv.speed) {
      await mira.setSpeed(argv.speed);
    }

    if (argv.contrast) {
      await mira.setContrast(argv.contrast);
    }

    if (argv.refreshMode) {
      switch (argv.refreshMode) {
        case 'a2':
          await mira.setRefreshMode(REFRESH_MODE.a2);
          break;
        case 'direct':
          await mira.setRefreshMode(REFRESH_MODE.direct_update);
          break;
        case 'gray':
          await mira.setRefreshMode(REFRESH_MODE.gray_update);
          break;
        default:
          throw new Error('Invalid refresh mode');
      }
    }

    if (argv.ditherMode) {
      await mira.setDitherMode(argv.ditherMode);
    }
  })
  .demandCommand(1, 1)
  .version()
  .parse();

mira.close();
