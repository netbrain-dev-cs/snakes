function caculateNextPos(pos, direction) {
    return pos + direction;
}

class Snake{
    constructor(body,direction){
        this.body = body;
        this.direction = direction;

        this.BLOCK_WIDTH = 40;
        this.BLOCK_HEIGHT = this.BLOCK_WIDTH;
    }

    getHead(){
        return this.body[0];
    }

    moveStep() {
        let head = this.getHead();
        let newHead = caculateNextPos(head, this.direction);
        this.addNewHead(newHead);
        this.body.pop();
        return newHead;
    }

    addNewHead(pos){
        this.body.unshift(pos);
    }

    hitSelf(){
        let head = this.getHead();
        return this.body.indexOf(head, 1) > 0
    }

    isHitPos(pos) {
        return this.getHead() === pos;
    }

    eatFood(foodPos){
        this.addNewHead(foodPos);
    }

    containPos(pos){
        return this.body.indexOf(pos, 0) > 0;
    }

    turnLeft() {
        if (this.getRealDirection() != 1) this.direction = -1;
    }

    turnUp() {
        if (this.getRealDirection() != this.BLOCK_WIDTH) this.direction = -this.BLOCK_WIDTH;
    }

    turnRight() {
        if (this.getRealDirection() != -1) this.direction = 1;
    }

    turnDown() {
        if (this.getRealDirection() != -this.BLOCK_WIDTH) this.direction = this.BLOCK_WIDTH;
    }

    getRealDirection(){
        return this.body[0] - this.body[1];
    }
}

class SnakeGame {  
    
    constructor(contex,width=20) {
        this.BLOCK_WIDTH = width;
        this.BLOCK_HEIGHT = this.BLOCK_WIDTH;
        this.BLOCK_UNIT_PIXEL = 20;

        this.snake = new Snake([42,41],1,this.BLOCK_WIDTH);

        this.foodPos = 43;
        this.contex = contex;
        this.score = 0;
    }

    run() {
        this.process();        
    }

    process() {
        if (this.snake.isHitPos(this.foodPos)) {
            this.snake.eatFood(this.foodPos);
            this.createNewFood();
        } else {
            this.snake.moveStep();
        }

        if (this.isHitTheWall(this.snake.getHead(),this.snake.direction)) {
            return alert("GAME OVER");
        }

        this.draw();

        setTimeout(this.process.bind(this),130);
    }

    isHitTheWall(head,direction) {
        return (this.getY(head) < 0) ||
            (this.getY(head) >= this.BLOCK_HEIGHT) ||
            (direction == 1 && this.getX(head) == 0) ||
            (direction == -1 && this.getX(head) == this.BLOCK_WIDTH-1);
    }

    createNewFood(pos){
        this.foodPos = this.getNewRandomFoodPos();
    }

    draw() {
        this.drawBackgraound();
        this.drawFood();
        this.drawSnake();
        this.drawScore();
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
        for (let i in this.snake.body) {
            let pos = this.snake.body[i];
            this.drawItem(pos, "Green");
        }
    }

    drawScore(){
        ctx.fillStyle="White";
        this.contex.fillText("Score: " + this.score,20,20);
    }

    drawItem(pos, color) {
        this.contex.fillStyle = color;
        let x = this.getX(pos) * this.BLOCK_UNIT_PIXEL + 1,
            y = this.getY(pos) * this.BLOCK_UNIT_PIXEL + 1;
        this.contex.fillRect(x, y, 18, 18);
    }

    isInSnake(pos) {
        return this.snake.containPos(pos);
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

    getX(pos) {
        return pos % this.BLOCK_WIDTH;
    }

    getY(pos) {
        return Math.floor(pos / this.BLOCK_WIDTH);
    }

    onkeydown(e) {
        const KEY_LEFT = 37,
            KEY_UP = 38,
            KEY_RIGHT = 39,
            KEY_DONW = 40;

        switch (e.keyCode) {
            case KEY_LEFT:
                return this.snake.turnLeft();
            case KEY_UP:
                return this.snake.turnUp();
            case KEY_RIGHT:
                return this.snake.turnRight();
            case KEY_DONW:
                return this.snake.turnDown();
            default:
                return;
        }
    }

    getScore(){
        return this.score;
    }
}