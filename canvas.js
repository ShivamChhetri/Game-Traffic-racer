let canvas= document.querySelector("canvas");
let W= window.innerWidth/4;
let H= W*1.5;
canvas.width=W;
canvas.height=H;
let c= canvas.getContext('2d');

// board grid and car dimension
let w= W/6;   
let h=60;

// obstacles class 
class Obstacle{
    constructor(){
        this.x=[this.random(),this.random(),this.random(),this.random()];
        this.y= -50;
        this.dy= 4;
        this.k=4; //constant for increasing dy
        this.score=0;
        this.audio = document.createElement("audio");
    }
    random(){
        return Math.floor(Math.random()*6)*(W/6);
    }
    draw(){
        for(let i=0;i<this.x.length;i++){
            c.fillStyle="red";
            c.fillRect(this.x[i],this.y-(150*i),w,h); 
            c.fillStyle="white";
            c.fillRect(this.x[i]+w/4,this.y-(150*i)+h/4,w/2,h/2);
            c.font="bold 30px arial";
            c.fillText(Math.floor(this.score/10),3*w,30);
        }
      
    }
    update(pos){
        for(let i=0;i<this.x.length;i++){
            if( pos.y<(this.y-(150*i))+h && pos.y+h>this.y-(150*i) ){
                if( pos.x+w>this.x[i] && pos.x<this.x[i]+w ){ 
                    this.sound();
                    alert("game over\nScore:"+Math.floor(this.score/10));
                    location.reload();
                }
            }
        }
        if(this.y-(150*3)>H){
            this.x=[this.random(),this.random(),this.random(),this.random()];
            this.y=-50;
        }
        
        this.y+=this.dy;
        setInterval(this.score++,1000); 
        // increasing speed
        if(this.score/10>100){
            this.dy=this.k+Math.floor(this.score/1000);
        }
        this.draw();
    }
    sound() {
        this.audio.src = "ding.mp3";
        this.audio.setAttribute("preload", "auto");
        this.audio.setAttribute("controls", "none");
        this.audio.style.display = "none";
        document.body.appendChild(this.audio);
        this.audio.play();   
    }
} 

// players car class
class Player{
    constructor(){
        this.x= 2*w;
        this.y= 6*w;
    }
    getpos(){
        return{
            x:this.x,
            y:this.y
        }
    }
    draw(){
        c.fillStyle="blue";
        c.fillRect(this.x, this.y, w, h);
        c.fillStyle="white";
        c.fillRect(this.x+w/4, this.y+ h/4, w/2, h/2);
    }
    steer(dx,dy){
        this.x+=dx;
        this.y+=dy;
        this.draw();
    }
}

// player steering
let player= new Player();
let move=w/2;
let pos;

document.addEventListener("keydown",(event)=>{
    pos= player.getpos();
    if(event.key==="ArrowUp" && pos.y>0){
        player.steer(0,-move);
    }
    if(event.key==="ArrowDown" && pos.y<H-h){
        player.steer(0,move);
    }
    if(event.key==="ArrowLeft" && pos.x>0){
        player.steer(-move,0);
    }
    if(event.key==="ArrowRight" && pos.x<W-w){
        player.steer(move,0);
    }
});


// game loop
let obstacle= new Obstacle();
let recursion;
function animate(){
    c.clearRect(0,0,innerWidth,innerHeight);
    pos= player.getpos();  // for getting fresh x and y value of player
    obstacle.update(pos);
    player.draw();
    recursion=requestAnimationFrame(animate);
}



let start=document.getElementById("start");
let pause=document.getElementById("pause");
let restart=document.getElementById("restart");
start.addEventListener('click',()=>{
    start.style.display="none";
    pause.style.display="inline";
    animate();
});
pause.addEventListener('click',()=>{
    pause.style.display="none";
    restart.style.display="inline";
    cancelAnimationFrame(recursion);
});
restart.addEventListener('click',()=>{
    pause.style.display="inline";
    restart.style.display="none";
    requestAnimationFrame(animate);
});


