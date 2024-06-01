# PBFMixerControl
 A Bitwig Studio script to automatically map one or more Intech Studio PBF4 modules to Bitwig's to-level mixer. 
 
 The script ignores tracks inside groups, or the settings of individual instruments inside instrument layers. This may be managed in future developments.

## How to use
Have any number of PBF4 running a conventional Intech Studio configuration. Use one that does not fiddle with Intech Studio's way to associate the modules' elements to different CC numbers. My favorite is "Toggle buttons on release and progressive faders", that I made myself and does what it says on the tin: 1) it makes the fader's resolution higher at the bottom and lower at the top, and 2) executes the buttons only when they are released, not pressed, that for some reason is a personal preference of mine. You can find that in the Profile Cloud. 

Then:

1. Connect the PBF4 modules in a straight horizontal line, and the USB cable to one of them. This is needed so that the PBF4 modules are associated to MIDI channel 1. You can connect other modules above or below, and they will be ignored by the script. They can still be mapped using Bitwig normally.
2. Copy all the `.js` files in your Bitwig's `Controller Scripts` folder (on macOS, in `~/Bitwig Studio`)
3. Start Bitwig and add the controller normally in the Dashboard in Controllers, choosing `Intech Studio` in the `Hardware Vendor` drop down list, and the appropriate `Product` depending on the number of PBF4 modules you are using, e.g. `3xPBF4 for mixing`
4. "Touch" any element of the leftmost Grid module. That will let the script detect how the modules are connected together. If you don't do this, the script will not be able to know of any modules connected to the left to the module where the USB cable is connected.

... and you are done. The knobs, faders and buttons will control respectively pan, volume and mutes of the top level tracks in your project, starting from the leftmost track.

## Future developments / wishlist
- I hope that there was a way by which the Grid modules could "tell" to the script what their configuration is, so that the script can adapt - and in real time - to wherever the USB cable is connected or if modules are being moved around.
- Associate to the rightmost fader the master channel fader (I understand it is common practice).
- Decide a clever way to manage groups or instrument layers in the mixer.
- Automatically support an equal number of PO16s above the faders, to mimic the layout of a classic MIDI console. The knobs could be associated to the sends.

## Troubleshooting
- If one of the PBF4 seems not to be recognized, check if Intech Studio's own Grid Editor can see it.
