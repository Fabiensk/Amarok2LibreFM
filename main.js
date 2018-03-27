/*
	Amarok2LibreFM v. 0.1

Date:	February 7, 2010
Author:	Ed Daniel (esdaniel) based on amarokNotify script by Anthony Mok
E-mail:	ubuntu@esdaniel.org
External dependencies: lastfmsubmitd

      "a bunch of this was hacked together from observing other scripts
      like the encoding-fixer, PidginStatus, and wlmnow", amaroKnotify 
      and the earlier Amarok 1.4 LibreFM plugin
*/

Importer.loadQtBinding( 'qt.core' );
Importer.include ( "config.js" );

function notify() {
  
  // Installation path of lastfmsubmitd can be modified.
  var SUBMIT_CMD = '/usr/lib/lastfmsubmitd/lastfmsubmit'
  try {

    var command = SUBMIT_CMD + ' --encoding UTF-8 ';
    var currentTrack = Amarok.Engine.currentTrack();

    if (currentTrack.artist != '' && currentTrack.title != '') {

      var result = command + '--artist \"' + currentTrack.artist +'\" ';
      result = result + '--title \"' + currentTrack.title +'\" ';
      result = result + '--album \"' + currentTrack.album +'\" ';
      // amarok 2.8 (and maybe other versions) provides the track length in milliseconds
      result = result + '--length ' + Math.round(currentTrack.length/1000);

      var process = new QProcess();
      process.start(result);
      }
    }

  catch  ( err ) {
    Amarok.debug ( err );
  }

}

// Date/time when the last song was started.
var serial = null;

function onTrackChange() {
  if (config["showChange"]) {
    var currentTrack = Amarok.Engine.currentTrack();
    var my_serial = serial = new Date();
    var wait_to_update = currentTrack.length * 0.33; // i.e. wait 33% of track length played before updating (in milliseconds)
    var qo = new QObject();
    qo.event = function (qevent) {
      // if the serial has not changed: same track is being played => be can scrobbel it
      if (my_serial == serial) {
        notify();
      }
      this.killTimer(qo.timerID);
    }
    qo.timerID = qo.startTimer(wait_to_update);
  }
}

Amarok.Engine.trackChanged.connect( onTrackChange );
