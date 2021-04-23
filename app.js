const w = 500;
const h = 500;

var iterations = 200;
var inverseScale = 2;
var right = 0;
var up = 0;

const gpu = new GPU();

const render = gpu.createKernel(function(max_iterations, w, h, right, up, inverseScale) {
    const initX = -inverseScale * (w / 2 - this.thread.x) / (w / 2) + right;
    const initY = inverseScale * (h / 2 - this.thread.y) / (h / 2) + up;
    var x = initX;
    var y = initY;
    var i = 0;


    while(i < max_iterations) {
        let t = y * x * 2;
        x = x * x - y * y + initX;
        y = t + initY;
        // if (x * x + y * y > 100) break;
        if (Math.abs(x + y) > 16) break;
        i++;
    }

    if(i == max_iterations) {
        this.color(0, 0, 0);
    } else {
        const nColor = i / 70;
        const r = nColor * 0.5;
        const g = nColor * r / 10;
        const b = nColor * 3;

        this.color(r, g, b);
    }
})
.setOutput([w, h])
.setGraphical(true)
.setLoopMaxIterations(500000);

const canvas = render.canvas;
document.body.prepend(canvas);

function rerender() {
    render(iterations, w, h, right, up, inverseScale);
}

rerender();


// HSL to RGB
function hsl2rgb(h,s,l) 
{
  let a= s*Math.min(l,1-l);
  let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
  return [f(0),f(8),f(4)];
}   


// inputs
const iterationsInput = document.querySelector("#iters");
iterationsInput.value = iterations;

iterationsInput.oninput = () => {
    iterations = iterationsInput.value;
    rerender();
}

// Keyboard inputs
window.addEventListener("keydown", e => {
    const { key } = e;

    switch(key.toLocaleLowerCase()) {
        case "arrowup":
            up-=0.125*inverseScale;
            rerender();
            break;
        case "arrowdown":
            up+=0.125*inverseScale;
            rerender();
            break;
        case "arrowleft":
            right-=0.125*inverseScale;
            rerender();
            break;
        case "arrowright":
            right+=0.125*inverseScale;
            rerender();
            break;
        case "]":
            inverseScale-=inverseScale*0.125;
            rerender();
            break;
        case "[":
            inverseScale+=inverseScale*0.125;
            rerender();
            break;
    }
})
