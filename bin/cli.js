#!/usr/bin/env node

import Mira from '../src/mira';

const mira = Mira.create();
if (!mira) {
  console.error('No Mira device found');
  process.exit(1);
}

mira.refresh();
