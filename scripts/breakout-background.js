window.requestAnimFrame = function () {
return (callback => {
    window.setTimeout(callback);
    });
};

function background() {

    function init(elemid) {
        let canvas = document.getElementById(elemid),
            c = canvas.getContext("2d"),
            w = (canvas.width = window.innerWidth),
            h = (canvas.height = window.innerHeight);
        
        c.fillRect(0, 0, w, h);

        return { c: c, canvas: canvas };
    }

    let c = init("canvas").c,
        canvas = init("canvas").canvas,
        w = (canvas.width = window.innerWidth),
        h = (canvas.height = window.innerHeight);

    class dots {
        constructor(x, y, n) {
            this.x = x;
            this.y = y;
            this.n = n;
            this.rand = Math.random();
        }

        //shows the dots
        show() {
            c.beginPath();
            c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
            c.fillStyle = "skyblue";
            c.fill();
        }
    }

    let n = 30,
        numt = 500,
        tent = [];

    for (let i = 0; i < numt; i++) {
        tent.push(
            new dots(
                Math.random() * w,
                Math.random() * h,
                n
            )
        );
    }

    function draw() {
        for (i = 0; i < numt; i++) {
            tent[i].show();
        }
    }

    draw();
}

background();

document.addEventListener("keydown", event => {
    if (event.code == "Space") {
        background();
    }
});