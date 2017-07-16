
class SnakeGame {  
    
    constructor(contex) {
        this.BLOCK_WIDTH = 20;
        this.BLOCK_HEIGHT = this.BLOCK_WIDTH;
        this.BLOCK_UNIT_PIXEL = 20;

        this.snakes = [42, 41];
        this.foodPos = 43;
        this.direction = 1;

        this.contex = contex;
    }

    run() {
        setInterval(() => {
            this.process();
        }, 130);
    }

    process() {
        this.moveSnake(this.direction);

        if (this.isHitTheWall()) {
            return alert("GAME OVER");
        }

        if (this.isHitPos(this.foodPos)) {
            this.foodPos = this.getNewRandomFoodPos();
        } else {
            this.snakes.pop();
        }

        this.draw();
    }

    moveSnake(direction) {
        let head = this.snakes[0];
        let newHead = this.caculateNextPos(head, direction);
        this.addNewHead(newHead);
        return newHead;
    }

    addNewHead(pos){
        this.snakes.unshift(pos);
    }

    isHitTheWall() {
        let head = this.snakes[0];

        return (this.getY(head) < 0) ||
            (this.getY(head) >= this.BLOCK_HEIGHT) ||
            (this.direction == 1 && this.getX(head) == 0) ||
            (this.direction == -1 && this.getX(head) == 19) ||
            (this.snakes.indexOf(head, 1) > 0);
    }

    isHitPos(pos) {
        return this.snakes[0] === pos;
    }

    draw() {
        this.drawBackgraound();
        this.drawFood();
        this.drawSnake();
    }

    drawBackgraound() {
        for (let i = 0; i < this.BLOCK_WIDTH * this.BLOCK_HEIGHT; i++) {
            this.drawItem(i, "Black");
        }
    }

    drawFood() {
        this.drawItem(this.foodPos, "Yellow");
    }

    drawSnake() {
        for (let i in this.snakes) {
            let pos = this.snakes[i];
            this.drawItem(pos, "Green");
        }
    }

    drawItem(pos, color) {
        this.contex.fillStyle = color;
        let x = this.getX(pos) * this.BLOCK_UNIT_PIXEL + 1,
            y = this.getY(pos) * this.BLOCK_UNIT_PIXEL + 1;
        this.contex.fillRect(x, y, 18, 18);
    }

    isInSnake(pos) {
        return this.snakes.indexOf(pos) > 0;
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

    turnLeft() {
        if (this.direction != 1) this.direction = -1;
    }

    turnUp() {
        if (this.direction != this.BLOCK_WIDTH) this.direction = -this.BLOCK_WIDTH;
    }

    turnRight() {
        if (this.direction != -1) this.direction = 1;
    }

    turnDown() {
        if (this.direction != -this.BLOCK_WIDTH) this.direction = this.BLOCK_WIDTH;
    }

    getX(pos) {
        return pos % this.BLOCK_WIDTH;
    }

    getY(pos) {
        return Math.floor(pos / this.BLOCK_WIDTH);
    }

    caculateNextPos(pos, direction) {
        return pos + direction;
    }

    onkeydown(e) {
        const KEY_LEFT = 37,
            KEY_UP = 38,
            KEY_RIGHT = 39,
            KEY_DONW = 40;

        switch (e.keyCode) {
            case KEY_LEFT:
                return this.turnLeft();
            case KEY_UP:
                return this.turnUp();
            case KEY_RIGHT:
                return this.turnRight();
            case KEY_DONW:
                return this.turnDown();
            default:
                return;
        }
    }
}