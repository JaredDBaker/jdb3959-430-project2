"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "str"
    }, "Str: "), /*#__PURE__*/React.createElement("input", {
      id: "domoStr",
      type: "text",
      name: "str",
      placeholder: "Domo Str"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "int"
    }, "Int: "), /*#__PURE__*/React.createElement("input", {
      id: "domoInt",
      type: "text",
      name: "int",
      placeholder: "Domo Int"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "dex"
    }, "Dex: "), /*#__PURE__*/React.createElement("input", {
      id: "domoDex",
      type: "text",
      name: "dex",
      placeholder: "Domo Dex"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
};

var DomoStats = function DomoStats(props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet"))
    );
  }

  var oldest = props.domos[0];
  var youngest = props.domos[0];
  var strongest = props.domos[0];
  var smartest = props.domos[0];
  var fastest = props.domos[0];
  var mostPower = props.domos[0];
  var weakest = props.domos[0];
  var totalStats = props.domos[0].str + props.domos[0]["int"] + props.domos[0].dex;
  var totalAge = props.domos[0].age;

  for (var i = 1; i < props.domos.length; i += 1) {
    if (props.domos[i].age > oldest.age) {
      oldest = props.domos[i];
    }

    if (props.domos[i].age < youngest.age) {
      youngest = props.domos[i];
    }

    if (props.domos[i].str > strongest.str) {
      strongest = props.domos[i];
    }

    if (props.domos[i]["int"] > smartest["int"]) {
      smartest = props.domos[i];
    }

    if (props.domos[i].dex > fastest.dex) {
      fastest = props.domos[i];
    }

    if (props.domos[i].str + props.domos[i]["int"] + props.domos[i].dex > mostPower.str + mostPower["int"] + mostPower.dex) {
      mostPower = props.domos[i];
    }

    if (props.domos[i].str + props.domos[i]["int"] + props.domos[i].dex < weakest.str + weakest["int"] + weakest.dex) {
      weakest = props.domos[i];
    }

    totalStats += props.domos[i].str + props.domos[i]["int"] + props.domos[i].dex;
    totalAge += props.domos[i].age;
  }

  return (/*#__PURE__*/React.createElement("div", {
      id: "domoStats"
    }, /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Oldest: ", oldest.name, " | Age: ", oldest.age), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Youngest: ", youngest.name, " | Age: ", youngest.age), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Srongest: ", strongest.name, " | Str: ", strongest.str), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Smartest: ", smartest.name, " | Int: ", smartest["int"]), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Speediest: ", fastest.name, " | Dex: ", fastest.dex), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Most Powerful: ", mostPower.name, " | Stat Total: ", mostPower.str + mostPower["int"] + mostPower.dex), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Weakest: ", weakest.name, " | Stat Total: ", weakest.str + weakest["int"] + weakest.dex), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Total Stats: ", totalStats), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Total Age: ", totalAge), /*#__PURE__*/React.createElement("h3", {
      id: "stat"
    }, "Total Domos: ", props.domos.length))
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet"))
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: "domo"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, " Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, " Str: ", domo.str, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, " Age: ", domo.age, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, " Dex: ", domo.dex, " "), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, " Int: ", domo["int"], " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector('#domos'));
  });
};

var createStatsWindow = function createStatsWindow() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoStats, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var createListWindow = function createListWindow() {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
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
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
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
