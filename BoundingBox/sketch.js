let faceMesh;
let video;
let faces = [];
let poses = [];
let bodyPose;
let connections;
let deviceIDs = [
  "68f51382736fedbb210984efedd896da8c40265d3513d791c052b1f9f3612ab7",
];

let options = { maxFaces: 10, refineLandmarks: false, flipHorizontal: true };

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
  // Load the bodyPose model
  bodyPose = ml5.bodyPose({ flipped: true });
}

function setup() {
  createCanvas(3840, 1080);
  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(1080, 720);
  video.hide();
  // Start detecting faces and poses from the webcam video
  faceMesh.detectStart(video, gotFaces);
  bodyPose.detectStart(video, gotPoses);
  frameRate(21);
}

function draw() {
  // Draw the webcam video
  clear();
  image(video, 0, 0, 3840, 1080);
  video.loadPixels();

  if (video.pixels.length > 0) {
    pixelatedBody();
  }

  // Draw faces and bounding box for faces
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(
      face.box.xMin * 3.55,
      face.box.yMin * 1.5,
      face.box.width * 3.55,
      face.box.height * 1.5
    );
  }

  // Draw body poses and bounding box for body
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    noFill();
    stroke(0, 0, 255);
    strokeWeight(2);
    rect(
      pose.box.xMin * 3.55,
      pose.box.yMin * 1.5,
      pose.box.width * 3.55,
      pose.box.height * 1.5
    );
    fill(0, 0, 255);
    rect(pose.box.xMin * 3.55, pose.box.yMin * 1.5 - 50, 90, 50);

    textAlign(TOP);
    textSize(40);
    fill(255);
    noStroke();
    text("null", pose.box.xMin * 3.55, pose.box.yMin * 1.5 - 20);
  }
}

// Function to apply pixelation to the body area
function pixelatedBody() {
  const stepSize = 10;

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

   for (let y = pose.box.yMin * 1.5; y < pose.box.yMax * 1.5; y += stepSize) {
      for (let x = pose.box.xMin * 3.55; x < pose.box.xMax * 3.55; x += stepSize) {
        let index = floor((x / 3.55) + (y / 1.5) * video.width) * 4;
        const r = video.pixels[index + 0];
        const g = video.pixels[index + 1];
        const b = video.pixels[index + 2];

        // Get the brightness of the current pixel by averaging the color values
        const brightness = (r + g + b) / 3;
        const squareSize = map(brightness, 0, 255, 0, stepSize * 2);

        noStroke();
        fill(random(190, 255), g, b);
        // Draw a rectangle using the color of the current pixel. The rectangle size is based on the brightness of pixel
        rect(x, y, stepSize, stepSize);
      }
    }
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  faces = results;
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  poses = results;
}

function keyPressed() {
  if (key == " ") {
    console.log(poses);
  }
}
