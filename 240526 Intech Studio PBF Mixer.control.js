const VENDOR = "Intech Studio";
const EXTENSION_NAME = "PBF4 for mixing";
const EXTENSION_UUID = "7f439224-2e01-42bc-a935-63f923c77802";
const VERSION = "0.2";

var knownLeftmostPosition = undefined;
// var firstKnownCc = undefined;

loadAPI(18);
load("TransportHandler.js");

host.setShouldFailOnDeprecatedUse(true);
host.defineMidiPorts(1, 0);
host.defineController(VENDOR, EXTENSION_NAME, VERSION, EXTENSION_UUID, "giacecco");

function init() {

   // transport = host.createTransport();
   host.getMidiInPort(0).setMidiCallback(onMidi0);
   host.getMidiInPort(0).setSysexCallback(onSysex0);
   host.println(VENDOR + " " + EXTENSION_NAME + " " + VERSION + " initialized!");

   project = host.getProject();
   rootTrackGroup = project.getShownTopLevelTrackGroup();
   rootTrackGroup.isGroup().addValueObserver(function (value) {
      host.println("isGroup: " + value);
   });

   // host.errorln("Error!");
   // host.showPopupNotification("Hello world!");
   /*
   rootTrackGroup.trackType().addValueObserver(function (value) {
      host.println(value);
   });
   */

}

function onMidi0(status, cc, value) {

   // detect a Grid module's position from any of its CC being used (assuming they are in a horizontal line)
   function getModulePositionFromCc(cc) {
      return ((cc - cc % 16) - 32) / 16;
   }

   // tries to detect the leftmost known Grid module as the modules are used
   function checkForKnownLeftmostPosition(cc) {
      var position = getModulePositionFromCc(cc);
      knownLeftmostPosition = (!knownLeftmostPosition || position < knownLeftmostPosition) ? position : knownLeftmostPosition;
   }

   // given the leftmost Grid module known, calculates the track number corresponding to the elements just used
   function getTracknoFromCc(cc) {
      return (getModulePositionFromCc(cc) - knownLeftmostPosition) * 4 + cc % 4;
   }

   // this needs to be run for each MIDI message received, just in case a new leftmost module is revealed
   checkForKnownLeftmostPosition(cc);

   // just debug output
   host.println(status + " " + cc + " " + value);

   // var rootTrackGroup = project.getRootTrackGroup();
   // host.println(****.getChannel(0).volume());

}

// Called when a MIDI sysex message is received on MIDI input port 0.
function onSysex0(data) {
   // MMC Transport Controls:
   switch (data) {
      case "f07f7f0605f7":
         transport.rewind();
         break;
      case "f07f7f0604f7":
         transport.fastForward();
         break;
      case "f07f7f0601f7":
         transport.stop();
         break;
      case "f07f7f0602f7":
         transport.play();
         break;
      case "f07f7f0606f7":
         transport.record();
         break;
   }
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}