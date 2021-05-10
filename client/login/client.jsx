//handles a user logging in to their account
const handleLogin = (e) => {
    e.preventDefault();

    $("#whatIfMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};
// handles the creation of new accounts
const handleSignup = (e) => {
    e.preventDefault();

    $("#whatIfMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("RAWR! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};
// login window form
const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
            >
                <hr></hr>
            <h1>Sign In</h1>
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="usename"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign in" />

        </form>
    );
};

// Sign up window form
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
            >
                <hr></hr>
            <h1>Sign Up</h1>
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="usename"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign in" />
            
        </form>
    );
};


 // creates the login window
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
    ReactDOM.render(
        <hr></hr>, 
        document.querySelector("#WhatIfs")
    );
};
//creates the signin window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
    ReactDOM.render(
        <hr></hr>, 
        document.querySelector("#WhatIfs")
    );
};


// Sets up the prelogin pages
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginbutton");
    const signupButton = document.querySelector("#signupButton");
    const homeButton = document.querySelector("#homeButton");
    const searchButton = document.querySelector("#searchButton");
    if(signupButton != null) {
        signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
        });     
    }

    if(loginButton != null) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
    }
    if(homeButton != null) {
        homeButton.addEventListener("click", (e) => {
            e.preventDefault();
            createHomeWindow(csrf);
            return false;
        });
    }
    if(searchButton != null) {
        searchButton.addEventListener("click", (e) => {
            e.preventDefault();
            createSearchWindow(csrf);
        });
    }
    createHomeWindow(csrf); //default view
}

const getToken = () => {
    sendAjax('GET', "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});