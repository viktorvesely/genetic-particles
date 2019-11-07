class NeuralNetwork {
    constructor() {
        this.layers = [];
    }

    add(layer) {
        let length = this.layers.length;
        if (length > 0) {
            this.layers[length - 1].next = layer;
        }
        this.layers.push(layer);
        return this;
    }

    predict(input) {
        return this.layers[0].fire(input);
    }
}

NeuralNetwork.prototype.input_shape = ["energy", "fx", "fy", "isFood"];
NeuralNetwork.prototype.output_shape = ["alpha", "go"];
NeuralNetwork.prototype.hidden_neurons = 32;