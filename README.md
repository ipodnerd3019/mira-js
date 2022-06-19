# Mira-js
Mira-js is a library and CLI for interacting with the Boox Mira and Boox Mira Pro e-ink monitors.

# Usage
Install the CLI globally:
```bash
npm install -g boox-mira
```

Run the CLI:
```bash
npx mira refresh
npx mira settings --speed 3 --contrast 11
```

## Modes
Modes are just combinations of settings flags.
### Speed
```bash
npx mira settings --refresh-mode a2 --contrast 8 --speed 7 --dither-mode 0 --white-filter 0 --black-filter 0
```
### Text
```bash
npx mira settings --refresh-mode a2 --contrast 7 --speed 6 --dither-mode 1 --white-filter 0 --black-filter 0
```
### Image
```bash
npx mira settings --refresh-mode direct --contrast 7 --speed 5 --dither-mode 0 --white-filter 0 --black-filter 0
```
### Video
```bash
npx mira settings --refresh-mode a2 --contrast 7 --speed 6 --dither-mode 2 --white-filter 10 --black-filter 0
```
### Read
```bash
npx mira settings --refresh-mode direct --contrast 7 --speed 5 --dither-mode 3 --white-filter 12 --black-filter 10
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