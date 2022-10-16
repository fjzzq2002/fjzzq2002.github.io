let startX=30;
let startY=30;
let ballSize=10;
let startSize=15;
let width;
let height;
let initSpeed=5;
let border=2;
let hasInit=0;

const scales=[["C","D","E","G","A"],["C","D","E","G","B"],["C","Eb","Gb","G","Bb"],["C","Db","F","G","Ab"]];
let curScaleId=0;
let scale=scales[curScaleId];



function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function ballColor(key) {
    const pos=key[0],oct=key[1];
    if(oct<1) oct=1;
    if(oct>9) oct=9;
    const rgb=HSVtoRGB((pos+0.5)/5,1-oct/15,0.8);
    return color(rgb.r,rgb.g,rgb.b,240);
}

// "enum"
const ObjectTypes = {
    Glass: 'Glass',
    Mirror: 'Mirror',
    Splitter: 'Splitter',
    Absorber: 'Absorber',
    Phaser: 'Phaser',
    Wrinkler: 'Wrinkler'
};

/*
each ball of form
    [x,y],[dx,dy],[pitch,octave],control
each object of form
    [x1,y1],[x2,y2],type,text
*/

let runningBalls=[];
let objects=[];
function nextScale() {
    curScaleId=(curScaleId+1)%scales.length;
    const newScale=scales[curScaleId];
    for(const obj of objects) {
        for(let i=0;i<5;++i) {
            const oldKey=scale[i],newKey=newScale[i];
            if(obj[3]=='Key '+oldKey) {
                obj[3]='Key '+newKey;
                break;
            }
        }
    }
    const oldFunc=document.getElementById('func').innerHTML;
    for(let i=0;i<5;++i) {
        const oldKey=scale[i],newKey=newScale[i];
        if(oldFunc=='Key '+oldKey) {
            document.getElementById('func').innerHTML='Key '+newKey;
            break;
        }
    }
    scale=newScale;
    document.getElementById('scale').innerHTML=scale.join(" ");
}

const clickerMap={};

function setup() {
    document.getElementById('scale').innerHTML=scale.join(" ");
    width = document.getElementById('container').offsetWidth;
    height = width/16*9;
    var canvas = createCanvas(width, height);
    objects.push([[border,border],[width-border,border],ObjectTypes.Mirror]);
    objects.push([[width-border,border],[width-border,height-border],ObjectTypes.Mirror]);
    objects.push([[width-border,height-border],[border,height-border],ObjectTypes.Mirror]);
    objects.push([[border,height-border],[border,border],ObjectTypes.Mirror]);
    objects.push([[border*5,0],[0,border*5],ObjectTypes.Mirror]);
    objects.push([[border*5,height],[0,height-border*5],ObjectTypes.Mirror]);
    objects.push([[width-border*5,0],[width,border*5],ObjectTypes.Mirror]);
   objects.push([[width-border*5,height],[width,height-border*5],ObjectTypes.Mirror]);
    const typs=['Glass','Mirror','Splitter','Wrinkler','Phaser','Absorber'];
//    const typs=['Splitter','Splitter','Splitter','Splitter','Splitter','Splitter'];
//    const typs=['Wrinkler','Wrinkler','Wrinkler','Wrinkler','Wrinkler','Wrinkler'];
    for(let i=0;i<typs.length;++i) {
        const posx=width/(typs.length+1)*(i+1);
        objects.push([[posx,height/4],[posx,height*3/4],typs[i],typs[i]]);
    }
    canvas.parent('thisbox');
    const clickers = document.getElementsByClassName('clicker');
    for(const clicker of clickers) {
        const text = clicker.innerHTML;
        console.log(text);
        var pos = text.indexOf(' ');
        const left=text.substring(0,pos+1);
        const right=text.substring(pos+1);
        const pos2=text.indexOf('/');
        if(pos2!=-1) pos=pos2;
        const simclick=text.substring(0,pos);
        clickerMap[simclick]=clicker;
        clicker.onclick = function() {
            handleKey(simclick);
        };
        clicker.innerHTML='<b>'+left+'</b>'+right;
    }
    ready = 1;
}

// https://gist.github.com/gordonwoodhull/50eb65d2f048789f9558
const segment_intersection = (x1, y1, x2,y2, x3, y3, x4, y4) => {
    const p0 = {x: x1, y: y1}, p1 ={x: x2, y: y2}, p2 = {x: x3, y: y3}, p3 = {x: x4, y: y4};
    const s10_x = p1.x - p0.x, s10_y = p1.y - p0.y,
          s32_x = p3.x - p2.x, s32_y = p3.y - p2.y
    const denom = s10_x * s32_y - s32_x * s10_y
    if(denom == 0) return undefined // collinear
    const s02_x = p0.x - p2.x,
          s02_y = p0.y - p2.y
    const s_numer = s10_x * s02_y - s10_y * s02_x
    if(s_numer < 0 == denom > 0) return undefined // no collision
    const t_numer = s32_x * s02_y - s32_y * s02_x
    if(t_numer < 0 == denom > 0) return undefined // no collision
    if(s_numer > denom == denom > 0 || t_numer > denom == denom > 0) return undefined // no collision
    // collision detected
    const t = t_numer / denom
    return {x:p0.x + (t * s10_x), y:p0.y + (t * s10_y)};
};

function newBallControl(note) {
    console.log('new ball',note);
    if(!hasInit) {
        console.log("Tone.js Init");
        const pingPong = new Tone.PingPongDelay(0.03, 0.3);
        const masterCompressor = new Tone.Compressor({
            "threshold" : -6,
            "ratio" : 3,
            "attack" : 0.5,
            "release" : 0.1
        });
        Tone.Master.chain(pingPong, masterCompressor);
        hasInit=1;
    }
    const tremolo = new Tone.Tremolo(9, 0.75).toDestination().start();
    const reverb = new Tone.Reverb().connect(tremolo);
    reverb.decay.value=1.5;
    reverb.wet.value=0;
    const osc_tri=new Tone.Oscillator(note[0]+note[1], "square").connect(reverb).start();
    const osc_st=new Tone.Oscillator(note[0]+note[1], "sawtooth").connect(reverb).start();
    osc_tri.volume.value=-30;
    osc_st.volume.value=-30;
    return {osc_tri:osc_tri,osc_st:osc_st,reverb:reverb,tremolo:tremolo};
}
function removeBallControl(control) {
    control.osc_tri.stop();
    control.osc_st.stop();
}

function pitch_change(text, ball) {
    if(!text) return;
    // console.log('pitch change',text,ball);
    if(text=='Random Note') {
        ball[2][0]=Math.floor(Math.random()*scale.length);
        console.log(ball[2][0]);
    }
    else if(text.startsWith('Key ')) {
        const newKey=text.substring(4);
        // console.log(newKey);
        if(newKey=='+1') {
            const idx=ball[2][0];
            if(idx==scale.length-1) {
                ball[2][0]=0;
                ball[2][1]++;
            }
            else ball[2][0]++;
        }
        else if(newKey=='-1') {
            const idx=ball[2][0];
            if(idx==-1) return;
            if(idx==0) {
                ball[2][0]=scale.length-1;
                ball[2][1]--;
            }
            else ball[2][0]--;
        }
        else {
            const idx=scale.indexOf(newKey);
            if(idx==-1) {
                console.log('error: invalid key',idx);
                return;
            }
            ball[2][0]=idx;
        }
    }
    else if(text.startsWith('Octave ')) {
        const newOct=text.substring(7);
        if(newOct=='+1') ball[2][1]++;
        else if(newOct=='-1') ball[2][1]--;
    }
}

function move_ball(ball) {
    const pos=ball[0], dir=ball[1], note=ball[2], control=ball[3];
    let closestIntersection=null;
    for(const object of objects) {
        const x1=object[0][0], y1=object[0][1], x2=object[1][0], y2=object[1][1];
        const itsPoint=segment_intersection(pos[0],pos[1],pos[0]+dir[0],pos[1]+dir[1],x1,y1,x2,y2);
        if(itsPoint) {
            const dis = Math.sqrt((pos[0]-itsPoint.x)**2+(pos[1]-itsPoint.y)**2);
            const intersection = {x: itsPoint.x, y: itsPoint.y, dis: dis, object: object};
            if(!closestIntersection || intersection.dis<closestIntersection.dis)
                closestIntersection=intersection;
        }
    }
    let returnBall=[ball];
    if(closestIntersection) {
        const x = closestIntersection.x, y = closestIntersection.y, object = closestIntersection.object;
        pitch_change(object[3],ball);
        pos[0]=x; pos[1]=y;
        const x1=object[0][0], y1=object[0][1], x2=object[1][0], y2=object[1][1];
        let dx=x2-x1, dy=y2-y1;
        let len=Math.sqrt(dx*dx+dy*dy);
        dx/=len; dy/=len;
        const dot=dx*dir[0]+dy*dir[1];
        const dirLen=Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]);
        let nx=dy, ny=-dx;
        if(dir[0]*nx+dir[1]*ny<0) nx=-nx, ny=-ny;
        switch(object[2]) {
            case ObjectTypes.Glass:
                break;
            case ObjectTypes.Mirror:
                dir[0]-=2*dot*dx; dir[1]-=2*dot*dy;
                dir[0]=-dir[0]; dir[1]=-dir[1];
                break;
            case ObjectTypes.Splitter:
                ball[3]="";
                returnBall.push(JSON.parse(JSON.stringify(ball)));
                returnBall[1][3]=newBallControl(ball[2]);
                ball[3]=control;
                dir[0]-=2*dot*dx; dir[1]-=2*dot*dy;
                break;
            case ObjectTypes.Absorber:
                removeBallControl(control);
                returnBall=[];
                break;
            case ObjectTypes.Phaser:
                dir[0]=nx*dirLen; dir[1]=ny*dirLen;
                break;
            case ObjectTypes.Wrinkler:
                while(1) {
                    let ang=Math.random()*Math.PI*2;
                    let sx=Math.cos(ang), sy=Math.sin(ang);
                    if(sx*nx+sy*ny<0.1) continue;
                    dir[0]=sx*dirLen; dir[1]=sy*dirLen;
                    break;
                }
                break;
        }
    }
    const goodBalls=[];
    for(const ball of returnBall) {
        ball[0][0]+=ball[1][0];
        ball[0][1]+=ball[1][1];
        if(ball[0][0]<0||ball[0][1]<0||ball[0][0]>width||ball[0][1]>height) {
            removeBallControl(ball[3]);
            continue;
        }
        goodBalls.push(ball);
        let fracY=ball[0][1]/height;
        if(fracY<0) fracY=0;
        if(fracY>1) fracY=1;
        let fracX=ball[0][0]/width;
        if(fracX<0) fracX=0;
        if(fracX>1) fracX=1;
        const control=ball[3];
        control.reverb.wet.value=fracX*0.7+0.3;
        if(ball[2][1]>9) ball[2][1]=9;
        if(ball[2][1]<1) ball[2][1]=1;
        control.osc_st.volume.value=-15+fracY*6-Math.log10(returnBall.length);
        control.osc_tri.volume.value=-15+(1-fracY)*6-Math.log10(returnBall.length);
        // the classic 5 trick
        // console.log(scale[ball[2][0]]+ball[2][1]);
        control.osc_tri.frequency.value=scale[ball[2][0]]+ball[2][1];
        control.osc_st.frequency.value=control.osc_tri.frequency.value/(2**(7/12));
    }
    return goodBalls;
}

let clicks=[];

function draw() {
    background(240,240,240);
    // dashed stroke
    stroke(0);
    strokeWeight(1);
    drawingContext.setLineDash([2, 2]);
    noFill();
    const curTyp=document.getElementById('typ').innerHTML;
    if(curTyp=='Ball') {
        ellipse(startX, startY, startSize, startSize);
    }
    else {
        if(clicks.length==1) drawingContext.setLineDash([5, 2]);
        else drawingContext.setLineDash([2, 5]);
        rect(startX-startSize/2, startY-startSize/2, startSize, startSize);
    }
    drawingContext.setLineDash([]);
    for(const object of objects) {
        noFill();
        drawingContext.setLineDash([]);
        const dx=object[1][0]-object[0][0];
        const dy=object[1][1]-object[0][1];
        const len=Math.sqrt(dx*dx+dy*dy)/2;
        const objectType = object[2];
        stroke(0,0,0,230);
        if(objectType==ObjectTypes.Absorber) {
            stroke(0,0,0,180);
            drawingContext.setLineDash([3,3]);
        }
        else if(objectType==ObjectTypes.Wrinkler) {
            stroke(0,0,0,50);
            line(object[0][0],object[0][1],object[1][0],object[1][1]);
            stroke(0,0,0,255);
            drawingContext.setLineDash([2,5]);
        }
        strokeWeight(1);
        if(objectType==ObjectTypes.Splitter) {
            stroke(0,0,0,120);
            strokeWeight(3);
        }
        else if(objectType==ObjectTypes.Glass) {
            strokeWeight(1);
        }
        if(objectType==ObjectTypes.Mirror) {
            stroke(0,0,0,80);
            const nx=dy/len, ny=-dx/len;
            // draw some lines on the side
            //rotate 45 degrees to (nx,ny)
            const c=Math.sqrt(2)/2;
            const s=Math.sqrt(2)/2;
            const nx2=c*nx+s*ny;
            const ny2=-s*nx+c*ny;
            const step=3;
            const brush=2;
            for(let i=0;i<len;i+=step) {
                let x=object[0][0]+dx/len*(i+step/2),
                    y=object[0][1]+dy/len*(i+step/2);
                line(x-nx2*brush,y-ny2*brush,x+nx2*brush,y+ny2*brush);
            }
            stroke(0,0,0,130);
        }
        if(objectType==ObjectTypes.Phaser) {
            stroke(0,0,0,150);
            const nx=dy/len, ny=-dx/len;
            // draw some lines on the side
            //rotate 45 degrees to (nx,ny)
            const c=Math.sqrt(2)/2;
            const s=Math.sqrt(2)/2;
            const step=3;
            const brush=1.5;
            for(let i=0;i<len;i+=step) {
                let x=object[0][0]+dx/len*(i+step/2),
                    y=object[0][1]+dy/len*(i+step/2);
                line(x-nx*brush,y-ny*brush,x+nx*brush,y+ny*brush);
            }
            stroke(0,0,0,0);
        }
        line(object[0][0],object[0][1],object[1][0],object[1][1]);
        const cx = (object[0][0]+object[1][0])/2;
        const cy = (object[0][1]+object[1][1])/2;
        const textt = object[3];
        if(textt!=undefined) {
            noStroke();
            fill(0);
            textAlign(CENTER, CENTER);
            text(textt, cx, cy);
        }
    }
    const tmpBall=[];
    for(const ball of runningBalls) {
        noStroke();
        strokeWeight(0);
        fill(ballColor(ball[2]));
        ellipse(ball[0][0], ball[0][1], ballSize, ballSize);
        tmpBall.push(...move_ball(ball));
    }
    runningBalls=tmpBall;
}



function mouseClicked() {
    if(mouseX<0||mouseY<0||mouseX>width||mouseY>height) return;
    const curTyp=document.getElementById('typ').innerHTML;
    if(curTyp=='Ball') {
        // launch a new ball!
        let note=[0,4];
        let dx=mouseX-startX, dy=mouseY-startY;
        let len=Math.sqrt(dx*dx+dy*dy);
        dx/=len/initSpeed; dy/=len/initSpeed;
        runningBalls.push([[startX,startY],[dx,dy],note,newBallControl(note)]);
    }
    else {
        clicks.push([mouseX,mouseY]);
        if(clicks.length==2) {
//            document.getElementById('typ').innerHTML='Ball';
            const p1=clicks[0],p2=clicks[1]; clicks=[];
            const dx=p2[0]-p1[0], dy=p2[1]-p1[1];
            const len=Math.sqrt(dx*dx+dy*dy);
            if(len<10) {
                //too short
                clicks=[];
                return;
            }
            objects.push([p1,p2,curTyp,document.getElementById('func').innerHTML]);
        }
    }
}

function handleKey(key) {
    // console.log(key);
    const clicker=clickerMap[key];
    if(clicker) {
        clicker.style.backgroundColor='rgb(230,230,230)';
        setTimeout(()=>clicker.style.backgroundColor='rgb(255,255,255)',
        100);
    }
    if(key=='Z') {
        if(objects.length>4)
            objects.pop();
    }
    if(key=='D') {
        if(runningBalls.length) {
            const back=runningBalls.pop();
            removeBallControl(back[3]);
        }
    }
    if(key=='Ctrl') {
        nextScale();
    }
    if(key=='Space') {
        document.getElementById('func').innerHTML='No Function';
    }
    for(let i=1;i<=5;++i) {
        if(key==''+i) {
            document.getElementById('func').innerHTML='Key '+scale[i-1];
        }
    }
    const typs=['Glass','Mirror','Splitter','Wrinkler','Phaser','Absorber','Ball'];
    for(const typ of typs) {
        if(key==typ[0]) {
            document.getElementById('typ').innerHTML=typ;
            clicks=[];
        }
    }
    if(key=='R')
        document.getElementById('func').innerHTML='Random Note';
    if(key=='Up')
        document.getElementById('func').innerHTML='Octave +1';
    if(key=='Down')
        document.getElementById('func').innerHTML='Octave -1';
    if(key=='Left')
        document.getElementById('func').innerHTML='Key -1';
    if(key=='Right')
        document.getElementById('func').innerHTML='Key +1';
}

function keyPressed() {
    if(keyCode==17)
        handleKey('Ctrl');
    else if(keyCode==32) //space
        handleKey('Space');
    else if(keyCode==38) //up
        handleKey('Up');
    else if(keyCode==40) //down
        handleKey('Down');
    else if(keyCode==37) //left
        handleKey('Left');
    else if(keyCode==39) //right
        handleKey('Right');
    else if(keyCode=='.'.charCodeAt(0))
        handleKey('Space');
    else if(keyCode==8)
        handleKey('D');
    else handleKey(String.fromCharCode(keyCode));
}