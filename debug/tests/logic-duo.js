const NeuronNetwork = require('../../neural/NeuronNetwork');
neuronNetwork = new NeuronNetwork(2, 1);

neuronNetwork.train([
    {input: [0, 0], output: [0]},
    {input: [0, 1], output: [1]},
    {input: [1, 0], output: [1]},
    {input: [1, 1], output: [1]}
], {errors: 0.02});

console.log(neuronNetwork.handle([0,0]));
console.log(neuronNetwork.handle([0,1]));
console.log(neuronNetwork.handle([1,0]));
console.log(neuronNetwork.handle([1,1]));