document.addEventListener("DOMContentLoaded", () => {
    var coords = {x: 0, y: 0};
    var mouseMagnifier = 1;
    let blobs = document.querySelectorAll(".blob");
    let mouse = document.querySelector(".mouse");

    // mouse followers
    blobs.forEach(function(blob) {
        blob.x = 0;
        blob.y = 0;
        blob.style.backgroundColor = "white";
    });

    document.addEventListener("mousemove", (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    // mouse animation function
    function animateBlobs() {
        let x = coords.x;
        let y = coords.y;

        mouse.style.left = x;
        mouse.style.top = y;

        blobs.forEach(function(blob, index) {
            const scrollLeft = (window.scrollX !== undefined) ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            const scrollTop = (window.scrollY !== undefined) ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;

            blob.style.left = (x - 12) + scrollLeft +"px";
            blob.style.top = (y - 12) + scrollTop + "px";
            blob.x = x;
            blob.y = y;

            blob.style.scale = ((blobs.length - index) / blobs.length) * mouseMagnifier;

            const nextBlob = blobs[index+1] || blobs[0];
            x+=(nextBlob.x - x)*0.32;
            y+=(nextBlob.y - y)*0.32;

            blob.style.zIndex = 9999 - index;
        });

        requestAnimationFrame(animateBlobs)
    }

    animateBlobs();

    // cookie
    checkCookie();
    
});

// function for matching strings with wildcard characters * = any sequence of chars, ? = any single char
function matchWildcard(str, pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(str);
}

// cookie management functions
function setCookie()
{
    checkCookie();
    var cname = "email";
    var cvalue = document.getElementById("email").value;
    var exdays = 7;
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
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
    email = document.getElementById("email");
    password = document.getElementById("password");
    rememberbox = document.getElementById("rememberbox");
    bademail = document.getElementById("bademail");
    badpw = document.getElementById("badpw");

    if (rememberbox.checked) {
        setCookie();
        console.log("cookie stored. yum!");
    }
    if (email.value.includes("@") && matchWildcard(email.value,"*.?*") && (email.value.indexOf(" ") == -1)) {
        bademail.style.color = "white";
        email.classList.remove("invalid")
    } else {
        bademail.style.color = "rgb(255, 124, 124)";
        email.classList.add("invalid")
    }
    if (password.value!="") {
        badpw.style.color = "white";
        password.classList.remove("invalid")
    } else {
        badpw.style.color = "rgb(255, 124, 124)";
        password.classList.add("invalid")
    }
}