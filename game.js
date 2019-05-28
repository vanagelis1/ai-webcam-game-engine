let loopAnimation;
let Game = {
    canvas: document.getElementById('snake_game'),
    ctx: document.getElementById('snake_game').getContext('2d'),
    width: 400,
    height: 400,
    snakeSize: 10,
    score: 0,
    snakeBody: [],
    food: {},
    direction: '',
    init: () => {
        //DEFAULTS
        Game.direction = 'down';
        Game.snakeBody = [];
        Game.snakeSize = 10;
        Game.timeout = 100;
        Game.score = 0;
        Game.food = {};

        //ACTIONS
        Game.createSnake();
        Game.createFood();

        clearInterval(loopAnimation);
        loopAnimation = setInterval(() => {
            Game.drawElements.paint();
        }, 200);
    },
    createSnake: () => {
        for(let i = 4; i >= 0; i--) {
            Game.snakeBody.push({ x: i, y: 0 });
        }
    },
    createFood: () => {
        let w = 39;
        Game.food.x = Math.floor((Math.random() * w) + 1);
        Game.food.y = Math.floor((Math.random() * w) + 1);

        let snake = Game.snakeBody,
            food  = Game.food;

        for(let i = 0; i > snake.length; i++) {
            let snakeX = snake[i].x,
                snakeY = snake[i].y;

            if (food.x === snakeX || food.y === snakeY || food.y === snakeY && food.x === snakeX) {
                Game.food.x = Math.floor((Math.random() * w) + 1);
                Game.food.y = Math.floor((Math.random() * w) + 1);
            }
        }
    },
    drawElements: {
        snake : (x,y) => {
            let size = Game.snakeSize;
            Game.ctx.fillStyle = '#A9A9A9';
            Game.ctx.fillRect(x*size, y*size, size, size);
            Game.ctx.strokeStyle = '#696969';
            Game.ctx.strokeRect(x*size, y*size, size, size);
        },
        food: (x,y) => {
            let size = Game.snakeSize;
            Game.ctx.fillStyle = '#555';
            Game.ctx.fillRect(x*size, y*size, size, size);
        },
        score: () => {
            let score = "Score: " + Game.score;
            Game.ctx.fillStyle = '#555';
            Game.ctx.fillText(score, 200, Game.height-5);
        },
        paint: () => {
            //background
            Game.ctx.fillStyle = '#ffffff';
            Game.ctx.fillRect(0, 0, Game.width, Game.height);
            Game.ctx.strokeStyle = 'black';
            Game.ctx.strokeRect(0, 0, Game.width, Game.height);

            let snakeX = Game.snakeBody[0].x,
                snakeY = Game.snakeBody[0].y,
                direction = Game.direction;

            let tail = null;

            if (direction == 'right') {
                snakeX++;
            } else if (direction == 'left') {
                snakeX--;
            } else if (direction == 'up') {
                snakeY--;
            } else if (direction == 'down') {
                snakeY++;
            } else if (direction == 'downLeft') {
                snakeY++;
                snakeX--;
            } else if (direction == 'upLeft') {
                snakeY--;
                snakeX--;
            } else if (direction == 'upRight') {
                snakeY--;
                snakeX++;
            } else if (direction == 'downRight') {
                snakeY++;
                snakeX++;
            }

            if (snakeX == -1 || snakeX == Game.width / Game.snakeSize || snakeY == -1 || snakeY == Game.height / Game.snakeSize || Game.explodeArea(snakeX, snakeY, Game.snake)) {
                //CLEAR GAME
                // Snake.ctx.clearRect(0, 0, Snake.width, Snake.height);
                let gameOver = "Game over, press Play to restart. ";
                Game.ctx.fillStyle = '#555';
                Game.ctx.font = "20px Arial";
                Game.ctx.fillText(gameOver, 50, 200, 500);
                clearInterval(loopAnimation);
                return;
            }
            //SNAKE EAT AND CHECK TO NEW FOOD ADDED TO SNAKE
            if (snakeX == Game.food.x && snakeY == Game.food.y) {
                tail = { x: snakeX, y: snakeY };
                Game.score++;

                Game.createFood();
            } else {
                tail = Game.snakeBody.pop();
                tail.x = snakeX;
                tail.y = snakeY;
            }
            Game.snakeBody.unshift(tail);
            for (var i = 0; i < Game.snakeBody.length; i++) { // CREATE SNAKE
                Game.drawElements.snake(Game.snakeBody[i].x, Game.snakeBody[i].y);
            }

            Game.drawElements.food(Game.food.x,Game.food.y); //CREATE FOOD
            Game.drawElements.score(); //CREATE SCORE
        }
    },
    explodeArea: (x,y) => {
        let snake = Game.snakeBody;
        for(let i = 0, len = snake.length; i < len; i++) {
            if(snake[i].x === x && snake[i].y === y){
                return true;
            }
        }
        return false;
    }
};

export function arrowSetting(code) {
        switch(code){
            case 37:
                if (Game.direction !== 'downRight' && Game.direction !== 'upRight' && Game.direction !== 'right') {
                    Game.direction = 'left';
                    break;
                }
                break;
            case 38:
                if (Game.direction !== 'downLeft' && Game.direction !== 'downRight' && Game.direction !== 'down') {
                    Game.direction = 'up';
                    break;
                }
                break;
            case 39:
                if (Game.direction !== 'upLeft' && Game.direction !== 'downLeft' && Game.direction !== 'left') {
                    Game.direction = 'right';
                    break;
                }
                break;
            case 40:
                if (Game.direction !== 'upRight' && Game.direction !== 'upLeft' && Game.direction !== 'up') {
                    Game.direction = 'down';
                    break;
                }
                break;
            case 41:
                Game.direction = ((Game.direction === 'left') || (Game.direction === 'down')) ? 'downLeft' : Game.direction;
                break;
            case 42:
                Game.direction = ((Game.direction === 'down') || (Game.direction === 'right')) ? 'downRight' : Game.direction;
                break;
            case 43:
                Game.direction = ((Game.direction === 'up') || (Game.direction === 'right')) ? 'upRight' : Game.direction;
                break;
            case 44:
                Game.direction = ((Game.direction === 'up') || (Game.direction === 'left')) ? 'upLeft' : Game.direction;
                break;
        }
}
// const CONTROLS = ['up', 'down', 'left', 'right', 'downLeft', 'downRight', 'upRight', 'upLeft'];
// const CONTROL_CODES = [38, 40, 37, 39, 41, 42, 43, 44];
export function init() {
    Game.init();
}