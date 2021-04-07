const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requireLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requireLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requireLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.get('/', mid.requiresSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;
