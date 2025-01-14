document.addEventListener("DOMContentLoaded", function () {
    email = document.getElementById("email");
    password = document.getElementById("password");
    rememberbox = document.getElementById("rememberbox");
    bademail = document.getElementById("bademail");
    badpw = document.getElementById("badpw");

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
function submit() {
    if (rememberbox.checked) {
        setCookie();
        console.log("cookie stored. yum!");
    }
    goodemail = checkemail();
    goodpw = checkpw()
    if (goodemail && goodpw) {
        
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