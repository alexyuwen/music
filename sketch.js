/*
- Quantize to tuning systems
- Randomize duration of each pitch
  - Instead of random, play with the beat
- Try non-uniform pitch distributions
- Try simultaneous pitches
  - Occasional link-ups 
- Gradually expanding pitch range -- start with narrow range!
*/

/*
- spring / bouncing ball that free-falls at end
- keyboard controls!
- fast subdivisions (1/30th of a second) but grouped rhythms
- Ornaments
- my neume piece?


CLASS IDEAS
- stopwatch
- Tempo
  - accelerate
  - double / other ratios
*/

// TODO: alternate between Perlin doublingRatio and perfect octave doubling

// TODO: try accelerating parameter such as speed
// TODO: accelerate towards the octave!

let canvas;
let bassFreq = 0;
let x = 0;
let period = 30; // measured in frames
let bass, osc2;
let recorder;
let soundFile;
let i = 0;
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
  osc2.start();

  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
}

function draw() {
  background(0);

  if (!hasRecordingStarted) {
    return;
  }

  // Accelerate inverse of period
  period = applyConstantAccelerationToInverse(period, -(1 / getTargetFrameRate()) / 120);
  // print("i: ", i, "period: ", round(period), period);
  if (i == round(period) || i == round(period) + 1) {    
    // Randomize pitch
    bassFreq = roundToNearestMultiple(random(40, 140), 1);
    bass.freq(bassFreq);
    
    // Perlin doubling ratio
    let doublingRatio = map(noise(x), 0, 1, 1, 4);
    let freq2 = double(bass, bassFreq, doublingRatio, osc2);
    // print("bassFreq: ", bassFreq, "\t\t  freq2: ", freq2);
    
    x += 0.01;
    i = 0;
  } else {
    i += 1;
  }
}

/*



HELPER FUNCTIONS



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