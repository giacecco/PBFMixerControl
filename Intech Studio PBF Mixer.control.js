const VENDOR = "Intech Studio";
const EXTENSION_NAME = "PBF4 for mixing";
const EXTENSION_UUID = "7f439224-2e01-42bc-a935-63f923c77802";
const VERSION = "0.3";

loadAPI(18);

host.setShouldFailOnDeprecatedUse(true);
host.defineController(VENDOR, EXTENSION_NAME, VERSION, EXTENSION_UUID, "giacecco");
host.defineMidiPorts(1, 0);

var hardware = null;
var trackHandler = null;
var knownLeftmostPosition = undefined;

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

   // this will have to change a lot to support multiple Intech Studio modules
   function getBankPositionFromCc (cc) {
      return (cc - 32) % 4;
   }

   host.println(status + " " + cc + " " + value);
   if (isChannelController(status)) {
      var bankPosition = getBankPositionFromCc(cc);
      if((cc >= 32) && (cc <= 35)) {
         // pan knobs
         this.trackbank.getItemAt(bankPosition).pan().set(value, 128);
         return true;
      } else if ((cc >= 36) && (cc <= 39)) {
         // volume faders
         this.trackbank.getItemAt(bankPosition).volume().set(value, 128);
         return true;
      }
   }
   return false;
}

function init() {

   hardware = new PBF4Hardware(host.getMidiInPort(0), handleMidi);
   trackHandler = new TrackHandler (host.createMainTrackBank (4, 0, 0), host.createCursorTrack ("MOXF_CURSOR_TRACK", "Cursor Track", 0, 0, true));
   host.println(VENDOR + " " + EXTENSION_NAME + " " + VERSION + " initialized!");

}

function handleMidi(status, data1, data2) {
   if (trackHandler.handleMidi (status, data1, data2)) return;
   host.errorln ("MIDI command not processed: " + status + " : " + data1);
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}