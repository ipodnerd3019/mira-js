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
    'black-filter': {
      type: 'number',
      description: 'The black filter level (0-254). Black and white filters must be set together.',
    },
    'white-filter': {
      type: 'number',
      description: 'The white filter level (0-254). Black and white filters must be set together.',
    },
  }, async (argv) => {
    if ('speed' in argv) {
      await mira.setSpeed(argv.speed);
    }

    if ('contrast' in argv) {
      await mira.setContrast(argv.contrast);
    }

    if ('refreshMode' in argv) {
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

    if ('ditherMode' in argv) {
      await mira.setDitherMode(argv.ditherMode);
    }

    if ('blackFilter' in argv || 'whiteFilter' in argv) {
      await mira.setColorFilter(argv.whiteFilter || 0, argv.blackFilter || 0);
    }
  })
  .demandCommand(1, 1)
  .version()
  .parse();

mira.close();
