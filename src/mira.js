import HID from 'node-hid';
import { promisify } from 'util';

if (process.platform === 'linux') {
  // libusb seems to be more reliable on Linux
  HID.setDriverType('libusb');
}

const VID = 0x0416;
const PID = 0x5020;

const OP_CODE = {
  refresh: 0x01,
  set_refresh_mode: 0x02,
  set_speed: 0x04,
  set_contrast: 0x05,
  set_dither_mode: 0x09,
  set_color_filter: 0x11,
};

export const REFRESH_MODE = {
  direct_update: 0x01, // black/white, fast
  gray_update: 0x02, // gray scale, slow
  a2: 0x03, // fast
};

const USB_REPORT_ID = 0x00;

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

const sleep = promisify(setTimeout);

const SLEEP_AFTER_WRITE_MS = 500;

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

  async write(buffer) {
    this.device.write(buffer);
    await sleep(SLEEP_AFTER_WRITE_MS);
  }

  async refresh() {
    await this.write([USB_REPORT_ID, OP_CODE.refresh]);
  }

  async setSpeed(speed) {
    let adjustedSpeed = clamp(speed, 1, 7);
    adjustedSpeed = 11 - adjustedSpeed;
    await this.write([USB_REPORT_ID, OP_CODE.set_speed, adjustedSpeed]);
  }

  async setContrast(contrast) {
    const adjustedContrast = clamp(contrast, 0, 15);
    await this.write([USB_REPORT_ID, OP_CODE.set_contrast, adjustedContrast]);
  }

  async setRefreshMode(mode) {
    if (!Object.values(REFRESH_MODE).includes(mode)) {
      throw new Error('Invalid refresh mode');
    }
    await this.write([USB_REPORT_ID, OP_CODE.set_refresh_mode, mode]);
  }

  async setDitherMode(mode) {
    const adjustedMode = clamp(mode, 0, 3);
    await this.write([USB_REPORT_ID, OP_CODE.set_dither_mode, adjustedMode]);
  }

  async setColorFilter(whiteFilter, blackFilter) {
    const adjustedWhite = 255 - clamp(whiteFilter, 0, 254);
    const adjustedBlack = clamp(blackFilter, 0, 254);
    await this.write([USB_REPORT_ID, OP_CODE.set_color_filter, adjustedWhite, adjustedBlack]);
  }
}
