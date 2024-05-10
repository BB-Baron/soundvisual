// myscript.js
function setup() {
    //
    /*
    n:
    色の指定
    フレースケールは0-255
    n1,n2,n3:
      RGB
      HSB
    css:

    */
    createCanvas(480, 240);
    // background(127);
    // background(255, 0, 0)
    // colorMode(HSB, 100);
    // background(30, 100, 80, 50);
    background('skyblue');
    noStroke();

    fill(255, 0, 0, 127);
    rect(0, 0, 100, 100);

    push();
    // translate(10, 10);
    // rotate(PI/4);
    rotate(radians(30));
    fill(0, 0, 255, 127);
    rect(0, 0, 100, 100);
    pop();
}
