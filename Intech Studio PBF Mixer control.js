const VENDOR = "Intech Studio";
const VERSION = "0.5";

loadAPI(18);

host.setShouldFailOnDeprecatedUse(true);
host.defineController(VENDOR, EXTENSION_NAME, VERSION, EXTENSION_UUID, "giacecco");
host.defineMidiPorts(1, 0);

var hardware = null;
var trackHandler = null;
var knownLeftmostPosition = null;
var knownRightmostPosition = null;

// detect a Grid module's position from any of its CC being used (assuming they are in a horizontal line)
function getModulePositionFromCc(cc) {
   return ((cc - cc % 16) - 32) / 16;
}

function PBF4Hardware(inputPort, inputCallback) {
    this.portIn  = inputPort;
    this.portIn.setMidiCallback(inputCallback);
}

function TrackHandler (trackbank, cursorTrack)
{
    this.trackbank = trackbank;
    this.cursorTrack = cursorTrack;
    for (i = 0; i < this.trackbank.getSizeOfBank (); i++) {
        var track = this.trackbank.getItemAt (i);
        var p = track.pan ();
        p.markInterested ();
        p.setIndication (true);
        p = track.volume ();
        p.markInterested ();
        p.setIndication (true);
    }
    this.trackbank.followCursorTrack (this.cursorTrack);
    this.cursorTrack.solo ().markInterested ();
    this.cursorTrack.mute ().markInterested ();
}

TrackHandler.prototype.handleMidi = function (status, cc, value) {

   // given the leftmost Grid module known, calculates the track number corresponding to the elements just used
   function getBankPositionFromCc(cc) {
      return (getModulePositionFromCc(cc) - knownLeftmostPosition) * 4 + cc % 4;
   }

   // status seems to be the MIDI status byte according to the official specifications 
   // https://midi.org/expanded-midi-1-0-messages-list ; 176 is "Chan 1 Control/Mode Change".
   // note that, in the specifications, channels are numbered starting from 1, not 0.
   if (status == 176) {
      var bankPosition = getBankPositionFromCc(cc);
      switch (cc % 16) {
         case 0:
         case 1:
         case 2:
         case 3:
            // pan knobs
            this.trackbank.getItemAt(bankPosition).pan().set(value, 128);
            return true;
         case 4:
         case 5:
         case 6:
         case 7:
            // volume faders
            this.trackbank.getItemAt(bankPosition).volume().set(value, 128);
            return true;
         case 8:
         case 9:
         case 10:
         case 11:
            // mute buttons
            this.trackbank.getItemAt(bankPosition).mute().set(value == 127);
            return true;
        }
   }
   return false;
}

function init() {
   var bankSize = (NO_OF_PBFS ? NO_OF_PBFS : 1) * 4;
   hardware = new PBF4Hardware(host.getMidiInPort(0), handleMidi);
   trackHandler = new TrackHandler(host.createMainTrackBank (bankSize, 0, 0), host.createCursorTrack ("MOXF_CURSOR_TRACK", "Cursor Track", 0, 0, true));
   host.println(VENDOR + " " + EXTENSION_NAME + " " + VERSION + " initialized!");
}

function handleMidi(status, cc, value) {

   // tries to detect the leftmost known Grid module as the modules are used
   function checkForKnownLeftmostPosition(cc) {
      var position = getModulePositionFromCc(cc);
      var changed = false;
      knownLeftmostPosition = (!knownLeftmostPosition || position < knownLeftmostPosition) ? position : knownLeftmostPosition;
      if (!knownLeftmostPosition || position < knownLeftmostPosition) {
         knownLeftmostPosition = position; changed = true;
      } 
      if (!knownRightmostPosition || position > knownRightmostPosition) {
         knownRightmostPosition = position; changed = true;
      }
      // if (changed) init(knownRightmostPosition - knownLeftmostPosition + 1);
   }

   // this needs to be run for each MIDI message received, just in case a new leftmost module is revealed
   checkForKnownLeftmostPosition(cc);
   
   if (trackHandler.handleMidi (status, cc, value)) return;
   host.errorln ("MIDI command not processed: " + status + " : " + cc);
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}