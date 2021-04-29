const models = require('../models');

const { WhatIf } = models;

const makerPage = (req, res) => {
  WhatIf.WhatIfModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), whatIfs: docs });
  });
  // res.render('app');
};

const makeWhatIf = (req, res) => {
  console.log(req.body);
  if (!req.body.question) {
    return res.status(400).json({ error: 'Question field is required' });
  }

  const whatIfData = {
    author: req.session.account.username,
    question: req.body.question,
    answers: req.body.answers,
    owner: req.session.account._id,
    date: req.body.createdDate,
  };

  const newWhatIf = new WhatIf.WhatIfModel(whatIfData);

  const whatIfPromise = newWhatIf.save();

  whatIfPromise.then(() => res.json({ redirect: '/maker' }));

  whatIfPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Question already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return whatIfPromise;
};


const getWhatIfs = (request, response) => {
  const req = request;
  const res = response;

  return WhatIf.WhatIfModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ whatIf: docs });
  });
};

const getAllWhatIfs = (request, response) => {
  // const req = request;
  const res = response;

  return WhatIf.WhatIfModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ whatIf: docs });
  });
};

const deleteWhatIf = (request, response) => {
  const req = request;
  const res = response;
  // console.log(req);
  return WhatIf.WhatIfModel.delete(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ whatIf: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getWhatIfs = getWhatIfs;
module.exports.getAllWhatIfs = getAllWhatIfs;
module.exports.deleteWhatIf = deleteWhatIf;
module.exports.make = makeWhatIf;
