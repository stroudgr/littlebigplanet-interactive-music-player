/*
* The controller for the audio player.
*/

/*!
 *  Third Party License.
 *
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

// Cache references to DOM elements.
var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list'];
elms.forEach(function(elm) {
  window[elm] = document.getElementById(elm);
});

var volumeElms = ['volume', 'barEmpty', 'barFull', 'sliderBtn'];

//const collection = document.getElementsByClassName("volume");
//const collection = document.getElementsByClassName("barFull");
//const collection = document.getElementsByClassName("barEmpty");
//const collection = document.getElementsByClassName("sliderBtn");


volumeElms.forEach(function(elm) {
  //window[elm] = document.getElementById(elm);
  window[elm + "s"] = [];

  // TODO 6?
  let N=6, i=0, a=Array(N);

  while(i<N) a[i]=i++;

  a.forEach(function(j) {
    window[elm + j] = document.getElementById(elm + j);
    window[elm + "s"].push(document.getElementById(elm + j));
  });

});


/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */
var Player = function(playlist, playlistLBP) {
  
  this.playlist = playlist;
  this.playlistLBP = playlistLBP;

  this.index = 0;
  this.length = this.playlistLBP.length;

  // Display the title of the first track.
  track.innerHTML = playlistLBP[0].title;

  // Setup the playlist display.
  this.playlistLBP.forEach(function(song) {
    var div = document.createElement('div');
    div.className = 'list-song';
    div.innerHTML = song.title;
    
    div.onclick = function() {
      player.skipTo(playlistLBP.indexOf(song));
    };
    list.appendChild(div);
  });


};
Player.prototype = {
  /** 
   * Play the current song.
   * 
   */
  playAll: function() {
    
    var self = this;


    // TODO???
    //index = typeof index === 'number' ? index : self.index;

    self.playlistLBP[self.index].loadAll();
    track.innerHTML = self.playlistLBP[self.index].title;
    self.playlistLBP[self.index].play();

    // Show the pause button.
    if (self.playlistLBP[self.index].tracks[0].howl.state() === 'loaded') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
    } else {
      loading.style.display = 'block';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
    }

  },

  /** 
   * Pause the current song.
   * 
   */
  pauseAll: function() {
    
    var self = this;
    self.playlistLBP[self.index].pauseIt();

    // Show the play button.
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';

  },

  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  //TODO placmeent of comment


  

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function(direction) {
    var self = this;

    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === 'prev') {
      index = self.index - 1;
      if (index < 0) {
        index = self.playlistLBP.length - 1;
      }
    } else {
      index = self.index + 1;
      if (index >= self.playlistLBP.length) {
        index = 0;
      }
    }

    self.skipTo(index);
  },

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo: function(index) {
    var self = this;

    // Stop the current track.
    self.playlistLBP[self.index].stop();
    
    // Reset progress.
    progress.style.width = '0%';

    //barFull.style.width = self.volumePercents[index];
    //sliderBtn.style.left = self.volumeSliderButtonLocs[index];

    // Play the new track.
    self.index = index;
    self.playAll();
  },

  volumeTrackAtIndex(val, index) {
    var self = this;
    self.playlistLBP[self.index].volumeTrackAtIndex(val, index);

    var barWidth = (val * 90) / 100;
    barFulls[index].style.width = (barWidth * 100) + '%';
    sliderBtns[index].style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';

  },



  // TODO song global volume?
  /*volumeTrack: function(val) {
    var self = this;

    self.playlistLBP[self.index].volumeTrack(val);

    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';

  },*/


  // tODO comment put somewhere
  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
 

  seeker: function(per) {
    var self = this;
    self.playlistLBP[self.index].seeker(per);
  },


  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function(per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function() {

    var display = (window.playlist.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      window.playlist.style.display = display;
    }, (display === 'block') ? 0 : 500);
    window.playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume: function() {
    var self = this;
    //var display = (volume.style.display === 'block') ? 'none' : 'block';

    var displays = [];

    let N = self.playlistLBP[self.index].tracks.length;
    
    for (var i = 0; i < N; i++) {
      var d = (window["volume" + i].style.display === 'block') ? 'none' : 'block';
      displays.push(d);
    }

    setTimeout(function() {
      //volume.style.display = display;
      for (var i = 0; i < N; i++) {
        window["volume" + i].style.display = displays[i];
      }
    }, (displays[0] === 'block') ? 0 : 500);

    //volume.className = (display === 'block') ? 'volumey fadein' : 'volumey fadeout';

    for (var i = 0; i < N; i++) {
      window["volume" + i].className  = (displays[i] === 'block') ? 'volumey fadein' : 'volumey fadeout';
    }

  }

};

class InteractiveSong {
  constructor(tracks, title, icon, altIcon) {
    this.tracks = tracks;
    this.title = title;
  }

  stop() {
    self.tracks.forEach(function(song){
      if (song.howl) {
        song.howl.stop();
      }
    });
  }

  loadAll() {
    var self = this;
    self.tracks.forEach(function (track, index) {
      self.load(index);
    });
  }

  // TODO privatize this method.
  load(index) {
    var self = this;
    var sound;

    var data = self.tracks[index];

    let trackIdx = index;

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl;
    } else {
    
      sound = data.howl = new Howl({
        src: [data.file], //src: ['./Savannah/' + data.file], //+ '.webm'], './Savannah/' + data.file + '.mp3'],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay: function() {
          // Display the duration.
          duration.innerHTML = self.formatTime(Math.round(sound.duration()));

          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self));

          // Start the wave animation if we have already loaded
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          pauseBtn.style.display = 'block';
        },
        onload: function() {
          // Start the wave animation.
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          loading.style.display = 'none';
        },
        onend: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
          
          // While there is only one song, can simply replay same song instead of skipping.
          //self.play(trackIdx);
          self.tracks[trackIdx].howl.play();

          //TODO
          //self.skip("next");

          // Shows play button when song ends.
          //playBtn.style.display = 'block';
          //pauseBtn.style.display = 'none';
          
        },
        onpause: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        },
        onstop: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        },
        onseek: function() {
          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self));
        }
      });


    }

  }

  play() {

    var self = this;
    self.tracks.forEach(function(song, index) {
      self.load(index);
    });

    self.tracks.forEach(function(song) {
      song.howl.play();
    });
  }


  pauseIt() {

    var self = this;

    self.tracks.forEach(function(song) {
      song.howl.pause();
    });

    // Show the play button.
    //playBtn.style.display = 'block';
    //pauseBtn.style.display = 'none';

  }

  stop() {
    var self = this;
    self.tracks.forEach(function(song) {
      if (song.howl) {
        song.howl.stop();
      }
    });
  }


  volumeTrackAtIndex(val, index) {
    var self = this;
    var sound = self.tracks[index].howl;

    sound.volume(val);

  }


  seeker(per) {
    var self = this;

    for (var i = 0; i < self.tracks.length; i++) {
      // Get the Howl we want to manipulate.
      var sound = self.tracks[i].howl;

      // Convert the percent into a seek position.
      if (sound.playing()) {
        sound.seek(sound.duration() * per);
      }
    }

  }


  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step() {
    var self = this;

    // Get any Howl track.
    var sound = self.tracks[0].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  }

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secons Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime(secons) {
    var minutes = Math.floor(secons / 60) || 0;
    var seconds = (secons - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }



}

var gardens = new InteractiveSong([
  {
    title: 'Ambient FX',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/4/40/Gardens_Ambient_FX.MP3',
    howl: null
  },
  {
    title: 'Bass',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/c/cc/Gardens_Bass.MP3',
    howl: null
  },
  {
    title: 'Drums',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/2/20/Gardens_Drums.MP3',
    howl: null
  },
  {
    title: 'Accompaniment A',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/b/b9/Gardens_Accompaniment_A.MP3', 
    howl: null
  },
  {
    title: 'Accompaniment B',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/f/f9/Gardens_Melody.MP3', 
    howl: null
  },
  {
    title: 'Melody',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/0/03/Gardens_Accompaniment_B.MP3', 
    howl: null
  }

  ], "The Gardens", "", "");

var savannah = new InteractiveSong([
  {
    title: 'Percussion', //'Rave Digger',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/4/43/Savannah_1._Percussion.mp3', //'rave_digger',
    howl: null
  },
  {
    title: 'Drums & Bass', //'80s Vibe',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/a/af/Savannah_2._Drums_%26_Bass.mp3',//'80s_vibe',
    howl: null
  },
  {
    title: 'Accompaniment A', //'Running Out',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/3/30/Savannah_3._Accompaniment_A.mp3', //'running_out',
    howl: null
  },
  {
    title: 'Accompaniment B',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/7/70/Savannah_4._Accompinament_B.mp3', 
    howl: null
  },
  {
    title: 'Accompaniment C',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/b/b8/Savannah_5._Accompinament_C.mp3', 
    howl: null
  },
  {
    title: 'Melody',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/f/f6/Savannah_6._Melody.mp3', 
    howl: null
  }

  ], "Savannah", "", "");



// Setup our new audio player class and pass it the playlist.
var player = new Player([ // List og songs
  [ // A song
    [ // list of tracks in this song.
    {
      title: 'Percussion', //'Rave Digger',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/4/43/Savannah_1._Percussion.mp3', //'rave_digger',
      howl: null
    },
    {
      title: 'Drums & Bass', //'80s Vibe',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/a/af/Savannah_2._Drums_%26_Bass.mp3',//'80s_vibe',
      howl: null
    },
    {
      title: 'Accompaniment A', //'Running Out',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/3/30/Savannah_3._Accompaniment_A.mp3', //'running_out',
      howl: null
    },
    {
      title: 'Accompaniment B',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/7/70/Savannah_4._Accompinament_B.mp3', 
      howl: null
    },
    {
      title: 'Accompaniment C',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/b/b8/Savannah_5._Accompinament_C.mp3', 
      howl: null
    },
    {
      title: 'Melody',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/f/f6/Savannah_6._Melody.mp3', 
      howl: null
    }

    ], "Savannah"
  ],
  [ // Another song
    [], // tracks of another song 
    "The Gardens"
  ]
], [gardens, savannah]
);

// Bind our player controls.
playBtn.addEventListener('click', function() {
  //player.play();
  player.playAll();
});
pauseBtn.addEventListener('click', function() {
  player.pauseAll();
});
prevBtn.addEventListener('click', function() {
  player.skip('prev');
});
nextBtn.addEventListener('click', function() {
  player.skip('next');
});
waveform.addEventListener('click', function(event) {
  player.seeker(event.clientX / window.innerWidth);
});
playlistBtn.addEventListener('click', function() {
  player.togglePlaylist();
});
//playlist.addEventListener('click', function() {
//  player.togglePlaylist();
//});
volumeBtn.addEventListener('click', function() {
  player.toggleVolume();
});
//volume.addEventListener('click', function() {
//  player.toggleVolume();
//});

window.sliderDown = [];
for (let i = 0; i < 6; i++) {
  window.sliderDown.push(false);
  barEmptys[i].addEventListener('click', function(event) {
    var per = event.layerX / parseFloat(barEmptys[i].scrollWidth);
    player.volumeTrackAtIndex(per, i);
  });

  sliderBtns[i].addEventListener('mousedown', function() {
    window.sliderDown[i] = true;
  });

  sliderBtns[i].addEventListener('touchstart', function() {
    window.sliderDown[i] = true;
  });

  volumes[i].addEventListener('mouseup', function() {
    window.sliderDown[i] = false;
  });

  volumes[i].addEventListener('touchend', function() {
    window.sliderDown[i] = false;
  });


}


var moves = function(event, index) {
  
  if (window.sliderDown[index]) {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmptys[index].scrollWidth)));
    player.volumeTrackAtIndex(per, index);
  }
};

for (let i = 0; i < 6; i++) {
  
  var m = function(event) {moves(event, i)};
  volumes[i].addEventListener('mousemove', m);
  volumes[i].addEventListener('touchmove', m);
}




// Setup the event listeners to enable dragging of volume slider.
/*barEmpty.addEventListener('click', function(event) {
  var per = event.layerX / parseFloat(barEmpty.scrollWidth);
  player.volumeTrack(per);
});
sliderBtn.addEventListener('mousedown', function() {
  window.sliderDown = true;
});
sliderBtn.addEventListener('touchstart', function() {
  window.sliderDown = true;
});
volume.addEventListener('mouseup', function() {
  window.sliderDown = false;
});
volume.addEventListener('touchend', function() {
  window.sliderDown = false;
});*/

/*var move = function(event) {
  if (window.sliderDown) {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
    player.volumeTrack(per);
  }
};*/

//volume.addEventListener('mousemove', move);
//volume.addEventListener('touchmove', move);

// Setup the "waveform" animation.
var wave = new SiriWave({
  container: waveform,
  width: window.innerWidth,
  height: window.innerHeight * 0.3,
  cover: true,
  speed: 0.03,
  amplitude: 0.7,
  frequency: 2
});
wave.start();

// Update the height of the wave animation.
// These are basically some hacks to get SiriWave.js to do what we want.
var resize = function() {
  var height = window.innerHeight * 0.3;
  var width = window.innerWidth;
  wave.height = height;
  wave.height_2 = height / 2;
  wave.MAX = wave.height_2 - 4;
  wave.width = width;
  wave.width_2 = width / 2;
  wave.width_4 = width / 4;
  wave.canvas.height = height;
  wave.canvas.width = width;
  wave.container.style.margin = -(height / 2) + 'px auto';

  // Update the position of the slider.
  var sound = player.playlist[player.index].howl;
  if (sound) {
    var vol = sound.volume();
    var barWidth = (vol * 0.9);
    sliderBtns[0].style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  }
};
window.addEventListener('resize', resize);
resize();
