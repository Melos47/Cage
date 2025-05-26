// let serial;
// let latestData = "waiting for data";
// let data = []; //the list of data from arduino

// let xval = 0; //x axis of joystick
// let yval = 0;//y axis of joystick
let button = 0; //button state - change this to any digital input
let lastbutton = 0;
let pos;
let circlePosition;
//refresh page
let lastInteractionTime;
const timeoutDuration = 180000;//10 min = 600000ms 5min = 300000

let showNote = true; // 初始状态显示
let note0;
let note1;
let showNote1 = false;
let note1StartTime = 0;

let font1, font2, font3;

let clickedEyes = { eye1: false, eye2: false, eye3: false, eye4: false };
let allClicked = false;
let returnButtonX = 150; // 椭圆X位置
let returnButtonY = 120; // 椭圆Y位置
let returnButtonSize = 20; // 椭圆大小

let faceMesh;
let faces = [];
let options = { maxFaces: 10, refineLandmarks: false, flipped: true };

let capture;
let transCapture = 255;
let transCamGif1 = 255;
let transCamGif2 = 255;
let transCamGif3 = 255;
let transCamGif4 = 255;

let devices = [] // = [ "654ceab0efe9fa40c14e260353f50868d8cfd901993621afd82fb0041e342ae6"
// ];

let captures = [];
let capturesTint = 255;

let string1 = `
I thought that as long as I went to 
<the bottom right corner>,
no one would pay attention to me.`;
let string2 = `I am always
the most <restless> one.`;
let string3 = `We can never escape, 
We are all <being watched>.`;
let string4 = `People are watching. 
<I am you>, 
and you are me.`;
let string5 = `We will find you, 
wherever you are.`;

let currentCharacter1 = 0;
let currentCharacter2 = 0;
let currentCharacter3 = 0;
let currentCharacter4 = 0;
let currentCharacter5 = 0;

let peek;
let eye1;
let eye2;
let eye3;
let eye4;
let camera1;
let sphere1;
let sphere2;
let sphere3;
let tv1;
let tv2;
let tv3;
let glitch;
let glitch1;
let glitch2;
let glitch3;
let glitch4;
let glitch5;
let CamImage;
let CamGif1;
let CamGif2;
let CamGif3;
let CamGif4;
let exit;


//噪点
let whiteNoise = true;
let whiteNoiseMax = 100;
let whiteNoiseMin = 50;
let squareSize = 22;
let squareHeight = 2;

//gaze 1
let rows = 3; // Number of rows
let cols = 4; // Number of eyes in each row
let eyeSize = 80; // Size of the eyes
let eyeWhite;
let pupilSize = 90; // Size of the pupil
let iris;
let eyeSpacingX, eyeSpacingY;


let keepMenu = false;

let scene = 0;
let bgm;
let text1Audio;
let image1Audio;
let image2Audio;
let image3Audio;
let image4Audio;
let gaze1aAudio;

let audio1stop = false;
let image1stop = false;
let image2stop = false;
let image3stop = false;
let image4stop = false;
let gaze1astop = false;

//cursor imgs
let cursor0;
let cursorgoBack;
let cursorLeave;
let cursorContinue;
let cursorEscape;


//menupage 中文提示词
let textBegin
let textEye1Chi;
let textEye2Chi;
let textEye3Chi;
let textEye4Chi;

let longEye;
let xOrigin = 4100;
let yOrigin = 370;

function preload() {
  peek = loadImage("peek.png");
  eye1 = loadImage("eye 1.png");
  eye2 = loadImage("eye2.png");
  eye3 = loadImage("eye4.png");
  eye4 = loadImage("eye5.png");
  eyeWhite = loadImage("eye.png");
  iris = loadImage("iris.png");
  camera1 = loadImage("securityCam.gif");
  text1Audio = loadSound("peekinginto.wav");
  bgm = loadSound("audioAmbient.m4a");
  image1Audio = loadSound("image1.wav");
  sphere1 = loadImage("sphere2.gif");
  sphere2 = loadImage("sphere3.gif");

  sphere3 = loadImage("sphere1.gif");
  image2Audio = loadSound("image2.wav");
  image3Audio = loadSound("image3.wav");
  image4Audio = loadSound("image4.wav");

  cursor0 = loadImage("peeking.png");
  textEye1 = loadImage("eye1hint.png");
  textEye2 = loadImage("eye2hint.png");
  textEye3 = loadImage("eye3hint.png");
  textEye4 = loadImage("eye4hint.png");
  cursorgoBack = loadImage("goBack.png");
  cursorLeave = loadImage("textGaze1.png");
  longEye = loadImage("longEye.png");
  cursorContinue = loadImage("continue.png");
  gaze1aAudio = loadSound("gaze1a.wav");
  tv1 = loadImage("tv1.gif");
  tv2 = loadImage("tv2.gif");
  tv3 = loadImage("tv4.gif");
  glitch = loadImage("glitch.gif");
  glitch1 = loadImage("noise1.gif");
  glitch2 = loadImage("glitch5.gif");
  glitch3 = loadImage("glitch3.gif");
  glitch4 = loadImage("glitch2.gif");
  glitch5 = loadImage("glitch4.gif");
  CamImage = loadImage("camImage1.png");
  CamGif1 = loadImage("noise2.gif");
  CamGif2 = loadImage("noise3.gif");
  CamGif3 = loadImage("noise4.gif");
  CamGif4 = loadImage("noise5.gif");
  exit = loadImage("exit.png");
  cursorEscape = loadImage("escape.png");
  note0 = loadImage("popup1.png");
  note1 = loadImage("popup2.png"); 
  faceMesh = ml5.faceMesh(options);

  font1 = loadFont("Silkscreen-Regular.ttf");
  font2 = loadFont("CourierPrime-Regular.ttf");
  font3 = loadFont("NotoSansSC-VariableFont_wght.ttf");

  lastInteractionTime = millis(); 
  navigator.mediaDevices.enumerateDevices()
    .then(gotDevices);
}

function gotDevices(deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind == 'videoinput') {
      devices.push({
        label: deviceInfo.label,
        id: deviceInfo.deviceId
      });
    }
  }
  console.log(devices[i])
}

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight); //replace your other version of create canvas
  cnv.mousePressed(userStartAudio);

  setTimeout(() => {
    showNote = false;      // note消失
    showNote1 = true;      // note1出现
    note1StartTime = millis();

    setTimeout(() => {
      showNote1 = false;   // note1消失
      scene = 0;           // 进入主界面
    }, 7000); // note1 显示7秒
  }, 8000); // note 显示9秒


  let options = {
    video: {
      deviceId: devices[0].id
    }
  };
  
  capture = createCapture(options)
  capture.size(640, 480)
  capture.hide()
  console.log(capture)

  // 默认使用第一个摄像头
  // if (captures.length > 0) {
  //   capture = captures[0];
  // }

if (capture) {
  faceMesh.detectStart(capture, gotFaces);
}

  circlePosition = createVector(width / 2, height / 2);
  imageMode(CENTER);
  textAlign(CENTER);

  textFont(font1);
  textSize(28);

  bgm.loop();
  eyeSpacingX = width / cols; // Calculate horizontal spacing between eyes
  eyeSpacingY = height / rows; // Calculate vertical spacing between eyes

  containerX = 100;
  containerY = 100;
  containerWidth = 500;
  containerHeight = 300;
}

function mousePressed() {
  lastInteractionTime = millis(); // 记录交互时间
}

function draw() {
  background(0,30)
  xval = mouseX;
  yval = mouseY;
  xpos = mouseX;
  ypos = mouseY;
  button = int(mouseIsPressed);
  //console.log(button);
  noCursor();
  //噪点
  squareSize = random(7, 25);

  if (whiteNoise) {
    push();
    noStroke();
    fill(random(whiteNoiseMin, whiteNoiseMax));
    rect(random(0, width), random(0, height), squareSize, squareHeight);
    fill(random(whiteNoiseMin, whiteNoiseMax));
    rect(random(0, width), random(0, height), squareSize, squareHeight);
    fill(random(whiteNoiseMin, whiteNoiseMax));
    rect(random(0, width), random(0, height), squareSize, squareHeight);
    fill(random(whiteNoiseMin, whiteNoiseMax));
    rect(random(0, width), random(0, height), squareSize, squareHeight);
    fill(random(whiteNoiseMin, whiteNoiseMax));
    rect(random(0, width), random(0, height), squareSize, squareHeight);
    pop();
  }
  transCapture = map(xpos, width, width / 2.5, 0, 255);
  transCamGif1 = map(xpos, width, width / 2.5, 0, 255);
  transCamGif2 = map(xpos, width, width / 2.5, 10, 255);
  transCamGif3 = map(xpos, width / 2, width, 10, 255);
  transCamGif4 = map(xpos, width, width / 2.5, 10, 255);

  if (showNote) {
    image(note0, width / 2, height / 2, note0.width / 1.5, note0.height / 1.5);
  } else {
    // 进入主界面逻辑
    if (showNote1) {
      image(note1, width / 2, height / 2, note1.width / 1.5, note1.height / 1.5);
    }else  if(scene == 0) {
      beginning();
    } else if (scene == 1) {
    showMenu();
  } else if (scene == 2) {
    gaze1();
  } else if (scene == 3) {
    gaze2();
  } else if (scene == 4) {
    gaze3();
  } else if (scene == 5) {
    gaze4();
  } else if (scene == 6) {
    gaze1A();
  } else if (scene == 7) {
    drawEnd1();
  } else if (scene == 8) {
    gaze2A();
  } else if (scene == 9) {
    gaze2B();
  } else if (scene == 10) {
    gaze3A();
  }
  noCursor();
  }
 

  checkInactivity()
}

function checkInactivity() {
  if (millis() - lastInteractionTime > timeoutDuration) {
    location.reload(); // 5分钟无操作后刷新页面
  }
}
function mouseMoved() {
  lastInteractionTime = millis(); // 记录鼠标移动时间
}

function keyPressed() {
  lastInteractionTime = millis(); // 记录键盘按键时间
}

function beginning() {
  background(0,30);
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);

  currentCharacter1 = 0;
  currentCharacter2 = 0;
  currentCharacter3 = 0;
  currentCharacter4 = 0;
  currentCharacter5 = 0;

  // 重置音频状态
  audio1stop = false;
  image1stop = false;
  image2stop = false;
  image3stop = false;
  image4stop = false;
  gaze1astop = false;

  // 确保所有音频停止播放（避免遗留声音）
  text1Audio.stop();

  image1Audio.stop();
  image2Audio.stop();
  image3Audio.stop();
  image4Audio.stop();
  gaze1aAudio.stop();

  //print(ypos);

  image(peek, width / 2, height / 2, peek.width / 2, peek.height / 2);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  if (
    xpos > width / 2 - 50 &&
    xpos < width / 2 + 50 &&
    ypos > height / 2 - 80 &&
    ypos < height / 2 + 90
  ) {
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    noCursor();
    
    image(
      cursor0,
      mouseX + 100,
      mouseY + 45,
      cursor0.width / 3,
      cursor0.height / 3
    );
    push();
    fill(180);
    textFont(font3);
    textSize(20);
    textAlign(CENTER);
    text("要窥视吗?", width/2, height/6);
    pop();

    //text("Peeking into?", width/2, height/2 +300);

    if (text1Audio.isPlaying() == false) {
      // .isPlaying() returns a boolean
      if (audio1stop == false) {
        text1Audio.play();
        text1Audio.onended(stop1);
      }
    }

    if (lastbutton != button) {
      //if lastbutton doesnot equal button

      if (button == 1) {
        keepMenu = !keepMenu;
      }
    } else {
      noCursor();
    }
  }
  lastbutton = button;
  noCursor();
  if (keepMenu == true) {
    scene = 1;
  }
}

function showMenu() {
  noCursor();
  background(0, 30);
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  triangle(
    width / 4.5 - 90,
    height / 2.2 + 130,
    width / 4.5 - 90,
    height / 2.2 + 115,
    width / 4.5 - 75,
    height / 2.2 + 122.5
  );
  image(eye1, width / 4.6, height / 2.2, eye1.width / 1.7, eye1.height / 1.7);
  image(eye2, width / 2.45, height / 2.2, eye2.width / 1.9, eye2.height / 1.9);
  image(eye3, width / 1.65, height / 2.2, eye3.width / 1.7, eye3.height / 1.7);
  image(eye4, width / 1.3, height / 2.2, eye4.width / 1.7, eye4.height / 1.7);

  let currentString1 = string1.substring(0, currentCharacter1);
  let currentString2 = string2.substring(0, currentCharacter2);
  let currentString3 = string3.substring(0, currentCharacter3);
  let currentString4 = string4.substring(0, currentCharacter4);

  noCursor();

  //选择眼睛choose the EYE
  //eye1

  if (
    xpos > width / 4.6 - 80 &&
    xpos < width / 4.6 + 80 &&
    ypos > height / 2.2 - 80 &&
    ypos < height / 2.2 + 80
  ) {
    fill(255, 0, 0);
    triangle(
      width / 4.5 - 90,
      height / 2.2 + 130,
      width / 4.5 - 90,
      height / 2.2 + 115,
      width / 4.5 - 75,
      height / 2.2 + 122.5
    );
    push();
    fill(190)
    textFont(font2);
    textSize(21);
    textAlign(LEFT)
    text("hint: the <bottom right cornor>", width / 4.5 - 50, height / 2.2 + 130);
    pop();

    push();
    fill(180);
    textFont(font3);
    textSize(20);
    textAlign(CENTER);
    text("我以为到了<最右边的角落>就不会有人注意到我。", width/2, height/6);
    pop();

    noCursor();
    //image(textEye1, width/2, height/2+240, textEye1.width/2.5, textEye1.height/2.5);
    push();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    text(currentString1, width / 2, height / 2 + 160);
    pop();

    currentCharacter1 += 1;

    if (image1Audio.isPlaying() == false) {
      if (image1stop == false) {
        image1Audio.play();
        image1Audio.onended(stop2);
      }
    }
    if (lastbutton != button) {
      if (button == 1) {
        scene = 2;
        clickedEyes.eye1 = true; // 记录 eye1 被点击
        checkAllClicked(); // 检查是否所有选项都被点击
      }
      lastbutton = button;
    }
  }

  //eye2
  else if (
    xpos > width / 2.4 - 80 &&
    xpos < width / 2.4 + 80 &&
    ypos > height / 2.2 - 80 &&
    ypos < height / 2.2 + 80
  ) {
    fill(255, 0, 0);
    triangle(
      width / 4.5 - 90,
      height / 2.2 + 130,
      width / 4.5 - 90,
      height / 2.2 + 115,
      width / 4.5 - 75,
      height / 2.2 + 122.5
    );
    push();
    fill(190)
    textFont(font2);
    textSize(21);
    textAlign(LEFT)
    text("hint: the most <restless> one", width / 4.5 - 50, height / 2.2 + 130);
    pop();
    push();
    fill(180);
    textFont(font3);
    textSize(20);
    textAlign(CENTER);
    text("我永远是<最动荡不安>的那个。", width/2, height/6);
    pop();

    noCursor();
    push();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    text(currentString2, width / 2, height / 2 + 200);
    pop();
    currentCharacter2 += 0.7;

    //image(textEye2, width/2, height/2+250,textEye2.width/2.5, textEye2.height/2.5);
    if (image2Audio.isPlaying() == false) {
      if (image2stop == false) {
        image2Audio.play();
        image2Audio.onended(stop3);
      }
    }
    if (lastbutton != button) {
      if (button == 1) {
        scene = 3;
        clickedEyes.eye2 = true;
        checkAllClicked();
      }
      lastbutton = button;
    }
  }

  //eye3
  else if (
    xpos > width / 1.65 - 80 &&
    xpos < width / 1.65 + 80 &&
    ypos > height / 2.2 - 80 &&
    ypos < height / 2.2 + 80
  ) {
 noCursor();
    push();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    text(currentString3, width / 2, height / 2 + 200);
    pop();

    push();
    fill(180);
    textFont(font3);
    textSize(20);
    textAlign(CENTER);
    text("我们永远无法逃脱，我们都<被监视着>。", width/2, height/6);

    pop();
    currentCharacter3 += 0.8;
    //image(textEye3, width/2, height/2+250,textEye3.width/2.5, textEye3.height/2.5);
    if (image4Audio.isPlaying() == false) {
      if (image4stop == false) {
        image4Audio.play();
        image4Audio.onended(stop5);
      }
    }
    if (lastbutton != button) {
      if (button == 1) {
        scene = 4;
        clickedEyes.eye3 = true;
        checkAllClicked();
      }
      lastbutton = button;
    }
  } else if (
    xpos > width / 1.3 - 80 &&
    xpos < width / 1.3 + 80 &&
    ypos > height / 2.2 - 80 &&
    ypos < height / 2.2 + 80
  ) {
    noCursor();

    push();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    textSize(30)
    text(currentString4, width / 2, height / 2 + 200);
    pop();
    push();
    fill(180);
    textFont(font3);
    textSize(20);
    textAlign(CENTER);
    text("人们在看我们，<我就是你>，你就是我。", width/2, height/6);
    pop();
    currentCharacter4 += 0.7;

    if (image3Audio.isPlaying() == false) {
      if (image3stop == false) {
        image3Audio.play();
        image3Audio.onended(stop4);
      }
    }
    if (lastbutton != button) {
      if (button == 1) {
        scene = 5;
        clickedEyes.eye4 = true;
        checkAllClicked();
      }

      lastbutton = button;
    }
  }
  //ellipse(xpos, ypos, 20);
  noCursor();

  if (allClicked) {
    fill(255, 0, 0);
    image(exit, 150, 120, exit.width/2, exit.height/2);

    // 检测鼠标是否在椭圆内

    if (
      xpos > returnButtonX - 30 &&
      xpos < returnButtonX + 30 &&
      ypos > returnButtonY - 30 &&
      ypos < returnButtonY + 30
    ) {
      image(cursorEscape, mouseX + 75,
      mouseY + 25,
      cursorEscape.width,
      cursorEscape.height);
      
      noCursor();
      fill(255, 0, 0);
      ellipse(circlePosition.x, circlePosition.y, 30);
      strokeWeight(1);

      if (button == 1) {
        allClicked = false; // 重置状态
        clickedEyes = { eye1: false, eye2: false, eye3: false, eye4: false }; // 重置点击记录
        restartGame();
    }

    }
  }
}
// function keyPressed(){
//   if (
//       xpos > returnButtonX - 30 &&
//       xpos < returnButtonX + 30 &&
//       ypos > returnButtonY - 30 &&
//       ypos < returnButtonY + 30
//     ) {
// if(key == 'e'){
//   restartGame();
// }
//   }
// }

function restartGame(){
  window.location.reload();
}

function checkAllClicked() {
  if (
    clickedEyes.eye1 &&
    clickedEyes.eye2 &&
    clickedEyes.eye3 &&
    clickedEyes.eye4
  ) {
    allClicked = true;
  }
}

function gaze1() {
  background(0,30);
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let eyeX = col * eyeSpacingX + eyeSpacingX / 2; // 3X position of each eye
      let eyeY = row * eyeSpacingY + eyeSpacingY / 2; // Y 3osition of each eye

      image(eyeWhite, eyeX, eyeY, eyeWhite.width / 3.5, eyeWhite.height / 3.5);

      // Calculate the angle of the mouse relative to the eye
      let angle = atan2(ypos - eyeY, xpos - eyeX);

      // Calculate the pupil position
      let pupilX = eyeX + cos(angle) * (eyeSize / 5);
      let pupilY = eyeY + sin(angle) * (eyeSize / 5);

      // Draw the pupil
      push();
      fill(0);
      noStroke();
      image(iris, pupilX, pupilY, iris.width / 2.7, iris.height / 2.7);
      pop();
    }
  }
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);

  drawReturnButton();
  noCursor();
}

function drawReturnButton() {
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);
  if (
    xpos > width - 100 &&
    xpos < width + 100 &&
    ypos > height - 100 &&
    ypos < height + 100
  ) {
    noCursor();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    strokeWeight(1);
    image(
      cursorLeave,
      mouseX - 70,
      mouseY - 35,
      cursorLeave.width / 2.2,
      cursorLeave.height / 2.2
    );

    if (lastbutton != button) {
      if (button == 1) {
        scene = 6;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);
  noCursor();
}

function gaze1A() {
  background(0);
  noCursor();
  fill(255, 0, 0);
  ellipse(width - 80, height / 2, 40);

  strokeWeight(1);

  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  let currentString5 = string5.substring(0, currentCharacter5);
  

  if (
    mouseX > width - 100 &&
    mouseX < width - 40 &&
    mouseY > height / 2 - 100 &&
    mouseY < height / 2 + 20
  ) {
    noCursor();
    fill(60);
    strokeWeight(1);
    ellipse(circlePosition.x, circlePosition.y, 23);
    // Code to run if the mouse is on the right.
    if (xOrigin <= -1700) {
      xOrigin = -1700;
    } else {
      xOrigin = xOrigin - random(6, 7);
    }
  }
  if (
    mouseX > 0 &&
    mouseX < 50 &&
    mouseY > height / 2 - 100 &&
    mouseY < height / 2 + 20
  ) {
    noCursor();
    fill(255, 0, 0);
    strokeWeight(1);
    ellipse(circlePosition.x, circlePosition.y, 30);
    // Code to run if the mouse is on the left.
    if (xOrigin >= 3700) {
      xOrigin = 3700;
    } else {
      xOrigin = xOrigin + random(6, 7);
    }
  }

  image(longEye, xOrigin, yOrigin, longEye.width / 3.2, longEye.height / 3.2);

  if (
    xOrigin == -1700 &&
    mouseX > width - 100 &&
    mouseY > height / 2 - 100 &&
    mouseY < height / 2 + 20
  ) {
    // push();

    noCursor();
    fill(255, 0, 0);

    text(currentString5, width / 2, height / 2 - 80);
    // pop();
    currentCharacter5 += 0.7;

    push();
    fill(180);
    textFont(font3);
    textSize(20);
    textAlign(CENTER);
    text("我们会找到你的，不论你身在何处。", width/2, height/6);
    pop();

    if (gaze1aAudio.isPlaying() == false) {
      // .isPlaying() returns a boolean
      if (gaze1astop == false) {
        gaze1aAudio.play();
        gaze1aAudio.onended(stop6);
      }
    }

    if (gaze1astop == true) {
      noCursor();
      fill(255, 0, 0);
      ellipse(circlePosition.x, circlePosition.y, 30);

      image(
        cursorContinue,
        mouseX - 70,
        mouseY - 25,
        cursorContinue.width / 1.2,
        cursorContinue.height / 1.2
      );
    }
    if (lastbutton != button) {
      if (button == 1) {
        scene = 1;
        xOrigin = 3900;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);
  noCursor();
}

function gaze2() {
  background(0, 30);
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.01);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  image(sphere1, width / 2, height / 2, sphere1.width / 1.8, sphere1.height / 1.8);
  image(sphere2, width / 4, height / 2, sphere2.width / 2, sphere2.height / 2);
  image(
    sphere3,
    width / 1.33,
    height / 2,
    sphere3.width / 1.6,
    sphere3.height / 1.6
  );
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);
  // noCursor();

  //ellipse(xpos, ypos, 20);
  gaze2Return();
}

function gaze2Return() {
  // fill(255);
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  if (
    xpos > width / 1.33 - 50 &&
    xpos < width / 1.33 + 50 &&
    ypos > height / 2 - 50 &&
    ypos < height / 2 + 50
  ) {
    noCursor();
    fill(255, 0, 0);
    strokeWeight(1);
    ellipse(circlePosition.x, circlePosition.y, 30);
    if (lastbutton != button) {
      if (button == 1) {
        scene = 8;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(xpos, ypos, 20);
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // strokeWeight(1);
  // fill(150);
  noCursor();
}

function gaze2A() {
  background(0, 30);
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  image(tv1, width / 2, height / 2, tv1.width / 1.8, tv1.height / 1.8);
  image(tv2, width / 4.2, height / 2, tv2.width / 1.7, tv2.height / 1.7);
  image(tv3, width / 1.3, height / 2, tv3.width / 1.7, tv3.height / 1.7);

  if (
    xpos > width / 2 - 90 &&
    xpos < width / 2 + 90 &&
    ypos > height / 2 - 70 &&
    ypos < height / 2 + 70
  ) {
    noCursor();
    fill(255, 0, 0);
    strokeWeight(1);
    ellipse(circlePosition.x, circlePosition.y, 30);
    if (lastbutton != button) {
      if (button == 1) {
        scene = 9;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // strokeWeight(1);
  // fill(150);
  noCursor();
}

function gaze2B() {
  background(0, 30);
  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  //left to right, top to buttom
  image(
    glitch3,
    width / 3.3,
    height / 1.5,
    glitch3.width / 1.6,
    glitch3.width/1.3
  );
  image(
    glitch4,
    width / 2,
    height / 1.5,
    glitch4.width / 2.2,
    glitch4.height / 2.2
  );
  image(
    glitch5,
    width / 1.44,
    height / 1.5,
    glitch5.width / 1.5,
    glitch5.height / 1.05
  );

  image(
    glitch,
    width / 3.3,
    height / 3.1,
    glitch.width / 2,
    glitch.height / 2.58
  );
  image(
    glitch1,
    width / 2,
    height / 3.1,
    glitch1.width / 2.2,
    glitch1.height / 2.2
  );
  image(
    glitch2,
    width / 1.44,
    height / 3.1,
    glitch2.width / 1.7,
    glitch2.height / 1.01
  );

  if (
    xpos > width / 3.3 - 90 &&
    xpos < width / 3.3 + 90 &&
    ypos > height / 3.1 - 90 &&
    ypos < height / 3.1 + 90
  ) {
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    noCursor();

    image(
      cursorgoBack,
      mouseX + 105,
      mouseY + 35,
      cursorgoBack.width / 2,
      cursorgoBack.height / 2
    );

    if (lastbutton != button) {
      if (button == 1) {
        scene = 0;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);
  noCursor();
}

function gaze3() {
  background(0, 30);
 let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);
  noCursor();
 
  image(
    camera1,
    width / 2,
    height / 2,
    camera1.width / 1.2,
    camera1.height / 1.2
  );
  

  if (
    xpos > width / 1.7 - 120 &&
    xpos < width / 1.7 + 120 &&
    ypos > height / 1.5 - 100 &&
    ypos < height / 1.5 + 100
  ) {
    noCursor();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);

    if (lastbutton != button) {
      if (button == 1) {
        scene = 10;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);
  noCursor();
}
function gaze3A() {
  background(0, 30);

  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  image(
    CamGif1,
    width / 2 - 125,
    height / 2 - 80,
    CamGif1.width / 1.99,
    CamGif1.height / 2.34
  );
  image(
    CamGif2,
    width / 2 + 120,
    height / 2 - 80,
    CamGif2.width / 1.29,
    CamGif2.height / 1.6
  );
  image(
    CamGif3,
    width / 2 + 120,
    height / 2 + 65,
    CamGif3.width / 2,
    CamGif3.height / 1.93
  );
  image(
    CamGif4,
    width / 2 - 125,
    height / 2 + 65,
    CamGif4.width / 2,
    CamGif4.height / 1.9
  );

  tint(transCamGif1);
  tint(transCamGif2);
  tint(transCamGif3);
  tint(transCamGif4);

  if (
    xpos > width / 2 - 100 &&
    xpos < width / 2 + 300 &&
    ypos > height / 2 - 200 &&
    ypos < height / 2 + 200
  ) {
    noCursor();
    image(
      CamImage,
      width / 2,
      height / 2 - 11,
      CamImage.width * 1.02,
      CamImage.height * 1.09
    );
  }

  if (
    xpos > width/2- 400 &&
    xpos < width/2 - 180 &&
    ypos > height / 2 - 100 &&
    ypos < height / 2 + 100
  ) {
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);
    if (lastbutton != button) {
      if (button == 1) {
        scene = 1;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }

  // ellipse(circlePosition.x, circlePosition.y, 23);
  // fill(150);
  // strokeWeight(1);
  noCursor();
}

function gaze4() {
  background(0, 30);

  noCursor();
  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);

  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  // 使用 tint 和 flip 水平翻转摄像头画面

  pixelatedFace();

  if (
    xpos > width / 2 - 200 &&
    xpos < width / 2 + 200 &&
    ypos > height / 2 - 100 &&
    ypos < height / 2 + 100
  ) {
    noCursor();
    fill(255, 0, 0);
    ellipse(circlePosition.x, circlePosition.y, 30);

    if (lastbutton != button) {
      if (button == 1) {
        scene = 7;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  // ellipse(circlePosition.x, circlePosition.y, 20);
  // fill(150)
  // strokeWeight(1)
  noCursor();
}
function pixelatedFace() {
  background(0);
  //image(capture, 0, 0, width, height)

  tint(transCapture);
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, width / 2, height / 2);
  pop();

  // 使用 faceMesh 进行面部处理，并应用像素化效果
  if (capture.pixels.length > 0) {
    const stepSize = 10; // 像素化步长

    // 使用 POSTERIZE 进行色调控制
    filter(POSTERIZE, 2.4);

    // 遍历每个人脸，应用像素化效果
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];

      // 随机化人脸的开始位置
      let startY = floor(face.box.yMin + random(-3, 5));
      let startX = floor(face.box.xMin);

      for (let y = startY; y < face.box.yMax; y += stepSize) {
        for (let x = startX; x < face.box.xMax; x += stepSize) {
          let index = floor((capture.width - x + y * capture.width) * 4);
          const r = capture.pixels[index + 0];
          const g = capture.pixels[index + 1];
          const b = capture.pixels[index + 2];

          // 计算当前像素的亮度
          const brightness = (r + g + b) / 3;
          const squareSize = map(brightness, 0, 255, 0, stepSize * 2);

          push();

          translate(
            width / 2 - capture.width / 2,
            height / 2 - capture.height / 2
          );
          noStroke();
          fill(random(y), random(r), random(r), transCapture); // 用随机颜色填充像素块
          rectMode(CORNER);
          rect(x, y, squareSize, squareSize); // 绘制像素块

          pop();
        }
      }
    }
  }
}

function drawEnd1() {
  background(0, 20);
  noCursor();
  strokeWeight(1);

  let mousePos = createVector(mouseX, mouseY);
  circlePosition.lerp(mousePos, 0.1);
  fill(150);
  strokeWeight(1);
  ellipse(circlePosition.x, circlePosition.y, 23);

  if (capture) {
    capture.loadPixels();
    let stepSize = floor(map(mouseX, width / 2, width, 18, 30));

    push();
    translate(width, 0); // 把整个画面向右平移一个 canvas 的宽度
    scale(-1, 1); // 水平镜像翻转

    let offsetX = (width - capture.width) / 2; // 计算居中偏移
    let offsetY = (height - capture.height) / 2;

    for (let y = 0; y < capture.height; y += stepSize) {
      for (let x = 0; x < capture.width; x += stepSize) {
        let index = (y * capture.width + x) * 4;

        if (capture.pixels.length > index) {
          let r = capture.pixels[index + 0];
          let g = capture.pixels[index + 1];
          let b = capture.pixels[index + 2];

          push();
          let brightness = (r + g + b) / 3;

          if (brightness > 140) {
            fill(255);
            noStroke();
          } else if (brightness > 130) {
            fill(100);
            noStroke();
          } else {
            fill(0);
            noStroke();
          }

              if (stepSize > 30)
    {fill(255, 0,0)
     noStroke()
            
          }
    
          rect(x + offsetX, y + offsetY, stepSize, stepSize); // 让画面居中

          pop();
        }
      }
    }
    pop(); // 结束翻转状态
  }

    strokeWeight(1);
    fill(150);
    ellipse(circlePosition.x, circlePosition.y, 23);
  

  if (
    xpos > width - 300 &&
    xpos < width  &&
    ypos > height / 2 - 100 &&
    ypos < height / 2 + 100
  ) {
    noCursor();
    fill(255, 0, 0);
    strokeWeight(1);
    ellipse(circlePosition.x, circlePosition.y, 30);

    if (lastbutton != button) {
      if (button == 1) {
        scene = 1;
      } else {
        noCursor();
      }
    }
    lastbutton = button;
  }
  noCursor();
}


function printDeviceIDs() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
    return;
  }

  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        console.log(
          device.kind + ": " + device.label + " id = " + device.deviceId
        );
      });
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function stop1() {
  audio1stop = true;
}
function stop2() {
  image1stop = true;
}
function stop3() {
  image2stop = true;
}
function stop4() {
  image3stop = true;
}

function stop5() {
  image4stop = true;
}
function stop6() {
  gaze1astop = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
