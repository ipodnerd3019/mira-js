import HID from 'node-hid';

const VID = 0x0416;
const PID = 0x5020;

const OP_CODE = {
  refresh: 0x01,
};

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
}
