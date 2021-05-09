const handleWhatIf = (e) => {
    e.preventDefault();

    $("#errorMessage").animate({width:'hide'},350);

    if($("#question").val() == '') {
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
            <label htmlFor="question">Ask a Question: </label>
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
                <div className="info">
                    <h3 > {whatif.question} </h3>
                    <h4 >Author: {whatif.author} </h4>
                    <h5 >Posted on: {whatif.createdDate} </h5>
                </div>
                <div className="answers">
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

const deleteWhatIf = (e) => {
    //console.log($("#"+e.target.id).serialize());
    //let token = $("#"+e.target.id).serialize().csrf;
    e.preventDefault();
    sendAjax('DELETE', '/maker', $("#"+e.target.id).serialize(), function () {
        loadWhatIfsFromServer(getToken());
    });
};


const createListWindow = (csrf) => {
    ReactDOM.render(
        <h1>All of your What Ifs</h1>, 
        document.querySelector("#Content")
    );
    ReactDOM.render(
        <WhatIfForm csrf={csrf} />, 
        document.querySelector("#makeWhatIf")
    );
    ReactDOM.render(
        <WhatIfList whatIfs={[]} csrf={csrf}/>, 
        document.querySelector("#WhatIfs")
    );
    loadWhatIfsFromServer(csrf);
}

// const createHomeWindow = (csrf) => {
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

const setup = function(csrf) {
    const searchButton = document.querySelector("#searchButton");
    const listButton = document.querySelector("#listButton");
    const homeButton = document.querySelector("#homeButton");

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSearchWindow(csrf);
        return false;
    });

    listButton.addEventListener("click", (e) => {
        e.preventDefault();
        createListWindow(csrf);
        return false;
    });

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createHomeWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <WhatIfForm csrf={csrf} />, 
        document.querySelector("#makeWhatIf")
    );
    ReactDOM.render(
        <h1>All of your What Ifs</h1>, 
        document.querySelector("#Content")
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