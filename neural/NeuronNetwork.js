// const fs = require('fs');

const Neuron = require('./Neuron');
const Link = require('./Link');

const NEURON_NUMBER = 72;
const LAYER_NUMBER = 3;
const LEARNING_SPEED = 0.7;

//TODO: сейчас жёсткая связь многие ко многим + жёстко количество слоёв + жёстко количество нейронов
//TODO: сделать автоопределение слоёв и нейронов
class NeuronNetwork {
    constructor(inputNumber = 0, outputNumber = 0, neuronNumber = NEURON_NUMBER) {
        this.layers = new Array(LAYER_NUMBER);
        this.initNetwork(inputNumber, neuronNumber, outputNumber);
    }

    initNetwork(inputs, layerNeuronsCount, outputs) {
        this.layers[0] = new Array(inputs);
        this.layers[this.layers.length - 1] = new Array(outputs);

        for(let i = 1; i < this.layers.length - 1; i++) {
            this.layers[i] = new Array(layerNeuronsCount);
        }

        this.createNeurons();
        this.createLinks();
    }

    createNeurons() {
        for (let i = 0; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j] = new Neuron();
            }
        }
    }

    createLinks() {
        for (let i = 1; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].length; j++) {
                for (let k = 0; k < this.layers[i - 1].length; k++) {
                    this.layers[i][j].links.push(new Link(i - 1, k))
                }
            }
        }
    }

    train(examples, options) {
        let errors = 1;
        options = options || {errors: 0.5};

        while (errors > options.errors) {
            errors = 0;

            for (let i = 0; i < examples.length; i++) {
                let error = 0;

                this.handle(examples[i].input);
                this.resetNeuronsSigma();
                this.trainExample(examples[i]);
                this.handle(examples[i].input);

                for (let j = 0; j < examples[i].output.length; j++) {
                    error += Math.abs(examples[i].output[j] - this.layers[this.layers.length - 1][j].output);
                }

                error /= examples[i].output.length;
                errors += error;
            }

            errors /= examples.length;
            console.log('error: ', errors);
        }
    }

    handle(input) {
        if (this.layers[0].length !== input.length) {
            console.log('Error! Input neuron number != input length');
            return;
        }

        for (let i = 0; i < this.layers[0].length; i++) {
            this.layers[0][i].output = input[i];
        }

        for (let i = 1; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j].calculate(this.layers);
            }
        }

        return this.layers[this.layers.length - 1].map((el) => {return Math.round(el.output)});
    }

    resetNeuronsSigma() {
        for (let i = 0; i < this.layers.length - 1; i++) {
            for (let j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j].sigma = 0;
            }
        }
    }

    trainExample(example) {
        for (let i = 0; i < this.layers[this.layers.length - 1].length; i++) {
            const layer = this.layers[this.layers.length - 1][i];
            layer.sigma = (example.output[i] - layer.output)*((1 - layer.output)*layer.output);

            for (let j = 0; j < layer.links.length; j++) {
                const link = layer.links[j];
                const gradient = this.layers[link.layer][link.neuron].output*layer.sigma;
                link.lastChange = this.learningSpeed*gradient + link.lastChange*this.learningMoment;

                this.layers[link.layer][link.neuron].sigma += link.weight * layer.sigma;
                link.weight += link.lastChange;
            }
        }

        for (let i = this.layers.length - 2; i >= 0; i--) {
            for (let j = 0; j < this.layers[i].length; j++) {
                const neuron = this.layers[i][j];
                neuron.sigma *= (1 - neuron.output)*neuron.output;

                for (let k = 0; k < neuron.links.length; k++) {
                    const link = neuron.links[k];
                    const gradient = this.layers[link.layer][link.neuron].output*neuron.sigma;
                    link.lastChange = this.learningSpeed*gradient + link.lastChange*this.learningMoment;

                    this.layers[link.layer][link.neuron].sigma += link.weight * neuron.sigma;
                    link.weight += link.lastChange;
                }
            }
        }
    }

    toJSON(path) {
        return this.layers;
    }

    fromJSON(savedLayers) {
        this.layers = new Array(savedLayers.length);

        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i] = new Array(savedLayers[i].length);

            for (let j = 0; j < savedLayers[i].length; j++) {
                this.layers[i][j] = new Neuron();

                for (let k = 0; k < savedLayers[i][j].links.length; k++) {
                    const link = savedLayers[i][j].links[k];
                    this.layers[i][j].links.push(new Link(link.layer, link.neuron, link.weight));
                }
            }
        }
    }

    get learningSpeed() {
        return LEARNING_SPEED;
    }

    get learningMoment() {
        return Math.random()/3;
    }
}

module.exports = NeuronNetwork;