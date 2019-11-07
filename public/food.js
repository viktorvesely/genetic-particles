class Food {
    constructor(width, height, n) {
        this.value = null;
        this.width = width;
        this.height = height;
        this.n = n;

        this.populateFood();
    }

    populateFood() {
        this.value = [];
        for (let i = 0; i < this.n; ++i) {
            let pos = new Vector(this.randInt(0, this.width), this.randInt(0, this.height));
            this.value.push({pos: pos, eaten: false});
        }
    }

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min))  + min;
    }

    draw(ctx, food) {
        ctx.fillStyle = food.eaten ? "red" : "white";
        ctx.fillRect( food.pos.x, food.pos.y, 5, 5 );
    }
}