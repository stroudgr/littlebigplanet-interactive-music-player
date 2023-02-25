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
var Player = function(playlist, title) {
  this.playlist = playlist;
  this.index = 0;
  this.length = playlist.length;

  //this.volumePercents = new Array(playlist.length).fill(barFull.style.width);
  //this.volumeSliderButtonLocs = new Array(playlist.length).fill(sliderBtn.style.left);
    
  // Display the title of the first track.
  track.innerHTML = title;

  // Setup the playlist display.
  playlist.forEach(function(song) {
    var div = document.createElement('div');
    div.className = 'list-song';
    div.innerHTML = song.title;
    //TODO
    div.onclick = function() {
      player.skipTo(playlist.indexOf(song));
    };
    list.appendChild(div);
  });
};
Player.prototype = {
  /** 
   * Play all parts of the song.
   * 
   * **/
  playAll: function() {
    var self = this;
    self.playlist.forEach(function(song, index) {
      self.play(index);
    });

    self.playlist.forEach(function(song) {
      song.howl.play();
    });

    //for (var i of Array.from(new Array(self.playlist.length), (x, i) => self.playlist.length - i - 1)) {
    //  self.play(i);
    //}

  },

  

  /** 
   * Pauses all parts of the song.
   * 
   * **/
  pauseAll: function() {
    var self = this;
    self.playlist.forEach(function(song, index) {
      self.pauser(index);
    });
    //Or simply:
    //self.playlist.forEach(function(song) {
    //  song.howl.pause();
    //});

    // Show the play button.
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';

  },

  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play: function(index) {
    var self = this;
    var sound;

    index = typeof index === 'number' ? index : self.index;
    var data = self.playlist[index];

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
          self.playlist[trackIdx].howl.play();

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

    // Begin playing the sound.
    //sound.play();

    // Update the track display.
    //track.innerHTML = (index + 1) + '. ' + data.title;

    // Show the pause button.
    if (sound.state() === 'loaded') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
    } else {
      loading.style.display = 'block';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
    }

    // Keep track of the index we are currently playing.
    self.index = index;
  },

  pauser: function(index) {
    var self = this;
    // Get the Howl we want to manipulate.
    var sound = self.playlist[index].howl;

    // Pause the sound.
    sound.pause();
  },

  /**
   * Pause the currently playing track.
   */
  pause: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Puase the sound.
    sound.pause();

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
        index = self.playlist.length - 1;
      }
    } else {
      index = self.index + 1;
      if (index >= self.playlist.length) {
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
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop();
    }

    // Reset progress.
    progress.style.width = '0%';

    //barFull.style.width = self.volumePercents[index];
    //sliderBtn.style.left = self.volumeSliderButtonLocs[index];

    // Play the new track.
    self.play(index);
  },

  volumeTrackAtIndex(val, index) {
    var self = this;
    var sound = self.playlist[index].howl;

    sound.volume(val);

    var barWidth = (val * 90) / 100;
    barFulls[index].style.width = (barWidth * 100) + '%';
    sliderBtns[index].style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';

    //self.volumePercents[index] = barFulls[index].style.width;
    //self.volumeSliderButtonLocs[index] = sliderBtns[index].style.left;


  },


  volumeTrack: function(val) {
    var self = this;

    var sound = self.playlist[self.index].howl;

    sound.volume(val);

    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';

    self.volumePercents[self.index] = barFull.style.width;
    self.volumeSliderButtonLocs[self.index] = sliderBtn.style.left;

  },


  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume: function(val) {
    var self = this;

    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  
  
  },

  seeker: function(per) {
    var self = this;

    for (var i = 0; i < self.playlist.length; i++) {
      // Get the Howl we want to manipulate.
      var sound = self.playlist[i].howl;

      // Convert the percent into a seek position.
      if (sound.playing()) {
        sound.seek(sound.duration() * per);
      }
    }
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
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function() {
    var self = this;
    var display = (playlist.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      playlist.style.display = display;
    }, (display === 'block') ? 0 : 500);
    playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume: function() {
    var self = this;
    //var display = (volume.style.display === 'block') ? 'none' : 'block';

    var displays = [];
    
    for (var i = 0; i < self.length; i++) {
      var d = (window["volume" + i].style.display === 'block') ? 'none' : 'block';
      displays.push(d);
    }

    setTimeout(function() {
      //volume.style.display = display;
      for (var i = 0; i < self.length; i++) {
        window["volume" + i].style.display = displays[i];
      }
    }, (displays[0] === 'block') ? 0 : 500);

    //volume.className = (display === 'block') ? 'volumey fadein' : 'volumey fadeout';

    for (var i = 0; i < self.length; i++) {
      window["volume" + i].className  = (displays[i] === 'block') ? 'volumey fadein' : 'volumey fadeout';
    }

  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
};

// Setup our new audio player class and pass it the playlist.
var player = new Player([
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
    title: 'Accompinament A', //'Running Out',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/3/30/Savannah_3._Accompaniment_A.mp3', //'running_out',
    howl: null
  },
  {
    title: 'Accompinament B',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/7/70/Savannah_4._Accompinament_B.mp3', 
    howl: null
  },
  {
    title: 'Accompinament C',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/b/b8/Savannah_5._Accompinament_C.mp3', 
    howl: null
  },
  {
    title: 'Melody',
    file: 'https://static.wikia.nocookie.net/littlebigplanet/images/f/f6/Savannah_6._Melody.mp3', 
    howl: null
  }

], "Savannah");

// Bind our player controls.
playBtn.addEventListener('click', function() {
  //player.play();
  player.playAll();
});
pauseBtn.addEventListener('click', function() {
  player.pauseAll();
});
//prevBtn.addEventListener('click', function() {
//  player.skip('prev');
//});
//nextBtn.addEventListener('click', function() {
//  player.skip('next');
//});
waveform.addEventListener('click', function(event) {
  player.seeker(event.clientX / window.innerWidth);
});
//playlistBtn.addEventListener('click', function() {
//  player.togglePlaylist();
//});
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
