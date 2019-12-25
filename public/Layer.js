const sigmoid_scalar = 6;

class Layer {
    constructor(w, b ,activationFunc) {
        this.activation = this.resolveActivationFunc(activationFunc);
        this.b = b;
        this.w = w;
        this.next = null;
    }
    

    nextLayer(layer) {
        this.next = layer;
        return this;
    }

    fire(input) {
        input = input.map(this.activation);
        if (!this.next) {
            return input;
        }
        let next = [];
        for (let i = 0; i < this.b.length; ++i) {
            next.push(this.b[i]);
        }
        for(let i = 0; i < this.w.length; ++i) {
            let neuron = this.w[i];
            for (let z = 0; z < neuron.length; ++z) {
                next[z] += input[z] * neuron[z];
            }
        }
        return this.next.fire(next);
    }


    resolveActivationFunc(name) {
        switch(name) {
            case "relu":
                return this._relu;
            case "elu":
                return this._elu;
            case "linear":
                return this._linear;
            case "sigmoid":
                 return this._sigmoid;
            case "sin":
                return this._sin;
        }
    } 

    _sin(x) {
        return Math.sin(x);
    }

    _relu(x) {
        return x >= 0 ? x : 0;
    }

    _elu(x) {
        return x >= 0 ? x : 1.4 * (Math.pow(Math.E, x) - 1);
    }

    _linear(x) {
        return x;
    }

    _sigmoid(x) {
        return sigmoid_scalar*( 1/ (1 + Math.pow(Math.E, -x)) ) - (sigmoid_scalar / 2);
    }
}
