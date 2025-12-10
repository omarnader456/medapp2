const mongo = require('mongoose');

const g = new mongo.Schema({
  patient: { type: mongo.Schema.Types.ObjectId, ref: 'Person', required: true, unique: true },
  doctor: { type: mongo.Schema.Types.ObjectId, ref: 'Person', required: true },
  nurse: { type: mongo.Schema.Types.ObjectId, ref: 'Person', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongo.model('Group', g); // Collection: groups