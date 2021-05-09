const handleWhatIf = (e) => {
    e.preventDefault();

    $("#errorMessage").animate({width:'hide'},350);

    if($("#question").val() == '') {
        handleError("All fields are required");
        return false;
    }
    console.log($("#whatIfForm").serialize());
    let token = $("#whatIfForm").serialize().csrf;
    sendAjax('POST', $("#whatIfForm").attr("action"), $("#whatIfForm").serialize(), function () {
        loadWhatIfsFromServer(token);
    });
    $("#whatIfForm")[0].reset();
    return false;
};

const handleAnswer = (e) => {
    e.preventDefault();
    //console.log(e.target.answer.value);
    $("#errorMessage").animate({width:'hide'},350);

    if($("#"+e.target.id).serialize().answer == '') {
        handleError("Answer fields are required");
        return false;
    }
    console.log($("#"+e.target.id).serialize());
    let token = $("#"+e.target.id).serialize().csrf;
    sendAjax('PUT', $("#"+e.target.id).attr("action"), $("#"+e.target.id).serialize(), function () {
        loadAllWhatIfsFromServer(token);
    });
    $("#"+e.target.id)[0].reset();
    return false;
}; 

const WhatIfForm = (props) => {
    //console.log(props);
    return (
        <form id="whatIfForm"
            onSubmit={handleWhatIf}
            name="whatIfForm"
            action="/maker"
            method="POST"
            className="whatIfForm"
        >
            <label htmlFor="question">Question: </label>
            <input id="question" type="text" name="question" placeholder="What if?" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeWhatIfSubmit" type="submit" value="Make What If" />
        </form>
    );
};


const WhatIfList = function(props) {
    //console.log(props);
    if(props.whatIfs.length === 0){
        return (
            <div className="whatIfList">
                <h3 className="emptyWhat">No What Ifs yet</h3>
            </div>
        );
    }
 
    //console.log(props.csrf);
    const whatifNodes = props.whatIfs.map(function(whatif) {
        //console.log(whatif);
        return (
            <div key={whatif._id} className="whatif">
                <h3 > {whatif.question} </h3>
                <h4 >Author: {whatif.author} </h4>
                <h5 >Posted on: {whatif.createdDate} </h5>
                <h4>Answers: </h4>
                <ol > {whatif.answers.map((value, index) => {
                    return <li key = {index}>{value}</li>
                })} </ol>
                {/* <input className="delete" type="submit" value="Delete" onClick={deleteWhatIf}/>       */}
                <form id={"deleteForm"+whatif._id}
                    onSubmit={deleteWhatIf}
                    name="deleteForm"
                    action="/maker"
                    method="DELETE"
                    className="deleteForm"
                >
                    <input type="hidden" name="_id" value={whatif._id} readOnly={true} />
                    <input type="hidden" name="_csrf" value={props.csrf || ''} readOnly={true}/>
                    <input className="delete" type="submit" value="Delete" />                    
                </form>

            </div>
        );
    });
    return (
        <div className="whatifList">
            {whatifNodes}
        </div>
    );
}; 

const WhatIfStats = function(props) {
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
                <h3 > {whatif.question} </h3>
                <h4 >Author: {whatif.author} </h4>
                <h5 > {whatif.createdDate} </h5>
                <ol > {whatif.answers.map((value, index) => {
                    return <li key = {index}>{value}</li>
                })} </ol>
                <form id={"answerForm"+whatif._id}
                    onSubmit={handleAnswer}
                    name="answerForm"
                    action="/addAnswer"
                    method="PUT"
                    className="answerForm"
                >
                    <input type="hidden" name="_csrf" value={props.csrf || ''} />
                    <input type="hidden" name="_id" value={whatif._id} />
                    <input id="answer" type="text" name="answer" placeholder="your answer" />  
                    <input className="answerSubmit" type="submit" value="Answer What If" />                
                </form>

            </div>
        );
    });
    return (
        <div className="whatifList">
            {whatifNodes}
        </div>
    );
}; 

const loadWhatIfsFromServer = (csrf) => {
    sendAjax('GET', '/getWhatIfs', null, (data) => {
        //console.log(data);
        ReactDOM.render(
            <WhatIfList whatIfs={data.whatIf} csrf={csrf} />, document.querySelector('#WhatIfs')
        );
    });
};

const loadAllWhatIfsFromServer = (csrf) => {
    sendAjax('GET', '/getAllWhatIfs', null, (data) => {
        //console.log(data);
        ReactDOM.render(
            <WhatIfStats whatIfs={data.whatIf} csrf={csrf}/>, document.querySelector('#WhatIfs')
        );
    });
};

const deleteWhatIf = (e) => {
    console.log($("#"+e.target.id).serialize());
    let token = $("#"+e.target.id).serialize().csrf;
    e.preventDefault();
    sendAjax('DELETE', '/maker', $("#"+e.target.id).serialize(), function () {
        loadWhatIfsFromServer(token);
    });
};

const createStatsWindow = (csrf) => {
    ReactDOM.render(
        <WhatIfStats whatIfs={[]} />, 
        document.querySelector("#WhatIfs")
    );
    loadAllWhatIfsFromServer(csrf);
};

const createListWindow = (csrf) => {
    ReactDOM.render(
        <WhatIfList whatIfs={[]} csrf={csrf}/>, 
        document.querySelector("#WhatIfs")
    );
    loadWhatIfsFromServer(csrf);
}

const setup = function(csrf) {
    const statsButton = document.querySelector("#statsButton");
    const listButton = document.querySelector("#listButton");

    statsButton.addEventListener("click", (e) => {
        e.preventDefault();
        createStatsWindow(csrf);
        return false;
    });

    listButton.addEventListener("click", (e) => {
        e.preventDefault();
        createListWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <WhatIfForm csrf={csrf} />, 
        document.querySelector("#makeWhatIf")
    );

    ReactDOM.render(
        <WhatIfList whatIfs={[]} csrf={csrf} />, 
        document.querySelector("#WhatIfs")
    );

    loadWhatIfsFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});