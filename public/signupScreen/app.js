document.addEventListener("DOMContentLoaded", function () {
    email = document.getElementById("email");
    password = document.getElementById("password");
    phone = document.getElementById("phone");
    bademail = document.getElementById("bademail");
    badpw = document.getElementById("badpw");
    badphone = document.getElementById("badphone");
    tabs = document.getElementsByClassName("tab");
    tab = 0;

    // cookie
    checkCookie();

    // text field listeners
    email.addEventListener("blur", checkemail);
    password.addEventListener("blur", checkpw);
    email2.addEventListener("blur", checkemail);
    phone.addEventListener("blur", checkphone);

    email.addEventListener("focus", function() {
        email.style.boxShadow = "0 0 3px 1px rgb(77, 149, 217)";
    });
    password.addEventListener("focus", function() {
        password.style.boxShadow = "0 0 3px 1px rgb(77, 149, 217)";
    });
    email2.addEventListener("focus", function() {
        email2.style.boxShadow = "0 0 3px 1px rgb(77, 149, 217)";
    });
    phone.addEventListener("focus", function() {
        phone.style.boxShadow = "0 0 3px 1px rgb(77, 149, 217)";
    });

    // display only one tab
    for (var i=0; i<tabs.length; i++) {tabs[i].style.display = "none"};
    tabs[0].style.display = "flex";
});

// email validation
function isValidEmail(str) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+[^\s@]+$/;
    return regex.test(str);;
}
// phone validation
function isValidPhone(str) {
    const regex = /^\+?[1-9]\d{0,2}[-.\s]?(\(\d{1,4}\)|\d{1,4})[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return regex.test(str);;
}

// glean numbers from string
function extractNums(str) {
    var nums = ""
    for (var i=0; i<str.length(); i++) {
        if (!isNaN(str.charAt(i))) nums+=str.charAt(i);
    }
    return parseInt(nums);
}

// wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

// form progression functions
async function nextTab() {
    // check appropriate fields before proceeding
    if (tab==0) {
        var goodemail = checkemail();
        var goodpw = checkpw()
        if (goodemail && goodpw) {
            emailvalue = email.value;
            passwordvalue = password.value;
            // check to see if there is already an account with this email
            // ????????
            // continue
        } else {
            return false;
        }
    } else if (tab==1) {
        var goodphone = checkphone();
        if (goodphone) {
            firstnamevalue = document.getElementById("firstname").value;
            lastnamevalue = document.getElementById("lastname").value;
            phoneprefixvalue = extractNums(document.getElementById("phoneprefix").value);
            phonevalue = extractNums(phone.value);
            countryvaleue = document.getElementById("country").value;
            statevalue = document.getElementById("state").value;
            cityvalue = document.getElementById("city").value;
        }
    }

    // fade animation
    tabs[tab+1].style.opacity = 0;
    var duration = 300; // animation duration in ms
    var steps = 60; // frame count

    for (var i=1; i<steps; i++) {
        tabs[tab].style.opacity = 1-(i/steps);
        await wait(duration/steps)
    }
    tabs[tab].style.display = "none";
    tabs[tab+1].style.display = "flex";
    tabs[tab].style.opacity = 1;
    for (var i=1; i<steps; i++) {
        tabs[tab+1].style.opacity = i/steps;
        await wait(duration/steps)
    }
    tabs[tab+1].style.opacity = 1;

    // increment tab
    tab+=1;
}

async function prevTab() {
    // fade animation
    tabs[tab-1].style.opacity = 0;
    var duration = 300; // animation duration in ms
    var steps = 60; // frame count

    for (var i=1; i<steps; i++) {
        tabs[tab].style.opacity = 1-(i/steps);
        await wait(duration/steps)
    }
    tabs[tab].style.display = "none";
    tabs[tab-1].style.display = "flex";
    tabs[tab].style.opacity = 1;
    for (var i=1; i<steps; i++) {
        tabs[tab-1].style.opacity = i/steps;
        await wait(duration/steps)
    }
    tabs[tab-1].style.opacity = 1;

    // increment tab
    tab-=1;
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
    
    if (email.value == email2.value) {
        bademail2.style.color = "white";
        email2.style.boxShadow = "none";
    } else {
        bademail2.style.color = "rgb(255, 124, 124)";
        bademail2.innerHTML = "Emails do not match";
        email2.style.boxShadow = "0 0 3px 1px rgb(255, 124, 124)";
    }
    
    return isValidEmail(email.value);
}

function checkpw() {
    if (password.value!="") {
        badpw.style.color = "white";
        password.style.boxShadow = "none";
    } else {
        badpw.innerHTML = "Please enter a password";
        badpw.style.color = "rgb(255, 124, 124)";
        password.style.boxShadow = "0 0 3px 1px rgb(255, 124, 124)";
    }

    return password.value!="";
}

function checkphone() {
    var validPhone = isValidPhone(phone.value);
    if (validPhone) {
        badphone.style.color = "white";
        phone.style.boxShadow = "none";
    } else {
        badphone.innerHTML = "Please enter a valid phone number";
        badphone.style.color = "rgb(255, 124, 124)";
        phone.style.boxShadow = "0 0 3px 1px rgb(255, 124, 124)";
    }
    return validPhone;
}