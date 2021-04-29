const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let WhatIfModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setQuestion = (question) => _.escape(question).trim();

const WhatIfSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  question: {
    type: String,
    required: true,
    trim: true,
    set: setQuestion,
  },

  answers: {
    type: [],

  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  }, 
});

WhatIfSchema.statics.toAPI = (doc) => ({
  author: doc.name,
  question: doc.question,
  answers: doc.answers,
});

WhatIfSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return WhatIfModel.find(search).select('author question answers createdDate').lean().exec(callback);
};

WhatIfSchema.statics.findAll = (callback) => {
  return WhatIfModel.find().select('author question answers createdDate').lean().exec(callback);
};

WhatIfSchema.statics.delete = (id, callback) => {
  console.log(id);
  const search = {
    _id: convertID(id),
  };
  return WhatIfModel.deleteOne(search).exec(callback);
};

WhatIfModel = mongoose.model('WhatIf', WhatIfSchema);

module.exports.WhatIfModel = WhatIfModel;
module.exports.WhatIfSchema = WhatIfSchema;
