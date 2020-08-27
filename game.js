const Pong = `
  #game {
    width = 800
    height = 600

    readyCount = 0
    left
    leftScore = 0
    right
    rightScore = 0

    countDown = "..."
    countDownTimer = timer("starting", 1000)

    tickTimer = timer("ticking", 16)
  }

  #player {
    y = 300
  }

  #ball {
    radius = 5

    x
    y
    vx
    vy
  }

  <init> {
    (ready) {
      #game.readyCount = @player.ready ? #game.readyCount : #game.readyCount + 1
      #game.left = #game.readyCount == 1 ? @uid : #game.left
      #game.right = #game.readyCount == 2 ? @uid : #game.right
      @player.ready = true
      broadcast("game", #game)
      @state = every([#game.left, #game.right]) ? <starting> : @state
    }
  }

  <starting> {
    (enter) {
      stop_timer(#game.tickTimer)

      #ball.x = #game.width / 2
      #ball.y = #game.height / 2
      #ball.vx = choice([2, -2])
      #ball.vy = uniform() * 2 - 0.5

      broadcast("ball", #ball)
      broadcast(#game.left, get_player(#game.left))
      broadcast(#game.right, get_player(#game.right))
      #game.countDown = 3
      broadcast("game", #game)
      start_timer(#game.countDownTimer)
    }
    (starting) {
      #game.countDown = #game.countDown - 1
      broadcast("game", #game)
      @state = #game.countDown == 0 ? <playing> : @state
    }
    (leave) {
      stop_timer(#game.countDownTimer)
    }
  }

  <playing> {
    (enter) {
      broadcast("ball", #ball)
      start_timer(#game.tickTimer)
    }
    (ticking) {
      #ball.x = #ball.x + #ball.vx
      #ball.y = #ball.y + #ball.vy
      broadcast("ball", #ball)

      bounceHorizontal = some([
        #ball.x <= #ball.radius,
        #ball.x >= #game.width - #ball.radius
      ])

      bounceVertical = some([
        #ball.y <= #ball.radius,
        #ball.y >= #game.height - #ball.radius
      ])
      @state = bounceHorizontal ? <bounce-h> : bounceVertical ? <bounce-v> : @state
    }
    (move) {
      @player.y = @payload.y
      broadcast(@uid, @player)
    }
  }

  <bounce-v> {
    (ticking) {
      #ball.vy = #ball.vy * -1

      #ball.x = #ball.x + #ball.vx
      #ball.y = #ball.y + #ball.vy

      broadcast("ball", #ball)
      @state = <playing>
    }
  }

  <bounce-h> {
    (ticking) {
      #ball.vx = #ball.vx * -1.2
      #ball.vy = #ball.vy * 1.2
      broadcast("ball", #ball)

      left = get_player(#game.left)
      right = get_player(#game.right)
      left_diff = abs(left.y - #ball.y)
      right_diff = abs(right.y - #ball.y)

      @state =
        every([left_diff > 40, #ball.x <= #ball.radius])
        ? <score-right>
        : every([right_diff > 40, #ball.x >= #game.width - #ball.radius])
        ? <score-left>
        : <playing>

      #ball.x = #ball.x + #ball.vx
      #ball.y = #ball.y + #ball.vy
    }
  }

  <score-left> {
    (enter) {
      #game.leftScore = #game.leftScore + 1
      broadcast("game", #game)
    }
    (ticking) {
      @state = <starting>
    }
  }

  <score-right> {
    (enter) {
      #game.rightScore = #game.rightScore + 1
      broadcast("game", #game)
    }
    (ticking) {
      @state = <starting>
    }
  }
`;

export default Pong;
