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
	
  try {

    var command = '/usr/lib/lastfmsubmitd/lastfmsubmit --encoding UTF-8 ';
    var currentTrack = Amarok.Engine.currentTrack();

    if (currentTrack.artist != '' && currentTrack.title != '') {

      var result = command + '--artist \"' + currentTrack.artist +'\" ';
      result = result + '--title \"' + currentTrack.title +'\" ';
      result = result + '--album \"' + currentTrack.album +'\" ';
      result = result + '--length ' + currentTrack.length;

      var process = new QProcess();
      process.start(result);
      }
    }

  catch  ( err ) {
    Amarok.debug ( err );
  }

}

function onTrackChange() {
  if (config["showChange"]) {
    var currentTrack = Amarok.Engine.currentTrack();
    var wait_to_update = currentTrack.length * 0.33; // i.e. wait 33% of track length played before updating (in milliseconds)
    var qo = new QObject();
    qo.event = function(qevent) {
	if (currentTrack.path == Amarok.Engine.currentTrack().path) {
	  notify();
	}
	this.killTimer(qo.timerID);
    }
    qo.timerID = qo.startTimer(wait_to_update);
  }
}

Amarok.Engine.trackChanged.connect( onTrackChange );