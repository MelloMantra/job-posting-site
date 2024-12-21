document.addEventListener("DOMContentLoaded", () => {
    var coords = {x: 0, y: 0};
    var mouseMagnifier = 1;
    let blobs = document.querySelectorAll(".blob");
    let mouse = document.querySelector(".mouse");
    let topText = document.getElementById("topText");

    // back to top buttons
    window.onscroll = function( ) {scrollFunction()};
    topText.onclick = function( ) {topFunction()};

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    // lenis smooth scroll
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // scrolly text
    gsap.registerPlugin(ScrollTrigger);

    const splitTypes = document.querySelectorAll('.reveal-type')

    splitTypes.forEach((char,i) => {

        const text = new SplitType(char, { types: 'chars'})

        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: char,
                start: 'top 100%',
                end: 'top 50%',
                scrub: true,
                markers: false
            },
            y: -20,
            opacity: 0,
            stagger: 0.1
        });

    });

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
    
});