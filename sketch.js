/*
- Quantize to tuning systems
- Randomize duration of each pitch
  - Instead of random, play with the beat
- Try non-uniform pitch distributions
- Try simultaneous pitches
  - Occasional link-ups 
- Gradually expanding pitch range -- start with narrow range!
- alternate between Perlin doublingRatio and perfect octave doubling
*/

/*
- spring / bouncing ball that free-falls at end
- keyboard controls!
- fast subdivisions (1/30th of a second) but grouped rhythms
- Ornaments

CLASS IDEAS
- stopwatch
- Tempo
  - accelerate
  - double / other ratios


PARAMETERS TO PLAY WITH
- pitch
- tempo
  - extremes in range
  - fixed tempos
- X


METHODS
- almostOctave() returns boolean






BIG PICTURE
- my neume piece?
- put parameters on screen for easy access/remembering and to spark GUI ideas
- add sample pieces to alexyuwen.com
  - consider "Projects" section with tabs, just like "About" section
- add second of silence at beginning and end of recording
*/


/*



GLOBAL VARIABLES



*/

let canvas;
let bassFreq = 0;
let x = 0;
let period = 1.5; // measured in frames
let bass, osc2;
let recorder;
let soundFile;
let i = 0; // almost like "framesSinceLastNote" but logic would need to be cleaned up
let state = 0;
let hasRecordingStarted = false;

/*



MAIN FUNCTIONS



*/

function setup() {
  getAudioContext().suspend();
  canvas = createCanvas(1000, 500);
  frameRate(60);
  canvas.mousePressed(startRecording);

  // Create Oscillators
  bass = new p5.Oscillator(0.000001, "sawtooth");
  bass.amp(1);
  bass.start();
  
  osc2 = new p5.Oscillator(0.000001, "sawtooth");
  osc2.amp(0.3);
  osc2.start();

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
}

function draw() {
  background(0);

  if (!hasRecordingStarted) {
    return;
  }

  if (period < 5.2) {
    period += 0.004 * (5.2 - period);
  }
  print(period);

  if (i == round(period) || i == round(period) + 1) { // if period were decreasing, then also check if i == round(period) + 1
    // Randomize pitch
    bassFreq = roundToNearestMultiple(random(66, 100), 2);
    if (random() > 0.05) {
      bass.amp(1);
      bass.freq(bassFreq);
    } else {
      if (random() > 1) {
        bass.amp(0);
      }
    }
    
    if (random() > 0.0) {
      osc2.amp(0.2);
      let doublingRatio = map(noise(x), 0, 1, 1, 4);
      let freq2 = double(bass, bassFreq, doublingRatio, osc2);
      // print("bassFreq: ", bassFreq, "\t\t  freq2: ", freq2);
    } else {
      if (random() > 0.0) {
        osc2.amp(0);
      }
    }
    
    x += 0.005;
    i = 0;
  } else {
    i += 1;
  }
  // TODO
  // IDEAS
  /*
  - Repeat section, from beginning to 5.8 fps
  - Set starting frequency of Perlin sequence
    - 
  */
}

/*



HELPER FUNCTIONS



*/

// HELPER FUNCTIONS GO HERE
//
//
//
//
//

/*



MATH FUNCTIONS



*/

function roundToNearestMultiple(num, base) {
  return base * round(num / base);
}

function double(osc, freq, r, osc2) {
  osc2.setType(osc.getType());
  osc2.amp(osc.getAmp());
  let freq2 = freq * (2 ** r);
  osc2.freq(freq2);
  return freq2;
}

function applyConstantAccelerationToInverse(inverseVariable, r) {
  let delta = period - (1 / ((1 / period) + r));
  return inverseVariable + delta;
}

/*



RECORDING FUNCTIONS



*/

function startRecording() {
  // Start AudioContext
  userStartAudio();

  if (state === 0) {
    // Record to p5.SoundFile
    recorder.record(soundFile);
    hasRecordingStarted = true;
    state++;
  }
  else if (state === 1) {
    // Stop recording
    recorder.stop();
    state++;
  }
  else if (state === 2) {
    // Save recording
    save(soundFile, 'sounds.wav');
    state++;
  }
  else if (state === 3) {
    // Stop oscillators
    bass.stop();
    osc2.stop();
  }
}