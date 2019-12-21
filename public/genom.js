class Genom {
    constructor(particle) {
        this.w1 = null;
        this.b1 = null;
        this.w2 = null;
        this.b2 = null;
        this.nn = null;
        this.fitness = 0;

        this.particle = particle;

        this.randomizeGenom();
    }

    randomizeGenom() {
        this.w1 = [];
        this.b1 = [];
        this.w2 = [];
        this.b2 = [];

        for(let i = 0; i < this.shapes.w1[0]; ++i) {
            let temp = [];
            for(let z = 0; z < this.shapes.w1[1]; ++z) {
                temp.push(this.randInt(this.min, this.max));
            } 
            this.w1.push(temp);
        }

        for(let i = 0; i < this.shapes.b1[0]; ++i) {
            this.b1.push(this.randInt(this.min, this.max));
        }

        for(let i = 0; i < this.shapes.w2[0]; ++i) {
            let temp = [];
            for(let z = 0; z < this.shapes.w2[1]; ++z) {
                temp.push(this.randInt(this.min, this.max));
            } 
            this.w2.push(temp);
        }

        for(let i = 0; i < this.shapes.b2[0]; ++i) {
            this.b2.push(this.randInt(this.min, this.max));
        }

        this.createController();
    }

    createController() {
        this.nn = new NeuralNetwork();
        this.nn.add(
            new Layer(this.w1, this.b1, "linear")  
        ).add(
            new Layer(this.w2, this.b2, "relu")
        ).add(
            new Layer([], [], "linear")
        );
    }

    flatten() {
        let flat = [];

        for(let i = 0; i < this.shapes.w1[0]; ++i) {
            for(let z = 0; z < this.shapes.w1[1]; ++z) {
               flat.push(this.w1[i][z]);
            }
        }

        for(let i = 0; i < this.shapes.b1[0]; ++i) {
            flat.push(this.b1[i]);
        }

        for(let i = 0; i < this.shapes.w2[0]; ++i) {
            for(let z = 0; z < this.shapes.w2[1]; ++z) {
               flat.push(this.w2[i][z]);
            }
        }

        for(let i = 0; i < this.shapes.b2[0]; ++i) {
            flat.push(this.b2[i]);
        }

        return flat;
    }

    loadFlatten(flatten) {
        this.w1 = [];
        this.b1 = [];
        this.w2 = [];
        this.b2 = [];

        for(let i = 0; i < this.shapes.w1[0]; ++i) {
            let temp = [];
            for(let z = 0; z < this.shapes.w1[1]; ++z) {
                temp.push(flatten.shift());
            } 
            this.w1.push(temp);
        }

        for(let i = 0; i < this.shapes.b1[0]; ++i) {
            this.b1.push(flatten.shift());
        }

        for(let i = 0; i < this.shapes.w2[0]; ++i) {
            let temp = [];
            for(let z = 0; z < this.shapes.w2[1]; ++z) {
                temp.push(flatten.shift());
            } 
            this.w2.push(temp);
        }

        for(let i = 0; i < this.shapes.b2[0]; ++i) {
            this.b2.push(flatten.shift());
        }
        this.createController();
        return this;
    }

    randInt(min, max) {
        return Math.random() * (max - min)  + min;
    }
}

Genom.prototype.shapes =  {
    w1: [4, 16],
    b1: [16],
    w2: [16, 2],
    b2: [2]
}

Genom.prototype.max = 1;
Genom.prototype.min = -1;
