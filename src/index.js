import HID from 'node-hid';

const VID = 0x0416;
const PID = 0x5020;

const COMMAND = {
  REFRESH: 0x01,
};

let device = new HID.HID(VID, PID);

if (!device) {
  console.error('No Mira device found.');
  process.exit(1);
}

console.error('Mira device found.');
let command_buf = Buffer.alloc(1);
command_buf.writeUInt8(COMMAND.REFRESH);
device.write(command_buf);

process.exit(0);