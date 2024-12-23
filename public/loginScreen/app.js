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