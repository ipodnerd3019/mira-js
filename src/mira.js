import HID from 'node-hid';

if (process.platform === 'linux') {
  // libusb seems to be more reliable on Linux
  HID.setDriverType('libusb');
}

const VID = 0x0416;
const PID = 0x5020;

const OP_CODE = {
  refresh: 0x01,
  speed: 0x04,
  contrast: 0x05,
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
}
