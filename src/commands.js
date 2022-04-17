export const COMMAND = {
  REFRESH: 0x01,
};

export function buildRefreshCommand() {
  let command_buf = Buffer.alloc(1);
  command_buf.writeUInt8(COMMAND.REFRESH);
  return command_buf;
};