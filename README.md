# PBFMixerControl
 A Bitwig Studio script to automatically map one or more Intech Studio PBF4 modules to Bitwig's mixer.

## How to use
Have any number of PBF4 running a conventional Intech Studio configuration. Use one that does not fiddle with the way the modules' elements are associated to different CC numbers. One of my favorite is "Toggle buttons on release and progressive faders", that I made myself and you can find in the Profile Cloud. Then:

1. Copy all the `.js` files in your Bitwig's `Controller Scripts` folder (on macOS, in `~/Bitwig Studio`)
2. connect any number of PBF4 modules in a straight horizontal line, and the USB cable to one of them
3. Start Bitwig and add the controller normally in the Dashboard in Controllers, choosing Intech Studio in the Hardware Vendor drop down list, and the appropriate "Product" depending on the number of PBF4 modules you are using, e.g. `3xPBF4 for mixing`
4. "Touch" any component of the leftmost module. That will let the script detect how the modules are connected together.

... and you are done. The knobs, faders and buttons will control respectively pan, volume and mutes of the top level tracks in your project, starting from the leftmost track.

## Troubleshooting
- If one of the PBF4 seems not to be recognized, check if Intech Studio's own Grid Editor can see it.
