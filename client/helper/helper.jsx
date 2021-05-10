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

// Search page for both users logged in and not
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

// calls /getAllWhatIfs and renders a WhatIf Search page with the returned data
const loadAllWhatIfsFromServer = (csrf) => {
    sendAjax('GET', '/getAllWhatIfs', null, (data) => {
        //console.log(data);
        ReactDOM.render(
            <WhatIfSearch whatIfs={data.whatIf} csrf={csrf}/>, document.querySelector('#WhatIfs')
        );
    });
};

// creates the what if search window
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
 
//handles the answer form data from the search page what ifs
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
        createSearchWindow(getToken());
    });
    $("#"+e.target.id)[0].reset();
    return false; 
}; 

// returns the home window
const HomeWindow = (props) => {
    if(props.whatIf=== 0){
        return (
            <div className="whatIfStats">
                <h3 className="emptyWhat">No What Ifs yet</h3>
            </div>
        );
    }
    //let p = props.whatIfs[Math.floor(Math.random() *props.whatIfs.length)];
    const whatifNode = props.whatIf.map(function(whatif) {
        
        return(
            <div key={whatif._id} className="whatif">
                <div className="info">
                    <h3 > {whatif.question} </h3>
                    <h4 >Author: {whatif.author} </h4>
                    <h5 >Posted on: {whatif.createdDate} </h5>
                </div>   
            </div>
    )});
    return (
        <section id="home">
            <div id="explain">
                <h1>Welcome to What IF?</h1> 
                <p>Hello and welcome to What If? a site dedicated to the question of its name.
                    To the right you'll see an example of one such question.  To which you can answer,
                    and read other's answers.  You can also craft your own questions for others to answer, 
                    by making an account.
                </p>
                <ul>Guide:
                    <li>The Home page is a hub for finding out information and learning to use the site</li>
                    <li>The Search page is where you can find all of the What If questions users have asked to
                        browse and answer to your heart content
                    </li>
                    <li>The Login Page is where you can access your account if you have one</li>
                    <li>If you dont't have and Account go to the Sign Up Page to make one and start questioning</li>
                    <li>Once you have an acount you can access the List page which allows you to create your own What Ifs 
                         and shows you all of the What Ifs you have made
                    </li>
                </ul>
                <h3>Use '/getAllWhatIfs' to recieve the list of all the questions in JSON</h3>
            </div>
            <div id="preview">
                <h1>Preview:</h1>
                {whatifNode}
            </div>
        </section>        
    );
};

// renders out the home window along with login and maker page specific items
const createHomeWindow = (csrf) => {
    ReactDOM.render(
        <HomeWindow whatIf={[]} csrf={csrf} />,
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
    loadPreview(csrf);
};

const loadPreview = (csrf) => {
    sendAjax('GET', '/getAllWhatIfs', null, (data) => {
        //console.log(data);
        let p = data.whatIf[Math.floor(Math.random() * data.whatIf.length)];
        //console.log(p);
        ReactDOM.render(
            <HomeWindow whatIf={[p]} csrf={csrf} />, document.querySelector('#content')
        );
    });
}