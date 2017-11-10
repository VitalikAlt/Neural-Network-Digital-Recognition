const fs = require('fs');
const mnist = require('mnist');
const NeuronNetwork = require('../neural/NeuronNetwork');

const set = mnist.set(10, 0);
const trainingSet = set.training;

neuronNetwork = new NeuronNetwork();
neuronNetwork.fromJSON(require('../saved/data.json'));

console.log(JSON.stringify(neuronNetwork.handle(trainingSet[1].input)) === JSON.stringify(trainingSet[1].output));
//
// neuronNetwork.train(trainingSet, {errors: 0.002});
//
// fs.writeFileSync('./saved/data.json', JSON.stringify(neuronNetwork.toJSON()));
// console.log('Train finished');