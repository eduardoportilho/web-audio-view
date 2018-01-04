

var WIDTH = 640;
var HEIGHT = 360;
var SMOOTHING = 0.92; // 0.8;
var FFT_SIZE = 256;  //2048;

let audio, context, analyser;
let isPlaying = false;

window.addEventListener('load', () => {
  audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.loop = true;
  audio.src = 'https://p.scdn.co/mp3-preview/59b4f6ba1341df234bf74e459ff1d467e2005f6b?cid=18fc7b00a64d447393f6ee0dd98a70be';

  context = new AudioContext();
  analyser = context.createAnalyser();

  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  
  document.querySelector('#play').addEventListener('click', play);
}, false);


function play() {
  if (isPlaying) {
    audio.pause();
  }
  else {
    audio.play();
  }
  isPlaying = !isPlaying;
  window.requestAnimationFrame(draw);
}

function draw() {
  analyser.smoothingTimeConstant = SMOOTHING;
  analyser.fftSize = FFT_SIZE;
  
  const freqs = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqs);

  
  var canvas = document.querySelector('canvas');
  var drawContext = canvas.getContext('2d');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  // Draw the frequency domain chart.
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var value = freqs[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/analyser.frequencyBinCount;
    var hue = i/analyser.frequencyBinCount * 360;
    drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    drawContext.fillRect(i * barWidth, offset, barWidth, height);
  }
  
  isPlaying && window.requestAnimationFrame(draw);
}