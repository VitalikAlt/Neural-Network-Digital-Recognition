class Neuron {
    constructor() {
        this.links = [];
        this.output = 0;
        this.sigma = 0;
    }

    calculate(layers) {
        this.output = 0;

        for(let i = 0; i < this.links.length; i++) {
            const link = this.links[i];
            this.output += link.weight * layers[link.layer][link.neuron].output;
        }

        this.output = 1/(1 + Math.exp(-this.output))
    }
}

module.exports = Neuron;