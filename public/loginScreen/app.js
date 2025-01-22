document.addEventListener("DOMContentLoaded", function () {
    email = document.getElementById("email");
    password = document.getElementById("password");
    rememberbox = document.getElementById("rememberbox");
    bademail = document.getElementById("bademail");
    badpw = document.getElementById("badpw");
    const loginType = window.location.pathname.split('/').pop();

    if (loginType == "company") {
        const goToOtherLogin = document.getElementById("goToOtherLogin");
        goToOtherLogin.innerText = "Looking for employee log in?";
        const goToOtherLoginLink = document.getElementById("goToOtherLoginLink");
        goToOtherLoginLink.href = "../login/user";
        const loginText = document.getElementById("logintext");
        loginText.innerText = "to Jobify for Companies";
    } else if (loginType == "user") {
        const goToOtherLogin = document.getElementById("goToOtherLogin");
        goToOtherLogin.innerText = "Looking for company log in?";
        const goToOtherLoginLink = document.getElementById("goToOtherLoginLink");
        goToOtherLoginLink.href = "../login/company";
        const loginText = document.getElementById("logintext");
        loginText.innerText = "to Jobify for Employees";
    }

    // cookie
    checkCookie();

    // text field listeners
    email.addEventListener("blur", checkemail);
    password.addEventListener("blur", checkpw);

    email.addEventListener("focus", function() {
        email.style.boxShadow = "0 0 3px 1px rgb(77, 149, 217)"
    });
    password.addEventListener("focus", function() {
        password.style.boxShadow = "0 0 3px 1px rgb(77, 149, 217)"
    });

});

// email validation
function isValidEmail(str) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+[^\s@]+$/;
    return regex.test(str);;
}

// cookie management functions
function setCookie()
{
    var cname = "email";
    var cvalue = document.getElementById("email").value;
    var exdays = 1;
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname+"="+cvalue+"; "+expires+"; Secure; SameSite=Strict";
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "";
}

function checkCookie()
{
    var email = getCookie("email");
    if (email != "")
    {
        document.getElementById("email").value = email;
        document.getElementById("rememberbox").checked = true;
    }
}

// login form submit function
async function submit() {
    if (rememberbox.checked) {
        setCookie();
        console.log("cookie stored. yum!");
    }
    goodemail = checkemail();
    goodpw = checkpw()
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    if (goodemail && goodpw) {
        const loginType = window.location.pathname.split('/').pop();
        console.log(loginType);
        try {
            if (loginType == "user") {
                const response = await fetch('../api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email.value, password: password.value })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    alert("Login successful.");
                    console.log(data);
                    window.location.href = '/employeeDashboard';
                } else if (response.status == 401) {
                    alert("Invalid email or password");
                } else {
                    console.log(`Error: ${response.status} ${response.statusText}`);
                    alert("Internal server error");
                }
            } else if (loginType == "company") {
                const response = await fetch('../api/company/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email.value, password: password.value })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    window.location.href = '../employerDashboard/';
                } else if (response.status == 401) {
                    alert("Invalid email or password");
                } else {
                    console.error(`Error: ${response.status} ${response.statusText}`);
                    alert("Internal server error");
                }
            }
        } catch (err) {
            console.error('Error querying database:', err);
            alert("Internal server error");
        }
    }
}

// text input validation functions
function checkemail() {
    if (isValidEmail(email.value)) {
        bademail.style.color = "white";
        email.style.boxShadow = "none";
    } else {
        bademail.style.color = "rgb(255, 124, 124)";
        bademail.innerHTML = "Please enter a valid email";
        email.style.boxShadow = "0 0 3px 1px rgb(255, 124, 124)";
    }
    
    return isValidEmail(email.value);
}

function checkpw() {
    if (password.value!="") {
        badpw.style.color = "white";
        password.style.boxShadow = "none"
    } else {
        badpw.innerHTML = "Please enter a password";
        badpw.style.color = "rgb(255, 124, 124)";
        password.style.boxShadow = "0 0 3px 1px rgb(255, 124, 124)";
    }

    return password.value!="";
}