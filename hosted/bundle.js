"use strict";

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
};

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
};

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
};

var loadWhatIfsFromServer = function loadWhatIfsFromServer(csrf) {
  sendAjax('GET', '/getWhatIfs', null, function (data) {
    //console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfList, {
      whatIfs: data.whatIf,
      csrf: csrf
    }), document.querySelector('#WhatIfs'));
  });
};

var deleteWhatIf = function deleteWhatIf(e) {
  //console.log($("#"+e.target.id).serialize());
  //let token = $("#"+e.target.id).serialize().csrf;
  e.preventDefault();
  sendAjax('DELETE', '/maker', $("#" + e.target.id).serialize(), function () {
    loadWhatIfsFromServer(getToken());
  });
};

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
}; // const createHomeWindow = (csrf) => {
//     ReactDOM.render(
//         <HomeWindow csrf={csrf} />,
//         document.querySelector("#content")
//     );
//     ReactDOM.render(
//         <hr></hr>, 
//         document.querySelector("#WhatIfs")
//     );
//     ReactDOM.render(
//         <br></br>, 
//         document.querySelector("#makeWhatIf")
//     );
// };


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
