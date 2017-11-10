class Link {
    constructor(layer, neuron, weight = 0) {
        this.layer = layer;
        this.neuron = neuron;
        this.weight = weight;
        this.lastChange = 0;
    }
}

module.exports = Link;