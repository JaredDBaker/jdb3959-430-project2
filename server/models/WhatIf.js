const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let WhatIfModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setQuestion = (question) => _.escape(question).trim();

// Schema for the what ifs
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

// finds all the what ifs made by a certain user
WhatIfSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return WhatIfModel.find(search).select('author question answers createdDate').lean().exec(callback);
};

// Finds and returns all of the user made what ifs
WhatIfSchema.statics.findAll = (callback) => WhatIfModel.find().select('author question answers createdDate').lean().exec(callback);

// Deletes a what if by the provided ID
WhatIfSchema.statics.delete = (id, callback) => {
  // console.log(id);
  const search = {
    _id: id,
  };
  console.log(search);
  return WhatIfModel.deleteOne(search).exec(callback);
};

// Adds an Answer to the What If that has the provided ID
WhatIfSchema.statics.addAnswer = (data, callback) => {
  console.log(data);
  const search = {
    _id: data._id,
  };
  // console.log(convertID(data._id));
  return WhatIfModel.updateOne(search, {
    $addToSet: {
      answers: data.answer,
    },
  }).exec(callback);
};

WhatIfModel = mongoose.model('WhatIf', WhatIfSchema);

module.exports.WhatIfModel = WhatIfModel;
module.exports.WhatIfSchema = WhatIfSchema;
