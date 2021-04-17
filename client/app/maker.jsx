const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="str">Str: </label>
            <input id="domoStr" type="text" name="str" placeholder="Domo Str"/>
            <label htmlFor="int">Int: </label>
            <input id="domoInt" type="text" name="int" placeholder="Domo Int"/>
            <label htmlFor="dex">Dex: </label>
            <input id="domoDex" type="text" name="dex" placeholder="Domo Dex"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoStats = (props) => {
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    let oldest = props.domos[0];
    let youngest = props.domos[0];
    let strongest = props.domos[0];
    let smartest = props.domos[0];
    let fastest = props.domos[0];
    let mostPower = props.domos[0];
    let weakest = props.domos[0];
    let totalStats = props.domos[0].str + props.domos[0].int + props.domos[0].dex;
    let totalAge = props.domos[0].age;

    for(let i = 1; i < props.domos.length; i+=1){
        if(props.domos[i].age > oldest.age){
            oldest = props.domos[i];
        }
        if(props.domos[i].age < youngest.age){
            youngest = props.domos[i];
        }
        if(props.domos[i].str > strongest.str){
            strongest = props.domos[i];
        }
        if(props.domos[i].int > smartest.int){
            smartest = props.domos[i];
        }
        if(props.domos[i].dex > fastest.dex){
            fastest = props.domos[i];
        }
        if(props.domos[i].str + props.domos[i].int + props.domos[i].dex > mostPower.str + mostPower.int + mostPower.dex){
            mostPower = props.domos[i];
        }
        if(props.domos[i].str + props.domos[i].int + props.domos[i].dex < weakest.str + weakest.int + weakest.dex){
            weakest = props.domos[i];
        }
        totalStats += props.domos[i].str + props.domos[i].int + props.domos[i].dex;
        totalAge += props.domos[i].age;
    }

    return (
        <div id="domoStats">
            <h3 id="stat">Oldest: {oldest.name} | Age: {oldest.age}</h3>
            <h3 id="stat">Youngest: {youngest.name} | Age: {youngest.age}</h3>
            <h3 id="stat">Srongest: {strongest.name} | Str: {strongest.str}</h3>
            <h3 id="stat">Smartest: {smartest.name} | Int: {smartest.int}</h3>
            <h3 id="stat">Speediest: {fastest.name} | Dex: {fastest.dex}</h3>
            <h3 id="stat">Most Powerful: {mostPower.name} | Stat Total: {mostPower.str + mostPower.int + mostPower.dex}</h3>
            <h3 id="stat">Weakest: {weakest.name} | Stat Total: {weakest.str + weakest.int + weakest.dex}</h3>
            <h3 id="stat">Total Stats: {totalStats}</h3>
            <h3 id="stat">Total Age: {totalAge}</h3>
            <h3 id="stat">Total Domos: {props.domos.length}</h3>
        </div>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Str: {domo.str} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>  
                <h3 className="domoAge"> Dex: {domo.dex} </h3>
                <h3 className="domoAge"> Int: {domo.int} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector('#domos')
        );
    });
};

const createStatsWindow = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoStats domos={data.domos} />,
            document.querySelector("#domos")
        );
    });
};

const createListWindow = () => {
    ReactDOM.render(
        <DomoList domos={[]} />, 
        document.querySelector("#domos")
    );
    loadDomosFromServer();
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
        <DomoForm csrf={csrf} />, 
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, 
        document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});