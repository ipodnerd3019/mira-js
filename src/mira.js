import HID from 'node-hid';

if (process.platform === 'linux') {
  // libusb seems to be more reliable on Linux
  HID.setDriverType('libusb');
}

const VID = 0x0416;
const PID = 0x5020;

const OP_CODE = {
  refresh: 0x01,
  refresh_mode: 0x02,
  speed: 0x04,
  contrast: 0x05,
  dither_mode: 0x09,
};

export const REFRESH_MODE = {
  direct_update: 0x01, // black/white, fast
  gray_update: 0x02, // gray scale, slow
  a2: 0x03, // fast
};

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

export default class Mira {
  constructor(device) {
    if (!device) {
      throw new Error('Mira constructed with an invalid device');
    }
    this.device = device;
  }

  static create() {
    const device = new HID.HID(VID, PID);
    if (!device) {
      return null;
    }
    return new Mira(device);
  }

  close() {
    this.device.close();
  }

  refresh() {
    this.device.write([OP_CODE.refresh]);
  }

  setSpeed(speed) {
    let adjustedSpeed = clamp(speed, 1, 7);
    adjustedSpeed = 11 - adjustedSpeed;
    this.device.write([OP_CODE.speed, adjustedSpeed]);
  }

  setContrast(contrast) {
    const adjustedContrast = clamp(contrast, 0, 15);
    this.device.write([OP_CODE.contrast, adjustedContrast]);
  }

  setRefreshMode(mode) {
    if (!Object.values(REFRESH_MODE).includes(mode)) {
      throw new Error('Invalid refresh mode');
    }
    this.device.write([OP_CODE.refresh_mode, mode]);
  }

  setDitherMode(mode) {
    const adjustedMode = clamp(mode, 0, 3);
    this.device.write([OP_CODE.dither_mode, adjustedMode]);
  }
}
