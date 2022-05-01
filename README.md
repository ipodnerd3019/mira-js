# Mira-js
Mira-js is a library and CLI for interacting with the Boox Mira and Boox Mira Pro e-ink monitors.

# Usage
Install the CLI globally:
```
npm install -g
```

Run the CLI:
```
npx mira refresh
npx mira settings --speed 3 --contrast 11
```

# Linux notes
## udev device permissions
1. Create `/etc/udev/rules.d/58-hid.rules` file
2. Copy the following rules into the file to support `hidraw` and `libusb`.
```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0416", ATTRS{idProduct}=="5020", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{idVendor}=="0416", ATTRS{idProduct}=="5020", MODE="0666", GROUP="plugdev"
```
3. Reload udev rules
```bash
udevadm control --reload-rules && udevadm trigger
```