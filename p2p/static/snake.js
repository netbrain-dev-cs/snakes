function caculateNextPos(pos, direction) {
    return pos + direction;
}

const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = BLOCK_WIDTH;
const BLOCK_UNIT_PIXEL = 20;

function getX(pos) {
    return pos % BLOCK_WIDTH;
}

function getY(pos) {
    return Math.floor(pos / BLOCK_WIDTH);
}

class Snake {
    constructor(body, direction) {
        this.body = body;
        this.direction = direction;

        this.alive = true;
    }

    getHead() {
        return this.body[0];
    }

    moveStep() {
        let head = this.getHead();
        let newHead = caculateNextPos(head, this.direction);
        this.addNewHead(newHead);
        return newHead;
    }

    addNewHead(pos) {
        this.body.unshift(pos);
    }

    hitSelf() {
        let head = this.getHead();
        return this.body.indexOf(head, 1) > 0
    }

    isHitPos(pos) {
        return this.getHead() === pos;
    }

    removeTail() {
        this.body.pop();
    }

    containPos(pos) {
        return this.body.indexOf(pos, 0) > 0;
    }

    turnLeft() {
        if (this.getRealDirection() != 1) this.direction = -1;
    }

    turnUp() {
        if (this.getRealDirection() != BLOCK_WIDTH) this.direction = -BLOCK_WIDTH;
    }

    turnRight() {
        if (this.getRealDirection() != -1) this.direction = 1;
    }

    turnDown() {
        if (this.getRealDirection() != -BLOCK_WIDTH) this.direction = BLOCK_WIDTH;
    }

    getRealDirection() {
        return this.body[0] - this.body[1];
    }

    isAlive() {
        return this.alive;
    }

    die() {
        this.alive = false;
    }

    changeDirection(direction) {
        switch (direction) {
            case 0:
                this.turnLeft();
                break;
            case 1:
                this.turnUp();
                break;
            case 2:
                this.turnRight();
                break;
            case 3:
                this.turnDown();
                break;
            default:
                break;
        }
    }
}

class SnakeGame {

    constructor(contex) {

        this.snakes = [];

        this.foodPos = 43;
        this.contex = contex;
        this.started = false;
    }

    addSnake(body, direction) {
        this.snakes.push(new Snake(body, direction));
    }

    start() {
        this.started = true;
    }
    pause(){
        this.started = false;
    }

    processOneSnake(snake) {
        if (!snake.isAlive()) return;

        snake.moveStep();
        if (snake.isHitPos(this.foodPos)) {
            this.createNewFood();
        } else {
            snake.removeTail();
        }

        if (this.isHitTheWall(snake)) {
            snake.die();
        }
    }

    processDirections(directions) {
        if (!directions) {
            return;
        }

        for (let i in directions) {
            if (i >= this.snakes.length) {
                break;
            }

            this.snakes[i].changeDirection(directions[i]);
        }

    }

    step(directions) {
        if (this.started) {
            this.processDirections(directions);

            for (let i in this.snakes) {
                this.processOneSnake(this.snakes[i]);
            }
        }

        this.draw();
    }


    isHitTheWall(snake) {
        let head = snake.getHead();
        let direction = snake.direction;

        if (snake.hitSelf()) {
            console.log("hit self");
            return true;
        }

        return (getY(head) < 0) ||
            (getY(head) >= BLOCK_HEIGHT) ||
            (direction == 1 && getX(head) == 0) ||
            (direction == -1 && getX(head) == BLOCK_WIDTH - 1);
    }

    createNewFood(pos) {
        this.foodPos = this.getNewRandomFoodPos();
    }

    draw() {
        this.drawBackgraound();
        this.drawFood();
        this.drawSnake();
    }

    drawBackgraound() {
        for (let i = 0; i < BLOCK_WIDTH * BLOCK_HEIGHT; i++) {
            this.drawItem(i, "Black");
        }
    }

    drawFood() {
        this.drawItem(this.foodPos, "Yellow");
    }

    drawSnake() {
        for (let i in this.snakes) {
            let snake = this.snakes[i];
            let color = snake.isAlive() ? "Green" : "Red";
            for (let j in snake.body) {
                let pos = snake.body[j];
                this.drawItem(pos, color);
            }
        }
    }


    drawItem(pos, color) {
        this.contex.fillStyle = color;
        let x = getX(pos) * BLOCK_UNIT_PIXEL + 1,
            y = getY(pos) * BLOCK_UNIT_PIXEL + 1;
        this.contex.fillRect(x, y, 18, 18);
    }

    isInSnake(pos) {
        for (let i in this.snakes) {
            let snake = this.snakes[i];
            if (snake.containPos(pos)) return true;
        }
        return false;
    }

    getNewRandomFoodPos() {
        while (true) {
            let randPos = Math.random() * 400;
            randPos = Math.floor(randPos);

            if (!this.isInSnake(randPos)) {
                return randPos;
            }
        };
    }

}