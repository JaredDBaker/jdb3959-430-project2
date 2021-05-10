"use strict";

// handles making new what ifs
var handleWhatIf = function handleWhatIf(e) {
  e.preventDefault();
  $("#errorMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#question").val() == '') {
    handleError("All fields are required");
    return false;
  }

  console.log($("#whatIfForm").serialize());
  sendAjax('POST', $("#whatIfForm").attr("action"), $("#whatIfForm").serialize(), function () {
    loadWhatIfsFromServer(getToken());
  });
  $("#whatIfForm")[0].reset();
  return false;
}; // This is the form used to create new what ifs


var WhatIfForm = function WhatIfForm(props) {
  //console.log(props);
  return (/*#__PURE__*/React.createElement("form", {
      id: "whatIfForm",
      onSubmit: handleWhatIf,
      name: "whatIfForm",
      action: "/maker",
      method: "POST",
      className: "whatIfForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "question"
    }, "Ask a Question: "), /*#__PURE__*/React.createElement("input", {
      id: "question",
      type: "text",
      name: "question",
      placeholder: "What if?"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeWhatIfSubmit",
      type: "submit",
      value: "Make What If"
    }))
  );
}; //Lists out the what ifs of a user


var WhatIfList = function WhatIfList(props) {
  //console.log(props);
  if (props.whatIfs.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "whatIfList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyWhat"
      }, "No What Ifs yet"))
    );
  } //console.log(props.csrf);


  var whatifNodes = props.whatIfs.map(function (whatif) {
    //console.log(whatif);
    return (/*#__PURE__*/React.createElement("div", {
        key: whatif._id,
        className: "whatif"
      }, /*#__PURE__*/React.createElement("div", {
        className: "info"
      }, /*#__PURE__*/React.createElement("h3", null, " ", whatif.question, " "), /*#__PURE__*/React.createElement("h4", null, "Author: ", whatif.author, " "), /*#__PURE__*/React.createElement("h5", null, "Posted on: ", whatif.createdDate, " ")), /*#__PURE__*/React.createElement("div", {
        className: "answers"
      }, /*#__PURE__*/React.createElement("h4", null, "Answers: "), /*#__PURE__*/React.createElement("ol", null, " ", whatif.answers.map(function (value, index) {
        return (/*#__PURE__*/React.createElement("li", {
            key: index
          }, value)
        );
      }), " "), /*#__PURE__*/React.createElement("form", {
        id: "deleteForm" + whatif._id,
        onSubmit: deleteWhatIf,
        name: "deleteForm",
        action: "/maker",
        method: "DELETE",
        className: "deleteForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_id",
        value: whatif._id,
        readOnly: true
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf || '',
        readOnly: true
      }), /*#__PURE__*/React.createElement("input", {
        className: "delete",
        type: "submit",
        value: "Delete"
      }))))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "whatifList"
    }, whatifNodes)
  );
}; //loads user specific what ifs form the server


var loadWhatIfsFromServer = function loadWhatIfsFromServer(csrf) {
  sendAjax('GET', '/getWhatIfs', null, function (data) {
    //console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfList, {
      whatIfs: data.whatIf,
      csrf: csrf
    }), document.querySelector('#WhatIfs'));
  });
}; // deletes the what if that had its delete button pressed


var deleteWhatIf = function deleteWhatIf(e) {
  //console.log($("#"+e.target.id).serialize());
  //let token = $("#"+e.target.id).serialize().csrf;
  e.preventDefault();
  sendAjax('DELETE', '/maker', $("#" + e.target.id).serialize(), function () {
    loadWhatIfsFromServer(getToken());
  });
}; // creates the list window showing all of the current users questions


var createListWindow = function createListWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement("h1", null, "All of your What Ifs"), document.querySelector("#Content"));
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfForm, {
    csrf: csrf
  }), document.querySelector("#makeWhatIf"));
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfList, {
    whatIfs: [],
    csrf: csrf
  }), document.querySelector("#WhatIfs"));
  loadWhatIfsFromServer(csrf);
}; //sets up all the pages when a user is logged in


var setup = function setup(csrf) {
  var searchButton = document.querySelector("#searchButton");
  var listButton = document.querySelector("#listButton");
  var homeButton = document.querySelector("#homeButton");
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSearchWindow(csrf);
    return false;
  });
  listButton.addEventListener("click", function (e) {
    e.preventDefault();
    createListWindow(csrf);
    return false;
  });
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createHomeWindow(csrf);
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfForm, {
    csrf: csrf
  }), document.querySelector("#makeWhatIf"));
  ReactDOM.render( /*#__PURE__*/React.createElement("h1", null, "All of your What Ifs"), document.querySelector("#Content"));
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfList, {
    whatIfs: [],
    csrf: csrf
  }), document.querySelector("#WhatIfs"));
  loadWhatIfsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
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
}; // Search page for both users logged in and not


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
}; // calls /getAllWhatIfs and renders a WhatIf Search page with the returned data


var loadAllWhatIfsFromServer = function loadAllWhatIfsFromServer(csrf) {
  sendAjax('GET', '/getAllWhatIfs', null, function (data) {
    //console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfSearch, {
      whatIfs: data.whatIf,
      csrf: csrf
    }), document.querySelector('#WhatIfs'));
  });
}; // creates the what if search window


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
}; //handles the answer form data from the search page what ifs


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
    createSearchWindow(getToken());
  });
  $("#" + e.target.id)[0].reset();
  return false;
}; // returns the home window


var HomeWindow = function HomeWindow(props) {
  if (props.whatIf === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "whatIfStats"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyWhat"
      }, "No What Ifs yet"))
    );
  } //let p = props.whatIfs[Math.floor(Math.random() *props.whatIfs.length)];


  var whatifNode = props.whatIf.map(function (whatif) {
    return (/*#__PURE__*/React.createElement("div", {
        key: whatif._id,
        className: "whatif"
      }, /*#__PURE__*/React.createElement("div", {
        className: "info"
      }, /*#__PURE__*/React.createElement("h3", null, " ", whatif.question, " "), /*#__PURE__*/React.createElement("h4", null, "Author: ", whatif.author, " "), /*#__PURE__*/React.createElement("h5", null, "Posted on: ", whatif.createdDate, " ")))
    );
  });
  return (/*#__PURE__*/React.createElement("section", {
      id: "home"
    }, /*#__PURE__*/React.createElement("div", {
      id: "explain"
    }, /*#__PURE__*/React.createElement("h1", null, "Welcome to What IF?"), /*#__PURE__*/React.createElement("p", null, "Hello and welcome to What If? a site dedicated to the question of its name. To the right you'll see an example of one such question.  To which you can answer, and read other's answers.  You can also craft your own questions for others to answer, by making an account."), /*#__PURE__*/React.createElement("ul", null, "Guide:", /*#__PURE__*/React.createElement("li", null, "The Home page is a hub for finding out information and learning to use the site"), /*#__PURE__*/React.createElement("li", null, "The Search page is where you can find all of the What If questions users have asked to browse and answer to your heart content"), /*#__PURE__*/React.createElement("li", null, "The Login Page is where you can access your account if you have one"), /*#__PURE__*/React.createElement("li", null, "If you dont't have and Account go to the Sign Up Page to make one and start questioning"), /*#__PURE__*/React.createElement("li", null, "Once you have an acount you can access the List page which allows you to create your own What Ifs and shows you all of the What Ifs you have made")), /*#__PURE__*/React.createElement("h3", null, "Use '/getAllWhatIfs' to recieve the list of all the questions in JSON")), /*#__PURE__*/React.createElement("div", {
      id: "preview"
    }, /*#__PURE__*/React.createElement("h1", null, "Preview:"), whatifNode))
  );
}; // renders out the home window along with login and maker page specific items


var createHomeWindow = function createHomeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(HomeWindow, {
    whatIf: [],
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement("hr", null), document.querySelector("#WhatIfs"));

  if (document.querySelector("#makeWhatIf") != null) {
    ReactDOM.render( /*#__PURE__*/React.createElement("br", null), document.querySelector("#makeWhatIf"));
  }

  ;
  loadPreview(csrf);
};

var loadPreview = function loadPreview(csrf) {
  sendAjax('GET', '/getAllWhatIfs', null, function (data) {
    //console.log(data);
    var p = data.whatIf[Math.floor(Math.random() * data.whatIf.length)]; //console.log(p);

    ReactDOM.render( /*#__PURE__*/React.createElement(HomeWindow, {
      whatIf: [p],
      csrf: csrf
    }), document.querySelector('#content'));
  });
};
