$(function(){
     let ctx = document.getElementById("can").getContext("2d");
        let snakeGame = new SnakeGame(ctx, 40);
        let directions = [0,0];
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    return directions[0]=0;
                case 38:
                    return directions[0]=1;
                case 39:
                    return directions[0]=2;
                case 40:
                    return directions[0]=3;
                 case 68:
                    return directions[1]=0;
                case 65:
                    return directions[1]=1;
                case 83:
                    return directions[1]=2;
                case 87:
                    return directions[1]=3;
                case 13:
                    snakeGame.started = !snakeGame.started;
                    break;               
            };
        };

        snakeGame.start();
        snakeGame.addSnake([42, 41], 1);
        snakeGame.addSnake([420, 421], 1);
        setInterval(() => {
            snakeGame.step(directions);
        }, 130);
});