const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({width:'toggle'}, 350);
};

const redirect = (response) => {
    $("#domoMessage").animate({width:'hide'}, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) { 
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

const WhatIfSearch = function(props) {
    //console.log(props);
    if(props.whatIfs.length === 0){
        return (
            <div className="whatIfStats">
                <h3 className="emptyWhat">No What Ifs yet</h3>
            </div>
        );
    }
    //console.log(props.csrf);
    const whatifNodes = props.whatIfs.map(function(whatif) {
        //console.log(whatif.e);
        return (
            <div key={whatif._id} className="whatif">
                <div className="info">
                    <h3 > {whatif.question} </h3>
                    <h4 >Author: {whatif.author} </h4>
                    <h5 >Posted on: {whatif.createdDate} </h5>
                </div>
      
                <div className="answers">
                                    <h4>Answers: </h4>
                <ul > {whatif.answers.map((value, index) => {
                    return <li key = {index}>{value}</li>
                })} </ul>
                <form id={"answerForm"+whatif._id}
                    onSubmit={handleAnswer}
                    name="answerForm"
                    action="/addAnswer"
                    method="PUT"
                    className="answerForm"
                >
                    <input type="hidden" name="_csrf" value={props.csrf || ''} />
                    <input type="hidden" name="_id" value={whatif._id} />
                    <input className="answer" type="text" name="answer" placeholder="your answer" />  
                    <input className="answerSubmit" type="submit" value="Answer What If" />                
                </form>
                </div>


            </div>
        );
    });
    return (
        <div className="whatifList">
            {whatifNodes}
        </div>
    );
}; 

const loadAllWhatIfsFromServer = (csrf) => {
    sendAjax('GET', '/getAllWhatIfs', null, (data) => {
        //console.log(data);
        ReactDOM.render(
            <WhatIfSearch whatIfs={data.whatIf} csrf={csrf}/>, document.querySelector('#WhatIfs')
        );
    });
};

const createSearchWindow = (csrf) => {
    ReactDOM.render(
        <h1>Here is all the What Ifs</h1>,
        document.querySelector("#Content")
    );
    if(document.querySelector("#makeWhatIf") != null){
    ReactDOM.render(
        <WhatIfForm csrf={csrf} />, 
        document.querySelector("#makeWhatIf")
    );};
    
    ReactDOM.render(
        <WhatIfSearch whatIfs={[]} />, 
        document.querySelector("#WhatIfs")
    );
    loadAllWhatIfsFromServer(csrf);
};


const handleAnswer = (e) => {
    e.preventDefault();
    //console.log(e.target.answer.value);
    $("#errorMessage").animate({width:'hide'},350);

    if($("#"+e.target.id).serialize().answer == '') {
        handleError("Answer fields are required");
        return false;
    }
    //console.log($("#"+e.target.id).serialize());
    //let token = $("#"+e.target.id).serialize().csrf;
    sendAjax('PUT', $("#"+e.target.id).attr("action"), $("#"+e.target.id).serialize(), function () {
        loadAllWhatIfsFromServer(getToken());
    });
    $("#"+e.target.id)[0].reset();
    return false; 
}; 

const HomeWindow = (props) => {
    return (
        <section id="home">
            <div id="explain">
                <h1>Welcome to What IF?</h1> 
                <p>Hello and welcome</p>
                <h3>Use '/getAllWhatIfs' to recieve the list of all the questions Posted</h3>
            </div>
            <div id="preview">
                <h1>Preview:</h1>
                {/* {preview} */}
            </div>
        </section>        
    );
};

const createHomeWindow = (csrf) => {
    ReactDOM.render(
        <HomeWindow csrf={csrf} />,
        document.querySelector("#content")
    );
    ReactDOM.render(
        <hr></hr>, 
        document.querySelector("#WhatIfs")
    );
    if(document.querySelector("#makeWhatIf") != null){
        ReactDOM.render(
            <br></br>, 
        document.querySelector("#makeWhatIf")
        );
    };
};