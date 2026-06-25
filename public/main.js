// module aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Events = Matter.Events,
  Composite = Matter.Composite;

// create an engine
let engine = Engine.create();

/* 定数と変数の定義 */
// 定数
const lineWidth = 20;
//const fieldCount = 3;
const ballCount = 60
const explosionTime = 400
const explosionCount = 2;
const goldenExplosionCount = 3;
const timer = 120;

// Paths
const basicImagePath = "images/";

const ssrbPath = basicImagePath + "ssrb";
const cursorPath = basicImagePath + "cursor.png";
const explosionGifPath = basicImagePath + "explosion.gif"

const clickSoundPath = 'clickSE';
const crap1Path = "crap1";
const crap2Path = "crap2";
const crap3Path = "crap3";
const endGongPath = "endgong";
const yeahPath = "yeah";
const ohFemalePath = "oh";
const ohMalePath = "oh2"
const countDownPath = "countdown";
const yellowScreamPath = "yellowscream";
const timerSePath = "timerSe";
const highScoreBgmPath = "happytime";
const lowScoreBgmPath = "pugtoosanpo";

// Arrays
const colors = ["gray", "white", "green", "purple", "orange"];

// Elements
const scoreElement = document.getElementById("score");
const chainElement = document.getElementById("chain");
const commentElement = document.getElementById("comment");
const explosionsElement = document.getElementById("explosions");
const allDeletedElement = document.getElementById("allDeleted");
const timerElement = document.getElementById("timer");
const countDownElement = document.getElementById("countDown");
const titleContainerElement = document.getElementById("titleContainer");
const startButtonElement = document.getElementById("startButton");
const howToPlayButtonElement = document.getElementById("howToPlayButton");
const resetButtonElement = document.getElementById("resetButton");
const resultContainerElement = document.getElementById("resultContainer");
const htpWrapperElement = document.getElementById("htpWrapper");
const bestScoreElement = document.getElementById("bestScore");
const lastScoreElement = document.getElementById("lastScore");
const bestChainElement = document.getElementById("bestChain");
const evaluateElement = document.getElementById("evaluate");
const evaluateCommentElement = document.getElementById("evaluateComment");
const resultSsrbtnElement = document.getElementById("resultSsrbtn");
const plusScoreElement = document.getElementById("plusScore");
const htpNextButtonElements = document.querySelectorAll('.nextButton');
const htpPrevButtonElements = document.querySelectorAll(".prevButton");


//変数
let width = window.innerWidth / 1960 * 1200;
let height = window.innerWidth / 2 - 120;

let x_rate = window.innerWidth / 1960;

let ballRad = 60 * x_rate;
let skeltonRad = 40 * x_rate;
let goldenRad = 90 * x_rate;
let explosionWidth = 180 * x_rate
let target_scale = 0.4 * x_rate

let selectedSsrbs = []
let targets = []
let fragDraggable = false
let fragClickable = true
let currentBallCount = ballCount
let score = 0
let allDeletedSsrbs = 0
let timeInterval = timer;
let gameEnd = false;
let bestChain = 0;
let bestScore = 0;


let currentPage = 1;
const numberOfPages = 9;

let musicOn = false;

const htpList = htpWrapperElement.querySelectorAll('.htpContainer')

const switchOnMusic = () => {
  document.getElementById('musicOffButton').classList.add('hidden');
  document.getElementById('musicOnButton').classList.remove('hidden');
  musicOn = true;
}

const switchOffMusic = () => {
  document.getElementById('musicOnButton').classList.add('hidden');
  document.getElementById('musicOffButton').classList.remove('hidden');
  musicOn = false;
}

window.addEventListener('resize', () => {
  width = window.innerWidth / 1960 * 1200;
  height = window.innerWidth / 2 - 120;
  x_rate = window.innerWidth / 1960;
  ballRad = 60 * x_rate;
  skeltonRad = 40 * x_rate;
  goldenRad = 90 * x_rate;
  explosionWidth = 150 * x_rate
  target_scale = 0.4 * x_rate

  render = Render.create({
    element: document.getElementById('canvas'),
    options: {
      wireframes: false,
      width: width,
      height: height,
      background: 'transparent',
      pixelRatio: 2,
      hosBounds: true,
    },
    engine: engine
  });

  document.getElementById('canvas').firstChild.remove()
})

const showHtpNextContent = () => {

  for (let i = 1; i <= numberOfPages; i++) {
    if(htpList[i - 1].classList.contains('visibleHtpContent') && i === currentPage) {
      htpList[i - 1].classList.remove('visibleHtpContent');
      if(i === numberOfPages) {
        htpList[0].classList.add('visibleHtpContent');
      } else {
        htpList[i].classList.add('visibleHtpContent');
      }
      currentPage = currentPage === numberOfPages ? 1 : currentPage + 1;

      break;
    }
  }
}
const showHtpPrevContent = () => {

  for (let i = 1; i <= numberOfPages; i++) {
    if(htpList[i - 1].classList.contains('visibleHtpContent') && i === currentPage) {
      htpList[i - 1].classList.remove('visibleHtpContent');
      if(i === 1) {
        htpList[numberOfPages - 1].classList.add('visibleHtpContent');
      } else {
        htpList[i - 2].classList.add('visibleHtpContent');
      }
      currentPage = currentPage === 1 ? numberOfPages : currentPage - 1;

      break;
    }
  }
}

for (let i = 0; i < htpNextButtonElements.length; i++) {
  htpNextButtonElements[i].addEventListener('click', showHtpNextContent);
}
for (let i = 0; i < htpPrevButtonElements.length; i++) {
  htpPrevButtonElements[i].addEventListener('click', showHtpPrevContent);
}
for (let i = 0; i < htpNextButtonElements.length; i++) {
  htpNextButtonElements[i].addEventListener('touchstart', showHtpNextContent);
}
for (let i = 0; i < htpPrevButtonElements.length; i++) {
  htpPrevButtonElements[i].addEventListener('touchstart', showHtpPrevContent);
}
/* 関数の定義 */
// ボールを作成する関数
const createBall = (x, y, rad, imageColor) => {
  let rand = Math.floor(Math.random() * 10);
  return Bodies.circle(x, y, rad, {
    label: "ball",
    render: {
      fillStyle: colors[(imageColor - 1) % 5],
      sprite: {
        texture: ssrbPath + "-" + imageColor + "-" + rand +  ".png",
        xScale: rad / 105,
        yScale: rad / 105
      }
    },
  });
}

// 透明SSRBを作成する関数
const createSkeltonBall = (x, y, rad) => {

  return Bodies.circle(x, y, rad, {
    label: "ball",
    render: {
      fillStyle: "transparent",
      sprite: {
        texture: ssrbPath + "-0-0.png",
        xScale: rad / 105,
        yScale: rad / 105
      }
    },
  });
}

// 金色SSRBを作成する関数
const createGoldenBall = (x, y, rad) => {

  return Bodies.circle(x, y, rad, {
    label: "goldenBall",
    render: {
      fillStyle: "gold",
      sprite: {
        texture: ssrbPath + "-101-0.png",
        xScale: rad / 105,
        yScale: rad / 105
      }
    },
  });
}

const createTarget = (x, y) => {
  return Bodies.circle(x, y, 30, {
    label: "target",
    isStatic: true,
    render: {
      sprite: {
        texture: cursorPath,
        xScale: target_scale,
        yScale: target_scale,
      },
      opacity: 0.7,
    },
    collisionFilter: {
      mask: 0,
    }
  })
}

const playMusic = (path) => {
  if (!musicOn) return
  const se = document.getElementById(path).cloneNode(true)
  document.body.appendChild(se);

  se.addEventListener('ended', () => {
    document.body.removeChild(se);
  })
  se.play().catch(error => {
    console.error("Error playing sound: ", error);
  });
}

const playBgm = (path) => {
  if (!musicOn) return
  const se = document.getElementById(path).cloneNode(true)
  se.classList.add('bgm');
  document.body.appendChild(se);

  se.addEventListener('ended', () => {
    document.body.removeChild(se);
  })
  se.play().catch(error => {
    console.error("Error playing sound: ", error);
  });
}

// create a renderer
let render = Render.create({
  element: document.getElementById('canvas'),
  options: {
    wireframes: false,
    width: width,
    height: height,
    background: 'transparent',
    pixelRatio: 2,
    hosBounds: true,
  },
  engine: engine
});

// 初期化処理の定義
const init = () => {
  let ground = Bodies.rectangle(
    width / 2,
    height + (lineWidth / 2),
    width + (lineWidth * 2),
    lineWidth,
    {
      isStatic: true,
      hasBounds:false,
      friction: 10
    });
  let leftWall = Bodies.rectangle(
    0 - (lineWidth / 2),
    height / 2,
    lineWidth,
    height,
    {
      isStatic: true,
      hasBounds:false,
      friction: 10
    });
  let rightWall = Bodies.rectangle(
    width + (lineWidth / 2),
    height / 2,
    lineWidth,
    height,
    {
      isStatic: true,
      hasBounds:false,
      friction: 10
    });


  Composite.add(engine.world, [ground, leftWall, rightWall]);

  for (let i = 0; i < ballCount; i++) {
    let randX = Math.floor(Math.random() * (width - 80)) + 40;
    let randY = Math.floor(Math.random() * (height - 120)) - 380;
    let rad = ballRad;

    let skeltonAppearRate = Math.ceil(Math.random() * 20);
    let goldenBallAppearRate = Math.ceil(Math.random() * 50);

    let ball = null;

    if (skeltonAppearRate === 20) {
      ball = createSkeltonBall(randX, randY, skeltonRad);
    } else if (goldenBallAppearRate === 50) {
      ball = createGoldenBall(randX, randY, goldenRad);
    } else {
      let imageColor = Math.ceil(Math.random() * 5);
      ball = createBall(randX, randY, rad, imageColor);
    }

    Composite.add(engine.world, ball);
  }

  scoreElement.innerHTML = score + "";

}
// run the renderer
Render.run(render);
// create runner
let runRunner = Runner.create();

// SSRBタイトル画像の初期処理
for (let i = 1; i <= 5; i++) {
  let imgRand1 = Math.floor(Math.random() * 8);

  let imgElement = document.createElement('img');
  imgElement.style.width = 100 / 6 + '%';
  if(imgRand1 === 0) {
    let imgRand2 = Math.floor(Math.random() * 2);
    if(imgRand2 === 0) {
      imgElement.src = basicImagePath + "ssrb-0-0.png";
    } else if(imgRand2 === 1) {
      imgElement.src = basicImagePath + "ssrb-0-10.png";
    }

  } else if(imgRand1 >= 1 && imgRand1 <= 5) {
    let imgRand2 = Math.floor(Math.random() * 20);
    imgElement.src = basicImagePath + "ssrb-" + imgRand1 + "-" + imgRand2 + ".png";

  } else if(imgRand1 === 6) {
    let imgRand2 = Math.floor(Math.random() * 2);
    if(imgRand2 === 0) {
      imgElement.src = basicImagePath + "ssrb-101-0.png";
    } else if(imgRand2 === 1) {
      imgElement.src = basicImagePath + "ssrb-101-10.png";
    }

  } else if(imgRand1 === 7) {
    imgElement.src = basicImagePath + "ssrb-100.png";
  }

  document.getElementById('images').appendChild(imgElement);
}

/*
*  ゲームのコントロール関数
*
* */
// ゲームを始める
const startGame = () => {
  while (document.querySelector('.bgm') !== null) {
    document.querySelector('.bgm').pause();
    document.querySelector('.bgm').remove();
  }

  playMusic(countDownPath);
  countDownElement.classList.remove('hidden');
  countDownElement.classList.add('visibleCountDown');

  let countDownNum = 3;
  const countDown = setInterval(function() {
    countDownNum--;
    countDownElement.innerHTML = countDownNum + "";

    if (countDownNum === 0) {
      clearInterval(countDown);
      countDownElement.classList.add('hidden');
      countDownElement.classList.remove('visibleCountDown');
      countDownElement.innerHTML = "3";
      titleContainerElement.classList.add('hidden');
    }
  }, 1000)

  setTimeout(function() {
    for (let i = 0; i < engine.world.bodies.length; i++) {
      let body = engine.world.bodies[i];

      Composite.clear(engine.world, body);
    }
    selectedSsrbs = []
    targets = []
    fragDraggable = false
    fragClickable = true
    currentBallCount = ballCount
    score = 0
    allDeletedSsrbs = 0
    timeInterval = timer;
    gameEnd = false;
    bestChain = 0;
    bestScore = 0;

    timerElement.innerHTML = timeInterval;
    timerElement.style.color = "black";

    scoreElement.innerHTML = "0";
    chainElement.innerHTML = '<span style="font-size: 3vw;">0</span>  HITS!';
    allDeletedElement.innerHTML = " x 0";
    startButtonElement.classList.add('hidden');
    howToPlayButtonElement.classList.add('hidden');
    resetButtonElement.classList.remove('hidden');
    resultContainerElement.classList.add('hidden');
    explosionsElement.classList.remove('hidden');

    init();

    startTimer();

    playMusic(ohFemalePath);

    const bgmRand = Math.floor(Math.random() * 5);

    playBgm('bgm' + bgmRand)

    // run the renderer
    Render.run(render);
    // run the engine
    Runner.run(runRunner, engine);
  }, 3200)

}

// SSRBをリロードする
const reloadGame = () => {
  for (let i = 0; i < engine.world.bodies.length; i++) {
    let body = engine.world.bodies[i];

    Composite.clear(engine.world, body);
  }
  selectedSsrbs = [];
  targets = [];
  timeInterval -= 5;
  init();

  gameEnd = false;
}

const displayHowToPlay = () => {
  htpWrapperElement.classList.add('visibleHtp');
  htpWrapperElement.classList.remove('htpHidden');
  htpWrapperElement.classList.remove('hiddenHtp');
}

const hideHowToPlay = () => {
  htpWrapperElement.classList.remove('visibleHtp');
  htpWrapperElement.classList.add('hiddenHtp');
}

//ゲームを停止する　本番では削除する
const stopGame = () => {

  // ターゲットカーソルを削除する
  while (true) {
    let targetFlag = false; // ターゲットカーソルが一つでもあればtrueにする
    for (let i = 0; i < engine.world.bodies.length; i++) {
      let body = engine.world.bodies[i];
      setTimeout(function() {
        if(body.label === "target") {
          targetFlag = true;
          Composite.remove(engine.world, body);
        }
      }, 5)

    }
    if (!targetFlag) {
      break; // ターゲットカーソルがなければwhileから抜け出す
    }
  }

  while (document.querySelector('.bgm') !== null) {
    document.querySelector('.bgm').pause();
    document.querySelector('.bgm').remove();
  }

  startButtonElement.classList.remove('hidden');
  howToPlayButtonElement.classList.remove('hidden');
  resetButtonElement.classList.add('hidden');
  resultContainerElement.classList.remove('hidden');
  bestScoreElement.innerHTML = bestScore.toLocaleString();
  lastScoreElement.innerHTML = score.toLocaleString();
  bestChainElement.innerHTML = bestChain + '';
  explosionsElement.classList.add('hidden');

  const ssrbtnElement = document.createElement("img")
  const randSsrbtn = Math.floor(Math.random() * 13);
  ssrbtnElement.src = basicImagePath + "ssrbtn" + randSsrbtn + ".png";
  ssrbtnElement.style.width = 90 + '%';
  if (resultSsrbtnElement.children.length > 0) {
    resultSsrbtnElement.removeChild(resultSsrbtnElement.children[0]);
  }
  resultSsrbtnElement.appendChild(ssrbtnElement);

  let evaluate = "";
  let evaluateComment = "";

  let path = ""

  if (score >= 1000000000 && bestChain >= 19) { // 10億
    path = highScoreBgmPath;
    evaluate = "SSS";
    evaluateComment = "おまえは今日からSSSRBだｗｗｗｗｗｗｗｗ";
    evaluateElement.classList.add('golden');
  } else if(score >= 400000000 && bestChain >= 18) { // 4億
    path = highScoreBgmPath;
    evaluate = "SS";
    evaluateComment = "おまえらすごすぎだろｗｗｗｗｗｗｗ";
    evaluateElement.classList.add('golden');
  } else if(score >= 50000000 && bestChain >= 15) { // 5千万
    path = highScoreBgmPath;
    evaluate = "S";
    evaluateComment = "すげー！おまえら成長したな・・・ｗｗｗｗｗﾅﾃﾞﾅﾃﾞ";
    evaluateElement.classList.add('golden');
  } else if (score >= 10000000 && bestChain >= 13) { //千万
    path = highScoreBgmPath;
    evaluate = "A";
    evaluateComment = "よく頑張ったなおまえらｗｗｗﾖｼﾖｼ";
    evaluateElement.classList.add('gaming');
  } else if (score >= 1000000 && bestChain >= 10) { // 百万
    path = lowScoreBgmPath;
    evaluate = "B";
    evaluateComment = "ちょっとはやるじゃんおまえらｗｗﾖｼﾖｼ";
    evaluateElement.style.color = "blue";
  } else if (score >= 100000 && bestChain >= 7) {  // 十万
    path = lowScoreBgmPath;
    evaluate = "C";
    evaluateComment = "まだまだだな！おまえらの成長に期待するかｗｗｗｗ";
    evaluateElement.style.color = "green";
  } else {
    path = lowScoreBgmPath;
    evaluate = "D";
    evaluateComment = "おまえらもうちょっとがんばれよｗｗｗ";
  }
  evaluateElement.innerHTML = evaluate;
  evaluateCommentElement.innerHTML = evaluateComment;

  playBgm(path);

  Runner.stop(runRunner);
  Render.stop(render);
  gameEnd = true;
}

/*
*　タイマー関数
*
* */
const startTimer = () => {
  const timer = setInterval(() => {
    timeInterval--;
    if (timeInterval < 10) {
      timerElement.style.color = "red";
    }
    timerElement.innerHTML = timeInterval;
    if(timeInterval <= 10 && timeInterval > 0) {
      playMusic(timerSePath);
    }
    if (timeInterval <= 0) {
      document.getElementById("timer").innerHTML = "0";
      playMusic(endGongPath);

      stopGame();
      clearInterval(timer);
    }
  }, 1000);

}


/*
* ここからクリック及びタッチイベント
*  */
// クリックしたときの処理
document.addEventListener("mousedown", function(event) {
  if (gameEnd) return;

  fragDraggable = true;

  if(fragClickable) {

    let rect = render.canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    for (let i = 0; i < engine.world.bodies.length; i++) {
      let body = engine.world.bodies[i];
      let ssrbX = body.position.x; // SSRBオブジェクトのx座標
      let ssrbY = body.position.y; // SSRBオブジェクトのｙ座標
      let rad = body.circleRadius; // SSRBオブジェクトの半径

      // SSRBオブジェクトとクリックした座標の距離を求める
      let distanceX = Math.abs(mouseX-ssrbX);
      let distanceY = Math.abs(mouseY-ssrbY);
      let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);

      // クリック位置がSSRBオブジェクトの内側の場合、SSRBオブジェクトをターゲットにする
      // 透明SSRBは選択できない
      if (
        rad >= distance
        && (body.label === "ball" || body.label === "goldenBall")
        && body.render.fillStyle !== "transparent"
      ) {
        let img = body.render.sprite.texture
        let imgArray = img.split(".")
        let imgPathArray = imgArray[0].split("-");

        if (Number(imgPathArray[2]) < 10) {

          body.render.sprite.texture = imgPathArray[0] + "-" + imgPathArray[1] + "-" + (Number(imgPathArray[2]) + 10) + ".png";

          let target = createTarget(ssrbX, ssrbY);
          // ターゲットを選択したときに鳴らすクリック音
          playMusic(clickSoundPath)
          // ターゲットオブジェクトを登録する
          const ssrbArray = [img, body];
          selectedSsrbs.push(ssrbArray);
          targets.push(target);
          Composite.add(engine.world, target);

        }
      }
    }
  }
})


// クリックを離したときの処理
document.addEventListener("mouseup", function() {
  if (gameEnd) return;

  fragDraggable = false;

  // SSRBの画像をもとの状態に戻す
  for (let i = 0; i < engine.world.bodies.length; i++) {
    let body = engine.world.bodies[i];
    if(body.label === "ball" || body.label === "goldenBall") {
      let img = body.render.sprite.texture
      let imgArray = img.split(".")
      let imgPathArray = imgArray[0].split("-");

      if (Number(imgPathArray[2]) >= 10) {
        for (let i = 0; i < selectedSsrbs.length; i++) {
          if (body.id === selectedSsrbs[i][1].id) {
            body.render.sprite.texture = selectedSsrbs[i][0];
            break;
          }
        }
      }
    }
  }

  // ターゲットカーソルを削除する
  while (true) {
    let targetFlag = false; // ターゲットカーソルが一つでもあればtrueにする
    for (let i = 0; i < engine.world.bodies.length; i++) {
      let body = engine.world.bodies[i];
      setTimeout(function() {
        if(body.label === "target") {
          targetFlag = true;
          Composite.remove(engine.world, body);
        }
      }, 5)

    }
    if (!targetFlag) {
      break; // ターゲットカーソルがなければwhileから抜け出す
    }
  }

  // 選択されたSSRBを削除する
  // 通常SSRBなら2つ以上選択されていること、金色SSRBなら3つ以上選択されていることが条件
  if (
    (selectedSsrbs.length >= explosionCount
    && targets.length >= explosionCount
    && selectedSsrbs[0][1].label === "ball")
  || (selectedSsrbs.length >= goldenExplosionCount
      && targets.length >= goldenExplosionCount
      && selectedSsrbs[0][1].label === "goldenBall"
    )
  ) {

    // イベント発生時間中はクリックイベントができないようにする
    fragClickable = false;

    let scoreBonus = Math.ceil(Math.exp(selectedSsrbs.length) * 100 / selectedSsrbs.length - Math.random() * 100);

    if (selectedSsrbs[0][1].label === "goldenBall") {
      scoreBonus = 9999999; //1千万 - 1
    }

    if(scoreBonus >= bestScore) {
      bestScore = scoreBonus;
    }

    score += scoreBonus;
    plusScoreElement.innerHTML = '+ ' + scoreBonus.toLocaleString();
    plusScoreElement.animate(
      {
        transform: [
          'translateY(0px)',
          'translateY(-10px)',
          ],
        opacity: [1, 0]
        },
      {
        duration: 1000,
        fill: 'forwards'
      }

      )
    scoreElement.innerHTML = '<span class="anime_text">' + score.toLocaleString() + "</span>";
    if (selectedSsrbs.length >= 7) {
      chainElement.innerHTML = '<span style="font-size: 4.2vw;" class="gaming anime_text">' + selectedSsrbs.length + "</span>  HITS!";
    } else if (selectedSsrbs[0][1].label === "goldenBall") {
      chainElement.innerHTML = '<span style="font-size: 4.2vw;" class="golden anime_text">' + selectedSsrbs.length + "</span>  HITS!";
    } else  {
      chainElement.innerHTML = '<span style="font-size: 3.5vw;" class="anime_text">' + selectedSsrbs.length + "</span>  CHAINS!";
    }

    if (selectedSsrbs[0][1].label === "goldenBall") {
      playMusic(yeahPath);
      playMusic(yellowScreamPath);
      playMusic(crap3Path);
      timeInterval += 20;
      commentElement.innerHTML = '<span class="golden anime_text" style="letter-spacing:1px;">LEGEND!</span>';
    } else if (selectedSsrbs.length === 2) {
      commentElement.innerHTML = '<span style="color:gray; letter-spacing:7px;" class="anime_text">GOOD!</span>';
    } else if (selectedSsrbs.length === 3) {
      commentElement.innerHTML = '<span style="color:gray; letter-spacing:7px;" class="anime_text">NICE!</span>';
    } else if (selectedSsrbs.length === 4) {
      commentElement.innerHTML = '<span style="color:gray; letter-spacing:5px;" class="anime_text">GREAT!</span>';
    } else if (selectedSsrbs.length === 5) {
      commentElement.innerHTML = '<span style="color:blue; letter-spacing:5px;" class="anime_text">GREAT!</span>';
    } else if (selectedSsrbs.length === 6) {
      commentElement.innerHTML = '<span style="color:blue; letter-spacing:1px;" class="anime_text">EXCELLENT!</span>';
    } else if (selectedSsrbs.length === 7) {
      commentElement.innerHTML = '<span style="color:green; letter-spacing:1px;" class="anime_text">EXCELLENT!</span>';
    } else if (selectedSsrbs.length === 8) {
      commentElement.innerHTML = '<span style="color:green; letter-spacing:1px;" class="anime_text">WONDERFUL!</span>';
    } else if (selectedSsrbs.length === 9) {
      playMusic(ohFemalePath)
      playMusic(crap1Path)
      commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 2.4vw;">WONDERFUL!</span>';
    } else if (selectedSsrbs.length === 10) {
      playMusic(ohFemalePath)
      playMusic(crap1Path)
      commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 2.4vw;">BRILLIANT!</span>';
    } else if (selectedSsrbs.length === 11) {
      playMusic(ohMalePath)
      playMusic(crap2Path)
      commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:2px; font-size: 2.4vw;">BRILLIANT!</span>';
    } else if (selectedSsrbs.length === 12) {
      playMusic(ohMalePath)
      playMusic(crap2Path)
      commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:2px; font-size: 2.4vw;">FABULOUS!</span>';
    } else if (selectedSsrbs.length === 13) {
      playMusic(yeahPath)
      playMusic(yellowScreamPath);
      playMusic(crap3Path)
      commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 3vw;">FABULOUS!</span>';
    } else if (selectedSsrbs.length >= 14) {
      playMusic(yeahPath)
      playMusic(yellowScreamPath);
      playMusic(crap3Path)
      commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 3vw;">OUTSTANDING!</span>';
    }

    // 爆発のエフェクトを生成する
    for (let i = 0; i < engine.world.bodies.length; i++) {
      for (let j = 0; j < selectedSsrbs.length; j++) {
        if (engine.world.bodies[i].id === selectedSsrbs[j][1].id
          && ( engine.world.bodies[i].label === "ball" || engine.world.bodies[i].label === "goldenBall")) {

          let poX = Math.round(engine.world.bodies[i].position.x);
          let poY = Math.round(engine.world.bodies[i].position.y);
          let rad = Math.round(engine.world.bodies[i].circleRadius);

          let explosion = document.createElement("img");
          explosion.src = explosionGifPath;
          explosion.width = explosionWidth;
          explosion.id = "explosion" + allDeletedSsrbs;
          explosion.style.position = "absolute";

          explosion.style.left = poX + rad / 2 - explosionWidth / 1.5 + "px";
          explosion.style.top = poY + rad / 2 - explosionWidth / 1.5 + "px";

          explosionsElement.appendChild(explosion)

          setTimeout(function() {
            explosionsElement.innerHTML = "";
          }, explosionTime);
        }
      }
    }

    // 選択されたSSRBを削除する
    for (let i = 0; i < engine.world.bodies.length; i++) {
      for (let j = 0; j < selectedSsrbs.length; j++) {
        if (engine.world.bodies[i].id === selectedSsrbs[j][1].id
          && (engine.world.bodies[i].label === "ball" || engine.world.bodies[i].label === "goldenBall")) {

          currentBallCount--;
          allDeletedSsrbs++;

          // SSRBを削除する
          Composite.remove(engine.world, engine.world.bodies[i]);

        }
      }
    }

    // なぜかすべて削除されないためもう一度実行する
    while(true) {
      let flag = false;
      for (let i = 0; i < engine.world.bodies.length; i++) {
        for (let j = 0; j < selectedSsrbs.length; j++) {
          if (engine.world.bodies[i].id === selectedSsrbs[j][1].id
            && (engine.world.bodies[i].label === "ball" || engine.world.bodies[i].label === "goldenBall")) {

            flag = true;
            currentBallCount--;
            allDeletedSsrbs++;

            // SSRBを削除する
            Composite.remove(engine.world, engine.world.bodies[i]);

          }
        }
      }
      if (!flag) {
        break;
      }
    }


    // 爆発の効果音を鳴らす
    let seRandom = Math.ceil(Math.random() * 3);
    playMusic( 'bombSE' + seRandom)

    setTimeout(function() {
      fragClickable = true;
    }, explosionTime)

  }

  // 削除した分、SSRBのオブジェクトを新たに生成する
  if (selectedSsrbs.length >= explosionCount && targets.length >= explosionCount) {
    for (let i = 0; i < selectedSsrbs.length; i++) {
      let randX = Math.floor(Math.random() * (width - 80)) + 40;
      let randY = -100;
      let rad = Math.floor(Math.random() * 5) + ballRad;

      let skeltonAppearRate = Math.ceil(Math.random() * 12);
      let goldenBallAppearRate = Math.ceil(Math.random() * 45);

      let ball = null;

      if (skeltonAppearRate === 12) {
        // 透明SSRBを生成
        ball = createSkeltonBall(randX, randY, skeltonRad);
      } else if (goldenBallAppearRate === 45) {
        ball = createGoldenBall(randX, randY, goldenRad);
      }else {
        // 通常SSRBを生成
        let imageColor = Math.ceil(Math.random() * 5);
        ball = createBall(randX, randY, rad, imageColor);
      }

      Composite.add(engine.world, ball);
    }
  }

  // 最大連鎖数を更新する
  if (selectedSsrbs.length >= bestChain && targets.length >= bestChain) {
    bestChain = selectedSsrbs.length;
  }

  // ターゲット用の二つの配列を初期化する
  selectedSsrbs = [];
  targets = [];

  // fragClickableがtrueにならないバグがあるため、保険としてもう一度処理をする
  setTimeout(function() {
    fragClickable = true;
  }, explosionTime)

  allDeletedElement.innerHTML = ' x ' + allDeletedSsrbs;

})


// ドラッグイベント
document.addEventListener("mousemove", function(event) {
  if (gameEnd) {
    return;
  }
  let rect = render.canvas.getBoundingClientRect();
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;

  // 最大１９連鎖まで
  if (fragDraggable && selectedSsrbs.length < 19) {

    for (let i = 0; i < engine.world.bodies.length; i++) {
      let body = engine.world.bodies[i];
      let ssrbX = body.position.x; // SSRBオブジェクトのx座標
      let ssrbY = body.position.y; // SSRBオブジェクトのｙ座標
      let rad = body.circleRadius; // SSRBオブジェクトの半径

      // SSRBオブジェクトとクリックした座標の距離を求める
      let distanceX = Math.abs(mouseX-ssrbX);
      let distanceY = Math.abs(mouseY-ssrbY);
      let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);

      // クリック位置がSSRBオブジェクトの内側の場合、SSRBオブジェクトをターゲットにする
      if (rad >= distance && (body.label === "ball" || body.label === "goldenBall")) {
        // すでにターゲットが登録されている場合のみ処理される
        if (selectedSsrbs.length > 0 && targets.length > 0) {
          let prevSsrb = selectedSsrbs[selectedSsrbs.length - 1];
          let prevSsrbX = prevSsrb[1].position.x;
          let prevSsrbY = prevSsrb[1].position.y;
          let distanceX2 = Math.abs(ssrbX-prevSsrbX);
          let distanceY2 = Math.abs(ssrbY-prevSsrbY);
          let distance2 = Math.sqrt(distanceX2*distanceX2 + distanceY2*distanceY2);

          // 前回のSSRBと今回のSSRBの距離が非常に近い場合のみ処理する
          if (distance2 < (rad + prevSsrb[1].circleRadius) * 1.4) {
            let prevSsrbColor = selectedSsrbs[selectedSsrbs.length-1][1].render.fillStyle;

            if (prevSsrbColor === body.render.fillStyle && body.label === "goldenBall") {

            }
            // 最初に選択した猫と同じ色のSSRBのみ選択できる
            // 透明SSRBも選択できる
            // ひとつ前に透明SSRBを選択した場合は、すべてのSSRBを選択できる
            if (prevSsrbColor === body.render.fillStyle
                || body.render.fillStyle === "transparent"
                || prevSsrbColor === "transparent") {
              if ( // 金色は透明と連結できない
                !(body.render.fillStyle === "transparent" && prevSsrbColor === "gold")
                && !(body.render.fillStyle === "gold" && prevSsrbColor === "transparent")
              ) {
                let img = body.render.sprite.texture
                let imgArray = img.split(".")
                let imgPathArray = imgArray[0].split("-")
                if (Number(imgPathArray[2]) < 10) {
                  body.render.sprite.texture = imgPathArray[0] + "-" + imgPathArray[1] + "-" + (Number(imgPathArray[2]) + 10) + ".png";
                  let target = createTarget(ssrbX, ssrbY);

                  Composite.add(engine.world, target);
                  const ssrbArray = [img, body]
                  selectedSsrbs.push(ssrbArray);
                  targets.push(target);

                  // ターゲットを選択したときに鳴らすクリック音
                  playMusic(clickSoundPath);

                }
              }

            }
          }
        }
      }
    }
  }
})


// タッチが始まったときの処理
document.addEventListener("touchstart", function(events) {

  let touches = events.changedTouches; // ユーザーがタッチした情報を取得
  if (touches.length === 1) { // 2か所以上タッチしていない状態でないと処理をしないようにする

    const event = touches[0];
    if (gameEnd) {
      return;
    }
    fragDraggable = true;

    if (fragClickable) {

      let rect = render.canvas.getBoundingClientRect();
      let mouseX = event.clientX - rect.left;
      let mouseY = event.clientY - rect.top;

      for (let i = 0; i < engine.world.bodies.length; i++) {
        let body = engine.world.bodies[i];
        let ssrbX = body.position.x; // SSRBオブジェクトのx座標
        let ssrbY = body.position.y; // SSRBオブジェクトのｙ座標
        let rad = body.circleRadius; // SSRBオブジェクトの半径

        // SSRBオブジェクトとクリックした座標の距離を求める
        let distanceX = Math.abs(mouseX - ssrbX);
        let distanceY = Math.abs(mouseY - ssrbY);
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // クリック位置がSSRBオブジェクトの内側の場合、SSRBオブジェクトをターゲットにする
        // 透明SSRBは選択できない
        if (
          rad >= distance
          && (body.label === "ball" || body.label === "goldenBall")
          && body.render.fillStyle !== "transparent"
        ) {
          let img = body.render.sprite.texture
          let imgArray = img.split(".")
          let imgPathArray = imgArray[0].split("-");

          if (Number(imgPathArray[2]) < 10) {

            body.render.sprite.texture = imgPathArray[0] + "-" + imgPathArray[1] + "-" + (Number(imgPathArray[2]) + 10) + ".png";

            let target = createTarget(ssrbX, ssrbY);
            // ターゲットを選択したときに鳴らすクリック音
            playMusic(clickSoundPath)
            // ターゲットオブジェクトを登録する
            const ssrbArray = [img, body];
            selectedSsrbs.push(ssrbArray);
            targets.push(target);
            Composite.add(engine.world, target);

          }
        }
      }
    }
  }
})


// タッチを離したときの処理
document.addEventListener("touchend", function(events) {

  let touches = events.changedTouches; // ユーザーがタッチした情報を取得
  if (touches.length === 1) { // 2か所以上タッチしていない状態でないと処理をしないようにする
    const event = touches[0];
    if (gameEnd) {
      return;
    }
    fragDraggable = false;

    // SSRBの画像をもとの状態に戻す
    for (let i = 0; i < engine.world.bodies.length; i++) {
      let body = engine.world.bodies[i];
      if (body.label === "ball" || body.label === "goldenBall") {
        let img = body.render.sprite.texture
        let imgArray = img.split(".")
        let imgPathArray = imgArray[0].split("-");

        if (Number(imgPathArray[2]) >= 10) {
          for (let i = 0; i < selectedSsrbs.length; i++) {
            if (body.id === selectedSsrbs[i][1].id) {
              body.render.sprite.texture = selectedSsrbs[i][0];
              break;
            }
          }
        }
      }
    }

    // ターゲットカーソルを削除する
    while (true) {
      let targetFlag = false; // ターゲットカーソルが一つでもあればtrueにする
      for (let i = 0; i < engine.world.bodies.length; i++) {
        let body = engine.world.bodies[i];
        setTimeout(function() {
          if(body.label === "target") {
            targetFlag = true;
            Composite.remove(engine.world, body);
          }
        }, 5)

      }
      if (!targetFlag) {
        break; // ターゲットカーソルがなければwhileから抜け出す
      }
    }

    // 選択されたSSRBを削除する
    // 通常SSRBなら2つ以上選択されていること、金色SSRBなら3つ以上選択されていることが条件
    if (
      (selectedSsrbs.length >= explosionCount
        && targets.length >= explosionCount
        && selectedSsrbs[0][1].label === "ball")
      || (selectedSsrbs.length >= goldenExplosionCount
        && targets.length >= goldenExplosionCount
        && selectedSsrbs[0][1].label === "goldenBall"
      )
    ) {

      // イベント発生時間中はクリックイベントができないようにする
      fragClickable = false;

      let scoreBonus = Math.ceil(Math.exp(selectedSsrbs.length) * 100 / selectedSsrbs.length - Math.random() * 100);

      if (selectedSsrbs[0][1].label === "goldenBall") {
        scoreBonus = 9999999; //1千万 - 1
      }

      if (scoreBonus >= bestScore) {
        bestScore = scoreBonus;
      }

      score += scoreBonus;
      plusScoreElement.innerHTML = '+ ' + scoreBonus.toLocaleString();
      plusScoreElement.animate(
        {
          transform: [
            'translateY(0px)',
            'translateY(-10px)',
          ],
          opacity: [1, 0]
        },
        {
          duration: 1000,
          fill: 'forwards'
        }
      )
      scoreElement.innerHTML = '<span class="anime_text">' + score.toLocaleString() + "</span>";
      if (selectedSsrbs.length >= 7) {
        chainElement.innerHTML = '<span style="font-size: 4.2vw;" class="gaming anime_text">' + selectedSsrbs.length + "</span>  HITS!";
      } else if (selectedSsrbs[0][1].label === "goldenBall") {
        chainElement.innerHTML = '<span style="font-size: 4.2vw;" class="golden anime_text">' + selectedSsrbs.length + "</span>  HITS!";
      } else {
        chainElement.innerHTML = '<span style="font-size: 3.5vw;" class="anime_text">' + selectedSsrbs.length + "</span>  CHAINS!";
      }

      if (selectedSsrbs[0][1].label === "goldenBall") {
        playMusic(yeahPath);
        playMusic(yellowScreamPath);
        playMusic(crap3Path);
        timeInterval += 20;
        commentElement.innerHTML = '<span class="golden anime_text" style="letter-spacing:1px;">LEGEND!</span>';
      } else if (selectedSsrbs.length === 2) {
        commentElement.innerHTML = '<span style="color:gray; letter-spacing:7px;" class="anime_text">GOOD!</span>';
      } else if (selectedSsrbs.length === 3) {
        commentElement.innerHTML = '<span style="color:gray; letter-spacing:7px;" class="anime_text">NICE!</span>';
      } else if (selectedSsrbs.length === 4) {
        commentElement.innerHTML = '<span style="color:gray; letter-spacing:5px;" class="anime_text">GREAT!</span>';
      } else if (selectedSsrbs.length === 5) {
        commentElement.innerHTML = '<span style="color:blue; letter-spacing:5px;" class="anime_text">GREAT!</span>';
      } else if (selectedSsrbs.length === 6) {
        commentElement.innerHTML = '<span style="color:blue; letter-spacing:1px;" class="anime_text">EXCELLENT!</span>';
      } else if (selectedSsrbs.length === 7) {
        commentElement.innerHTML = '<span style="color:green; letter-spacing:1px;" class="anime_text">EXCELLENT!</span>';
      } else if (selectedSsrbs.length === 8) {
        commentElement.innerHTML = '<span style="color:green; letter-spacing:1px;" class="anime_text">WONDERFUL!</span>';
      } else if (selectedSsrbs.length === 9) {
        playMusic(ohFemalePath)
        playMusic(crap1Path)
        commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 2.4vw;">WONDERFUL!</span>';
      } else if (selectedSsrbs.length === 10) {
        playMusic(ohFemalePath)
        playMusic(crap1Path)
        commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 2.4vw;">BRILLIANT!</span>';
      } else if (selectedSsrbs.length === 11) {
        playMusic(ohMalePath)
        playMusic(crap2Path)
        commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:2px; font-size: 2.4vw;">BRILLIANT!</span>';
      } else if (selectedSsrbs.length === 12) {
        playMusic(ohMalePath)
        playMusic(crap2Path)
        commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:2px; font-size: 2.4vw;">FABULOUS!</span>';
      } else if (selectedSsrbs.length === 13) {
        playMusic(yeahPath)
        playMusic(yellowScreamPath);
        playMusic(crap3Path)
        commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 3vw;">FABULOUS!</span>';
      } else if (selectedSsrbs.length >= 14) {
        playMusic(yeahPath)
        playMusic(yellowScreamPath);
        playMusic(crap3Path)
        commentElement.innerHTML = '<span class="gaming anime_text" style="letter-spacing:1px; font-size: 3vw;">OUTSTANDING!</span>';
      }

      // 爆発のエフェクトを生成する
      for (let i = 0; i < engine.world.bodies.length; i++) {
        for (let j = 0; j < selectedSsrbs.length; j++) {
          if (engine.world.bodies[i].id === selectedSsrbs[j][1].id
            && (engine.world.bodies[i].label === "ball" || engine.world.bodies[i].label === "goldenBall")) {

            let poX = Math.round(engine.world.bodies[i].position.x);
            let poY = Math.round(engine.world.bodies[i].position.y);
            let rad = Math.round(engine.world.bodies[i].circleRadius);
            let explosion = document.createElement("img");
            explosion.src = explosionGifPath;
            explosion.width = explosionWidth;
            explosion.id = "explosion" + allDeletedSsrbs;
            explosion.style.position = "absolute";

            explosion.style.left = poX + rad / 2 - explosionWidth / 1.5 + "px";
            explosion.style.top = poY + rad / 2 - explosionWidth / 1.5 + "px";

            explosionsElement.appendChild(explosion)

            setTimeout(function () {
              explosionsElement.innerHTML = "";
            }, explosionTime);
          }
        }
      }

      // 選択されたSSRBを削除する
      for (let i = 0; i < engine.world.bodies.length; i++) {
        for (let j = 0; j < selectedSsrbs.length; j++) {
          if (engine.world.bodies[i].id === selectedSsrbs[j][1].id
            && (engine.world.bodies[i].label === "ball" || engine.world.bodies[i].label === "goldenBall")) {

            currentBallCount--;
            allDeletedSsrbs++;

            // SSRBを削除する
            Composite.remove(engine.world, engine.world.bodies[i]);

          }
        }
      }

      // なぜかすべて削除されないためもう一度実行する
      while(true) {
        let flag = false;
        for (let i = 0; i < engine.world.bodies.length; i++) {
          for (let j = 0; j < selectedSsrbs.length; j++) {
            if (engine.world.bodies[i].id === selectedSsrbs[j][1].id
              && (engine.world.bodies[i].label === "ball" || engine.world.bodies[i].label === "goldenBall")) {

              flag = true;
              currentBallCount--;
              allDeletedSsrbs++;

              // SSRBを削除する
              Composite.remove(engine.world, engine.world.bodies[i]);

            }
          }
        }
        if (!flag) {
          break;
        }
      }

      // 爆発の効果音を鳴らす
      let seRandom = Math.ceil(Math.random() * 3);
      playMusic('bombSE' + seRandom)

      setTimeout(function () {
        fragClickable = true;
      }, explosionTime)

    }

    // 削除した分、SSRBのオブジェクトを新たに生成する
    if (selectedSsrbs.length >= explosionCount && targets.length >= explosionCount) {
      for (let i = 0; i < selectedSsrbs.length; i++) {
        let randX = Math.floor(Math.random() * (width - 80)) + 40;
        let randY = -100;
        let rad = Math.floor(Math.random() * 5) + ballRad;

        let skeltonAppearRate = Math.ceil(Math.random() * 12);
        let goldenBallAppearRate = Math.ceil(Math.random() * 45);

        let ball = null;

        if (skeltonAppearRate === 12) {
          // 透明SSRBを生成
          ball = createSkeltonBall(randX, randY, skeltonRad);
        } else if (goldenBallAppearRate === 45) {
          ball = createGoldenBall(randX, randY, goldenRad);
        } else {
          // 通常SSRBを生成
          let imageColor = Math.ceil(Math.random() * 5);
          ball = createBall(randX, randY, rad, imageColor);
        }

        Composite.add(engine.world, ball);
      }
    }

    // 最大連鎖数を更新する
    if (selectedSsrbs.length >= bestChain && targets.length >= bestChain) {
      bestChain = selectedSsrbs.length;
    }

    // ターゲット用の二つの配列を初期化する
    selectedSsrbs = [];
    targets = [];

    // fragClickableがtrueにならないバグがあるため、保険としてもう一度処理をする
    setTimeout(function () {
      fragClickable = true;
    }, explosionTime)

    allDeletedElement.innerHTML = ' x ' + allDeletedSsrbs;
  }
})


// タッチムーブイベント
document.addEventListener("touchmove", function(events) {

  let touches = events.changedTouches; // ユーザーがタッチした情報を取得
  if (touches.length === 1) { // 2か所以上タッチしていない状態でないと処理をしないようにする

    let event = touches[0];
    if (gameEnd) {
      return;
    }
    let rect = render.canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    // 最大１９連鎖まで
    if (fragDraggable && selectedSsrbs.length < 19) {

      for (let i = 0; i < engine.world.bodies.length; i++) {
        let body = engine.world.bodies[i];
        let ssrbX = body.position.x; // SSRBオブジェクトのx座標
        let ssrbY = body.position.y; // SSRBオブジェクトのｙ座標
        let rad = body.circleRadius; // SSRBオブジェクトの半径

        // SSRBオブジェクトとクリックした座標の距離を求める
        let distanceX = Math.abs(mouseX-ssrbX);
        let distanceY = Math.abs(mouseY-ssrbY);
        let distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);

        // クリック位置がSSRBオブジェクトの内側の場合、SSRBオブジェクトをターゲットにする
        if (rad >= distance && (body.label === "ball" || body.label === "goldenBall")) {
          // すでにターゲットが登録されている場合のみ処理される
          if (selectedSsrbs.length > 0 && targets.length > 0) {
            let prevSsrb = selectedSsrbs[selectedSsrbs.length - 1];
            let prevSsrbX = prevSsrb[1].position.x;
            let prevSsrbY = prevSsrb[1].position.y;
            let distanceX2 = Math.abs(ssrbX-prevSsrbX);
            let distanceY2 = Math.abs(ssrbY-prevSsrbY);
            let distance2 = Math.sqrt(distanceX2*distanceX2 + distanceY2*distanceY2);

            // 前回のSSRBと今回のSSRBの距離が非常に近い場合のみ処理する
            if (distance2 < (rad + prevSsrb[1].circleRadius) * 1.4) {
              let prevSsrbColor = selectedSsrbs[selectedSsrbs.length-1][1].render.fillStyle;

              if (prevSsrbColor === body.render.fillStyle && body.label === "goldenBall") {

              }
              // 最初に選択した猫と同じ色のSSRBのみ選択できる
              // 透明SSRBも選択できる
              // ひとつ前に透明SSRBを選択した場合は、すべてのSSRBを選択できる
              if (prevSsrbColor === body.render.fillStyle
                || body.render.fillStyle === "transparent"
                || prevSsrbColor === "transparent") {
                if ( // 金色は透明と連結できない
                  !(body.render.fillStyle === "transparent" && prevSsrbColor === "gold")
                  && !(body.render.fillStyle === "gold" && prevSsrbColor === "transparent")
                ) {
                  let img = body.render.sprite.texture
                  let imgArray = img.split(".")
                  let imgPathArray = imgArray[0].split("-")
                  if (Number(imgPathArray[2]) < 10) {
                    body.render.sprite.texture = imgPathArray[0] + "-" + imgPathArray[1] + "-" + (Number(imgPathArray[2]) + 10) + ".png";
                    let target = createTarget(ssrbX, ssrbY);

                    Composite.add(engine.world, target);
                    const ssrbArray = [img, body]
                    selectedSsrbs.push(ssrbArray);
                    targets.push(target);

                    // ターゲットを選択したときに鳴らすクリック音
                    playMusic(clickSoundPath);

                  }
                }
              }
            }
          }
        }
      }
    }
  }
})

