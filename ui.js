const state = {game: {leftScore: 0, rightScore: 0}};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');

export function setup(game) {
  let throttle = false;

  function moveMouse(e) {
    const y = Math.min(Math.max(40, e.pageY - canvas.offsetTop), canvas.height - 40);
    if (!throttle) {
      game.trigger('move', {y});
      throttle = true;
      setTimeout(() => {
        throttle = false;
      }, 33);
    }
  }

  function ready() {
    document.onmousemove = moveMouse;
    game.trigger('ready');
  }

  playButton.onclick = function () {
    playButton.style.display = 'none';
    ready();
  };

  game.handlePush = ({event, payload}) => {
    switch (event) {
      case 'join':
        break;
      default:
        state[event] = payload;
        draw();
    }
  };
}

export function draw() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgb(64,64,64)';
  const size = 4;
  for (let y = 0; y < canvas.height; y += size * 3) {
    ctx.fillRect(canvas.width / 2 - size / 2, y, size, size);
  }

  ctx.fillStyle = 'rgba(128,128,128,.6)';
  ctx.font = '48px sans-serif';
  const leftScoreSize = ctx.measureText(state.game.leftScore);
  ctx.fillText(state.game.leftScore, 200 - leftScoreSize.width / 2, 60);
  const rightScoreSize = ctx.measureText(state.game.rightScore);
  ctx.fillText(state.game.rightScore, 600 - rightScoreSize.width / 2, 60);

  if (state.game.left && state.game.right && state[state.game.left] && state[state.game.right]) {
    ctx.fillStyle = 'rgba(192,192,192,0.8)';
    ctx.fillRect(0, state[state.game.left].y - 40, 4, 80);
    ctx.fillRect(796, state[state.game.right].y - 40, 4, 80);
  }

  if (state.game.countDown) {
    ctx.font = '96px sans-serif';
    const size = ctx.measureText(state.game.countDown);

    ctx.fillStyle = 'rgba(128,128,128,.6)';
    ctx.beginPath();
    ctx.arc(400, 300, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'rgb(192,192,192)';
    ctx.fillText(state.game.countDown, 400 - size.width / 2, 334);
  } else if (state.ball) {
    ctx.fillStyle = 'rgba(192,192,192,0.8)';
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
