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
    loadWhatIfsFromServer($("#whatIfForm").serialize().csrf);
  });
  return false;
};

var handleAnswer = function handleAnswer(e) {
  e.preventDefault();
  $("#errorMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#answer").val() == '') {
    handleError("All fields are required");
    return false;
  }

  console.log($("#answerForm").serialize());
  sendAjax('POST', $("#answerForm").attr("action"), $("#answerForm").serialize(), function () {
    loadWhatIfsFromServer($("#answerForm").serialize().csrf);
  });
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
    }, "Question: "), /*#__PURE__*/React.createElement("input", {
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
    return (/*#__PURE__*/React.createElement("div", {
        key: whatif._id,
        className: "whatif"
      }, /*#__PURE__*/React.createElement("h3", null, " ", whatif.question, " "), /*#__PURE__*/React.createElement("h3", null, " ", whatif.author, " "), /*#__PURE__*/React.createElement("h3", null, " ", whatif.createdDate, " "), /*#__PURE__*/React.createElement("form", {
        id: "deleteForm",
        onSubmit: deleteWhatIf,
        name: "deleteForm",
        action: "/deleteWhatIf",
        method: "DELETE",
        className: "deleteForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_id",
        value: whatif._id
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "delete",
        type: "submit",
        value: "Delete"
      })))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "whatifList"
    }, whatifNodes)
  );
};

var WhatIfStats = function WhatIfStats(props) {
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
    return (/*#__PURE__*/React.createElement("div", {
        key: whatif._id,
        className: "whatif"
      }, /*#__PURE__*/React.createElement("h3", null, " ", whatif.question, " "), /*#__PURE__*/React.createElement("h3", null, " ", whatif.author, " "), /*#__PURE__*/React.createElement("h3", null, " ", whatif.createdDate, " "), /*#__PURE__*/React.createElement("form", {
        id: "answerForm",
        onSubmit: handleAnswer,
        name: "answerForm",
        action: "/answerWhatIf",
        method: "POST",
        className: "answerForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        id: "answer",
        type: "text",
        name: "answer",
        placeholder: "your answer"
      }), /*#__PURE__*/React.createElement("input", {
        className: "answerSubmit",
        type: "submit",
        value: "Answer What If"
      })))
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

var loadAllWhatIfsFromServer = function loadAllWhatIfsFromServer(csrf) {
  sendAjax('GET', '/getAllWhatIfs', null, function (data) {
    //console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfStats, {
      whatIfs: data.whatIf,
      csrf: csrf
    }), document.querySelector('#WhatIfs'));
  });
};

var deleteWhatIf = function deleteWhatIf(e) {
  console.log($("#deleteForm").serialize().csrf);
  e.preventDefault();
  sendAjax('DELETE', '/maker', $("#deleteForm").serialize(), function () {
    loadWhatIfsFromServer($("#deleteForm").serialize().csrf);
  });
};

var createStatsWindow = function createStatsWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfStats, {
    whatIfs: []
  }), document.querySelector("#WhatIfs"));
  loadAllWhatIfsFromServer(csrf);
};

var createListWindow = function createListWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfList, {
    whatIfs: [],
    csrf: csrf
  }), document.querySelector("#WhatIfs"));
  loadWhatIfsFromServer(csrf);
};

var setup = function setup(csrf) {
  var statsButton = document.querySelector("#statsButton");
  var listButton = document.querySelector("#listButton");
  statsButton.addEventListener("click", function (e) {
    e.preventDefault();
    createStatsWindow(csrf);
    return false;
  });
  listButton.addEventListener("click", function (e) {
    e.preventDefault();
    createListWindow(csrf);
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(WhatIfForm, {
    csrf: csrf
  }), document.querySelector("#makeWhatIf"));
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
