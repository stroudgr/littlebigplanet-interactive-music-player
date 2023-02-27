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
var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'albumIconDiv', 'albumIcon'];
elms.forEach(function(elm) {
  window[elm] = document.getElementById(elm);
});

var volumeElms = ['volume', 'barEmpty', 'barFull', 'sliderBtn'];


//TODO
//const collection = document.getElementsByClassName("volume");
//const collection = document.getElementsByClassName("barFull");
//const collection = document.getElementsByClassName("barEmpty");
//const collection = document.getElementsByClassName("sliderBtn");


var volumeButtons = [];

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
var Player = function(playlistLBP) {
  
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

    song.attach(self);

  });


};
Player.prototype = {

  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  playAll: function() {
    
    var self = this;

    // TODO???
    //index = typeof index === 'number' ? index : self.index;

    self.playlistLBP[self.index].loadAll();

    for (let index = 0; index < 6; index++) {

      barFulls[index].style.width = 90 + '%';
      sliderBtns[index].style.left = (window.innerWidth * 0.9 + window.innerWidth * 0.05 - 25) + 'px';

    } 

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
   * Triggered when a Howl song finishes.
   * 
   */
  notify: function(msg){
    this.skip(msg);
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

    // Play the new track.
    self.index = index;
    self.playAll();
  },



  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   * @param  {Number} index Track to change volume
   */
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

 
  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seeker: function(per) {
    var self = this;
    self.playlistLBP[self.index].seeker(per);
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
    
    var displays = [];

    let N = self.playlistLBP[self.index].tracks.length;
    
    for (var i = 0; i < N; i++) {
      var d = (window["volume" + i].style.display === 'block') ? 'none' : 'block';
      displays.push(d);
    }

    setTimeout(function() {
      for (var i = 0; i < N; i++) {
        window["volume" + i].style.display = displays[i];
      }
    }, (displays[0] === 'block') ? 0 : 500);

    for (var i = 0; i < N; i++) {
      window["volume" + i].className  = (displays[i] === 'block') ? 'volumey fadein' : 'volumey fadeout';
    }

  }

};

class InteractiveSong {
  constructor(tracks, title, icon, altIcon, color1, color2) {
    this.tracks = tracks;
    this.title = title;
    this.icon = icon;
    this.altIcon = altIcon;
    this.observers = [];
    this.color1 = color1;
    this.color2 = color2;
  }

  attach(obs) {
    if (this.observers.indexOf(obs) === -1)
      this.observers.push(obs);
  }

  notifyObservers(msg){
    var self = this;
    
    this.observers.forEach(function(obs){
      obs.notify(msg);
    });
  }

  stop() {
    var self = this;
    self.tracks.forEach(function(song){
      if (song.howl) {
        song.howl.stop();
      }
    });
  }

  loadAll() {
    //console.log("Loading " + this.title + " ...");
    var self = this;
    self.tracks.forEach(function (track, index) {
      self.load(index);
    });

    var bkgd = document.getElementsByTagName('body')[0];

    albumIcon.src = self.icon;
    albumIcon.alt = self.altIcon;

    if (self.color1 != "" && self.color2 != "") {
      
      try {
        bkgd.style.background = "linear-gradient(0, " + self.color1 + " 0%, " + self.color2 + " 100%)";
        if( !bkgd.style.background || bkgd.style.background == "none")
          bkgd.style.background = "-webkit-linear-gradient(-45deg, " + self.color1 + " 0%, " + self.color2 + " 100%)";
        if( !bkgd.style.background || bkgd.style.background == "none")
          bkgd.style.background = "-moz-linear-gradient(-45deg, " + self.color1 + " 0%, " + self.color2 + " 100%);";
        //if( !bkgd.style.backgroundImage || bkgd.style.backgroundImage == "none")
        //  bkgd.style.backgroundImage = "-o-linear-gradient(...)";
        //if( !bkgd.style.backgroundImage || bkgd.style.backgroundImage == "none")
          // gradient not supported, fall back here
      }
      catch(e) {
        // gradient not supported and browser doesn't like bad values. Fall back here
      }

    }

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
    } else if (!index) {
    
      sound = data.howl = new Howl({
        src: [data.file], //src: ['./audio/Savannah/' + data.file], //+ '.webm'], './audio/Savannah/' + data.file + '.mp3'],
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
          
          self.notifyObservers("next");
          
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


    } else {
      sound = data.howl = new Howl({
        src: [data.file], //src: ['./audio/Savannah/' + data.file], //+ '.webm'], './audio/Savannah/' + data.file + '.mp3'],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).|
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

    // Alternatively: TODO
    /*self.forEach(function(song){
      if (song.howl.playing())
        song.howl.seek(song.howl.duration() * per);
    });*/

  }


  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step() {
    var self = this;

    // Get any Howl track (they are all the same length).
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

  ], "The Gardens", "https://static.wikia.nocookie.net/littlebigplanet/images/b/bf/Interactive_English_Garden.png", "icons/Interactive_English_Garden.webp", "#2b8d4f",  "#0a7339");

var savannah = new InteractiveSong([
  {
    title: 'Percussion',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/4/43/Savannah_1._Percussion.mp3',
    howl: null
  },
  {
    title: 'Drums & Bass',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/a/af/Savannah_2._Drums_%26_Bass.mp3', 
    howl: null
  },
  {
    title: 'Accompaniment A',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/3/30/Savannah_3._Accompaniment_A.mp3',
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

  ], "The Savannah", "https://static.wikia.nocookie.net/littlebigplanet/images/f/fe/Interactive_African_Savannah.png", "icons/Interactive_African_Savannah-transformed.webp", "#d9a424", "#d77f25");


var wedding = new InteractiveSong([
  {
    title: 'Ambient FX',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/b/b0/Wedding_1._Ambient_FX.mp3',
    howl: null
  },
  {
    title: 'Bass',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/e/e2/Wedding_2._Bass.mp3', 
    howl: null
  },
  {
    title: 'Drums',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/d/d0/Wedding_3._Drums.mp3',
    howl: null
  },
  {
    title: 'Accompaniment',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/d/d7/Wedding_4._Accompaniment.mp3', 
    howl: null
  },
  {
    title: 'Melody A',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/e/ed/Wedding_5._Melody_A.mp3', 
    howl: null
  },
  {
    title: 'Melody B',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/c/c1/Wedding_6._Melody_B.mp3', 
    howl: null
  }

  ], "The Wedding", "https://static.wikia.nocookie.net/littlebigplanet/images/1/13/Interactive_Mexican_Graveyard.png", "icons/Interactive_Mexican_Graveyard.webp", "rgb(145, 146, 182)", "rgb(124, 133, 184)");



var canyons = new InteractiveSong([
  {
    title: 'Ambient FX',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/4/4c/Canyons_1._Ambient_FX.mp3',
    howl: null
  },
  {
    title: 'Bass',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/9/92/Canyons_2._Bass.mp3', 
    howl: null
  },
  {
    title: 'Drums',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/c/c8/Canyons_3._Drums.mp3',
    howl: null
  },
  {
    title: 'Accompaniment',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/d/d5/Canyons_4._Accompaniment.mp3', 
    howl: null
  },
  {
    title: 'Melody A',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/c/ca/Canyons_5._Melody_A.mp3', 
    howl: null
  },
  {
    title: 'Melody B',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/a/ae/Canyons_6._Melody_B.mp3', 
    howl: null
  }

  ], "The Canyons", "https://static.wikia.nocookie.net/littlebigplanet/images/e/e7/Interactive_Mexican_Desert.png", "icons/Interactive_Mexican_Desert.webp", "rgb(179, 171, 255)", "rgb(230, 230, 28)");


var metropolis = new InteractiveSong([
  {
    title: 'FX',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/1/15/Metropolis_1._FX.mp3',
    howl: null
  },
  {
    title: 'Bass',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/3/3d/Metropolis_2._Bass.mp3', 
    howl: null
  },
  {
    title: 'Drums',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/b/bf/Metropolis_3._Drums.mp3',
    howl: null
  },
  {
    title: 'Accompaniment',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/1/1b/Metropolis_4._Accompaniment.mp3', 
    howl: null
  },
  {
    title: 'Melody',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/9/91/Metropolis_5._Melody.mp3', 
    howl: null
  },
  {
    title: 'Alternative',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/a/a6/Metropolis_6._Alternative.mp3', 
    howl: null
  }

  ], "The Metropolis", "https://static.wikia.nocookie.net/littlebigplanet/images/3/39/Interactive_USA_City.png", "icons/Interactive_USA_City.webp", "rgb(0, 0, 0)", "rgb(100, 98, 123)");


var islands = new InteractiveSong([
  {
    title: 'Percussion',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/f/f2/Islands_1._Percussion.mp3',
    howl: null
  },
  {
    title: 'Bass',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/2/23/Islands_2._Bass.mp3', 
    howl: null
  },
  {
    title: 'Drums',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/5/58/Islands_3._Drums.mp3',
    howl: null
  },
  {
    title: 'Accompaniment A',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/6/68/Islands_4._Accompaniment_A.mp3', 
    howl: null
  },
  {
    title: 'Accompaniment B',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/6/63/Islands_5._Accompaniment_B.mp3', 
    howl: null
  },
  {
    title: 'Melody',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/1/1e/Islands_6._Melody.mp3', 
    howl: null
  }

  ], "The Islands", "https://static.wikia.nocookie.net/littlebigplanet/images/8/8d/Interactive_Japanese_Zen.png", "icons/Interactive_Japanese_Zen.webp", "rgb(0, 107, 68)", "rgb(163, 221, 235)");


  var temples = new InteractiveSong([
    {
      title: 'Ambient FX',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/e/ef/Temples_1._Ambient_FX.mp3',
      howl: null
    },
    {
      title: 'Percussion',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/6/68/Temples_2._Percussion.mp3', 
      howl: null
    },
    {
      title: 'Bass',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/1/17/Temples_3._Bass.mp3',
      howl: null
    },
    {
      title: 'Drums',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/d/d5/Temples_4._Drums.mp3', 
      howl: null
    },
    {
      title: 'Melody A',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/0/04/Temples_5._Melody_A.mp3', 
      howl: null
    },
    {
      title: 'Melody B',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/e/e1/Temples_6._Melody_B.mp3', 
      howl: null
    }
  
    ], "The Temples", "https://static.wikia.nocookie.net/littlebigplanet/images/b/b4/Interactive_Indian_Jungle.png", "icons/Interactive_Indian_Jungle.webp", "rgb(151, 158, 127)", "rgb(32, 83, 71)");

  

  var wilderness = new InteractiveSong([
    {
      title: 'Bass',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/e/ec/Wilderness_1._Bass.mp3',
      howl: null
    },
    {
      title: 'Drums',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/5/50/Wilderness_2._Drums.mp3', 
      howl: null
    },
    {
      title: 'Accompaniment A',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/a/a9/Wilderness_3._Accompaniment_A.mp3',
      howl: null
    },
    {
      title: 'Accompaniment B',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/e/e6/Wilderness_4._Accompaniment_B.mp3', 
      howl: null
    },
    {
      title: 'Orchestra',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/5/57/Wilderness_5._Orchestra.mp3', 
      howl: null
    },
    {
      title: 'Melody',
      file: 'https://static.wikia.nocookie.net/littlebigplanet/images/5/57/Wilderness_5._Orchestra.mp3', 
      howl: null
    }
  
    ], "The Wilderness", "https://static.wikia.nocookie.net/littlebigplanet/images/9/9d/Interactive_Siberian_Tundra.png", "icons/Interactive_Siberian_Tundra.webp", "rgb(255, 255, 255)", "rgb(140, 147, 190)");




// Setup our new audio player class and pass it the playlist.
var player = new Player([gardens, savannah, wedding, canyons, metropolis, islands, temples, wilderness]);

// Bind our player controls.
playBtn.addEventListener('click', function() {
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
playlist.addEventListener('click', function() {
  player.togglePlaylist();
});
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

  player.playlistLBP[player.index].tracks.forEach(function(song, index) {
    // Update the position of the slider.
    //var sound = player.playlistLBP[player.index].tracks[0].howl;
    if (song.howl) {
      var vol = song.howl.volume();
      var barWidth = (vol * 0.9);

      sliderBtns[index].style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
    }
  });
  
};
window.addEventListener('resize', resize);
resize();
