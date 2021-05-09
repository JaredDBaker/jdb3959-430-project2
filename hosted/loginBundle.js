"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#whatIfMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#whatIfMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", null, "Sign In"), /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "usename"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
};

var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h1", null, "Sign Up"), /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "usename"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement("hr", null), document.querySelector("#WhatIfs"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement("hr", null), document.querySelector("#WhatIfs"));
};

var createHomeWindow = function createHomeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(HomeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement("hr", null), document.querySelector("#WhatIfs"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginbutton");
  var signupButton = document.querySelector("#signupButton");
  var homeButton = document.querySelector("#homeButton");
  var searchButton = document.querySelector("#searchButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createHomeWindow(csrf);
    return false;
  });
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSearchWindow(csrf);
  });
  createHomeWindow(csrf); //default view
};

var getToken = function getToken() {
  sendAjax('GET', "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var WhatIfSearch = function WhatIfSearch(props) {
  //console.log(props);
  if (props.whatIfs.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "whatIfStats"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyWhat"
      }, "No What Ifs yet"))
    );
  } //console.log(props.csrf);


  var whatifNodes = props.whatIfs.map(function (whatif) {
    //console.log(whatif.e);
    return (/*#__PURE__*/React.createElement("div", {
        key: whatif._id,
        className: "whatif"
      }, /*#__PURE__*/React.createElement("div", {
        className: "info"
      }, /*#__PURE__*/React.createElement("h3", null, " ", whatif.question, " "), /*#__PURE__*/React.createElement("h4", null, "Author: ", whatif.author, " "), /*#__PURE__*/React.createElement("h5", null, "Posted on: ", whatif.createdDate, " ")), /*#__PURE__*/React.createElement("div", {
        className: "answers"
      }, /*#__PURE__*/React.createElement("h4", null, "Answers: "), /*#__PURE__*/React.createElement("ul", null, " ", whatif.answers.map(function (value, index) {
        return (/*#__PURE__*/React.createElement("li", {
            key: index
          }, value)
        );
      }), " "), /*#__PURE__*/React.createElement("form", {
        id: "answerForm" + whatif._id,
        onSubmit: handleAnswer,
        name: "answerForm",
        action: "/addAnswer",
        method: "PUT",
        className: "answerForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf || ''
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_id",
        value: whatif._id
      }), /*#__PURE__*/React.createElement("input", {
        className: "answer",
        type: "text",
        name: "answer",
        placeholder: "your answer"
      }), /*#__PURE__*/React.createElement("input", {
        className: "answerSubmit",
        type: "submit",
        value: "Answer What If"
      }))))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "whatifList"
    }, whatifNodes)
  );
};

var loadAllWhatIfsFromServer = function loadAllWhatIfsFromServer(csrf) {
  sendAjax('GET', '/getAllWhatIfs', null, function (data) {
    //console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfSearch, {
      whatIfs: data.whatIf,
      csrf: csrf
    }), document.querySelector('#WhatIfs'));
  });
};

var createSearchWindow = function createSearchWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement("h1", null, "Here is all the What Ifs"), document.querySelector("#Content"));

  if (document.querySelector("#makeWhatIf") != null) {
    ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfForm, {
      csrf: csrf
    }), document.querySelector("#makeWhatIf"));
  }

  ;
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfSearch, {
    whatIfs: []
  }), document.querySelector("#WhatIfs"));
  loadAllWhatIfsFromServer(csrf);
};

var handleAnswer = function handleAnswer(e) {
  e.preventDefault(); //console.log(e.target.answer.value);

  $("#errorMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#" + e.target.id).serialize().answer == '') {
    handleError("Answer fields are required");
    return false;
  } //console.log($("#"+e.target.id).serialize());
  //let token = $("#"+e.target.id).serialize().csrf;


  sendAjax('PUT', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
    loadAllWhatIfsFromServer(getToken());
  });
  $("#" + e.target.id)[0].reset();
  return false;
};

var HomeWindow = function HomeWindow(props) {
  return (/*#__PURE__*/React.createElement("section", {
      id: "home"
    }, /*#__PURE__*/React.createElement("div", {
      id: "explain"
    }, /*#__PURE__*/React.createElement("h1", null, "Welcome to What IF?"), /*#__PURE__*/React.createElement("p", null, "Hello and welcome"), /*#__PURE__*/React.createElement("h3", null, "Use '/getAllWhatIfs' to recieve the list of all the questions Posted")), /*#__PURE__*/React.createElement("div", {
      id: "preview"
    }, /*#__PURE__*/React.createElement("h1", null, "Preview:")))
  );
};

var createHomeWindow = function createHomeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(HomeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement("hr", null), document.querySelector("#WhatIfs"));

  if (document.querySelector("#makeWhatIf") != null) {
    ReactDOM.render( /*#__PURE__*/React.createElement("br", null), document.querySelector("#makeWhatIf"));
  }

  ;
};
