/**
 * Model
 */
const tfmodel = tf.sequential();

/**
 * Layers
 */

tfmodel.add(tf.layers.dense({
    units: 256,        // number of nodes
    inputShape: [6], // input shape
    activation: 'sigmoid',
}));

tfmodel.add(tf.layers.dense({
    units: 512,        // number of nodes
    inputShape: [256], // input shape
    activation: 'sigmoid',
}));

tfmodel.add(tf.layers.dense({
    units: 256,        // number of nodes
    inputShape: [512], // input shape
    activation: 'sigmoid',
})); // add the hidden layer to model

tfmodel.add(tf.layers.dense({
    units: 3,
    inputShape: [256],
    activation: 'sigmoid',
})); // add the output layer to model

const optimizer = tf.train.adam(0.0001);

tfmodel.compile({
    optimizer,
    loss: tf.losses.meanSquaredError
}); // compile the model

