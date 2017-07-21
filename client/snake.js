function caculateNextPos(pos, direction) {
    return pos + direction;
}

const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = BLOCK_WIDTH;
const BLOCK_UNIT_PIXEL = 20;

class Snake{
    constructor(body,direction){
        this.body = body;
        this.direction = direction;
    }

    getHead(){
        return this.body[0];
    }

    moveStep() {
        let head = this.getHead();
        let newHead = caculateNextPos(head, this.direction);
        this.addNewHead(newHead);        
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

    removeTail(){
        this.body.pop();
    }

    containPos(pos){
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

    getRealDirection(){
        return this.body[0] - this.body[1];
    }
}

class SnakeGame {  
    
    constructor(contex) {

        this.snakes = [new Snake([42,41],1)];

        this.foodPos = 43;
        this.contex = contex;
        this.score = 0;
    }

    run() {
        this.process();        
    }

    processOneSnake(snake){
        snake.moveStep();
        if (snake.isHitPos(this.foodPos)) {            
            this.createNewFood();
        } else {
            snake.removeTail();
        }

        if (this.isHitTheWall(snake)) {
            return alert("GAME OVER");
        }
    }

    process() {
        for(let i in this.snakes){
            this.processOneSnake(this.snakes[i]);
        }        

        this.draw();

        setTimeout(this.process.bind(this),130);
    }

    isHitTheWall(snake) {
        let head = snake.getHead();
        let direction = snake.direction;

        if(snake.hitSelf()){
            console.log("hit self");
            return true;
        }

        return (this.getY(head) < 0) ||
            (this.getY(head) >= BLOCK_HEIGHT) ||
            (direction == 1 && this.getX(head) == 0) ||
            (direction == -1 && this.getX(head) == BLOCK_WIDTH-1);
    }

    createNewFood(pos){
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
        for(let i in this.snakes){
            let snake = this.snakes[i];
            for (let j in snake.body) {
                let pos = snake.body[j];
                this.drawItem(pos, "Green");
            }
        }
    }


    drawItem(pos, color) {
        this.contex.fillStyle = color;
        let x = this.getX(pos) * BLOCK_UNIT_PIXEL + 1,
            y = this.getY(pos) * BLOCK_UNIT_PIXEL + 1;
        this.contex.fillRect(x, y, 18, 18);
    }

    isInSnake(pos) {
        for(let i in this.snakes){
            let snake = this.snakes[i];
            if(snake.containPos(pos))return true;
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

    getX(pos) {
        return pos % BLOCK_WIDTH;
    }

    getY(pos) {
        return Math.floor(pos / BLOCK_WIDTH);
    }

    onkeydown(e) {
        const KEY_LEFT = 37,
            KEY_UP = 38,
            KEY_RIGHT = 39,
            KEY_DONW = 40;

        switch (e.keyCode) {
            case KEY_LEFT:
                return this.snakes[0].turnLeft();
            case KEY_UP:
                return this.snakes[0].turnUp();
            case KEY_RIGHT:
                return this.snakes[0].turnRight();
            case KEY_DONW:
                return this.snakes[0].turnDown();
            default:
                return;
        }
    }

}