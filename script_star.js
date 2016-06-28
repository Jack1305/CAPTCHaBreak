function iHaveAMouse()
{
  if(isTouch) isTouch=false;
  else return;
  //rimuoviamo i controlli touch
  canvas.removeEventListener("touchmove", mossoTap);
  canvas.removeEventListener("touchstart", cliccatoTap);
  canvas.removeEventListener("touchend", rilasciatoTap);
  //aggiungiamo i controlli del mouse
  canvas.addEventListener('mousemove', anima ,false);
  canvas.addEventListener('click', controlla, false);

  //rimuoviamo cose visibili
  var checkmobile=document.getElementById("mobilecheck");
  checkmobile.style.display="none";
  var mobilefix=document.getElementById("iHaveAMouse");
  mobilefix.style.display="none";
}
function isTouchSupported() {
  var msTouchEnabled = window.navigator.msMaxTouchPoints;
  var generalTouchEnabled = "ontouchstart" in document.createElement("div");

  if (msTouchEnabled || generalTouchEnabled) {
    return true;
  }
  return false;
}
var isTouch=isTouchSupported();
//document.title=isTouch;
//variabili globali di struttura
var canvas = document.getElementById("captcha");
var vertex = [];
var bigVertex = [];
var nvertex=0;
var lines;

var pointSize=4;
var bigPointSize=14;
var oldX=0;
var oldY=0;
var nControlli=0;
//attiva i controlli mobile
var checkmobile=document.getElementById("mobilecheck");
var instructionsmobile=document.getElementById("mobileinstructions");
if(isTouch) checkmobile.style.display="inline";
else
{
  checkmobile.style.display="none";
  instructionsmobile.style.display="none";
  var mobilefix=document.getElementById("iHaveAMouse");
  mobilefix.style.display="none";
}
var canvas = document.getElementById("captcha");
var virtualMouseX=0;
var virtualMouseY=0;
var virtualMousePic=new Image();
virtualMousePic.src="mouse.png";
var dragging=false;
var tapX,tapY,oldTapX,oldTapY;
var checkPerformed=false;
if(isTouch)
{
  canvas.addEventListener("touchmove", mossoTap);
  canvas.addEventListener("touchstart", cliccatoTap);
  canvas.addEventListener("touchend", rilasciatoTap);
  /* TODO non aggiungendoli qualcosa non funzionerà
  //aggiungiamo pure quelli del mouse, because si.
  canvas.addEventListener('mousemove', anima ,false);
  canvas.addEventListener('click', controlla, false);*/
}
else
{
  //aggiungiamo il listener del mouse
  canvas.addEventListener('mousemove', anima ,false);
  //ora il listener del click
  canvas.addEventListener('click', controlla, false);
}
function mossoTap(evt)
{
  //document.title="moving";
  evt.preventDefault();
  if(!dragging) return;
  if(checkPerformed) return;
  //dragging=true;
  oldTapX = tapX;
  oldTapY = tapY;
  tapX = evt.targetTouches[0].pageX;
  tapY = evt.targetTouches[0].pageY;
  var Xamount=Math.abs(oldTapX-tapX)/(window.innerWidth/300);
  var Yamount=Math.abs(oldTapY-tapY)/(window.innerHeight/300);

  if(oldTapX>tapX) virtualMouseX-=Xamount;
  else if(oldTapX<tapX) virtualMouseX+=Xamount;
  if(virtualMouseX<10) virtualMouseX=10;
  if(virtualMouseX>290) virtualMouseX=290;

  if(oldTapY>tapY) virtualMouseY-=Yamount;
  else if(oldTapY<tapY) virtualMouseY+=Yamount;
  if(virtualMouseY<10) virtualMouseY=10;
  if(virtualMouseY>290) virtualMouseY=290;

  disegna(virtualMouseX,virtualMouseY);
  var canvas = document.getElementById("captcha");
  var ctx = canvas.getContext("2d");
  ctx.drawImage(virtualMousePic,virtualMouseX,virtualMouseY);
}
function cliccatoTap(evt)
{
  //document.title="tapped";
  evt.preventDefault();
  dragging=true;
  tapX = evt.targetTouches[0].pageX;
  tapY = evt.targetTouches[0].pageY;
}
function rilasciatoTap(evt)
{
  //document.title="released";
  evt.preventDefault();
  dragging=false;
}
function mobilecheck()
{
  if(checkPerformed) return;
  checkPerformed=true;
  var canvas = document.getElementById("captcha");
  var ctx = canvas.getContext("2d");
  var box = document.getElementById("result");
  box.innerHTML="Checking..."+box.innerHTML;

  //rimuoviamo i listener
  canvas.removeEventListener('mousemove', anima ,false);
  canvas.removeEventListener('click', controlla ,false);

  //chiama il verify
  var fileName = "http://starcaptcha.math.un/verify.php?tx="+virtualMouseX+"&ty="+virtualMouseY;
  var txtFile;
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    txtFile = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    txtFile = new ActiveXObject("Microsoft.XMLHTTP");
  }
  txtFile.open("GET",fileName,false);
  txtFile.send();
  var txtDoc = txtFile.responseText;
  lines = txtDoc.split("\n"); // values in lines[0], lines[1]...
  if(lines[0]=="true")
  {
    box.innerHTML=box.innerHTML.replace("Checking...","<span id=\"success\">Success!</span> You're an human!");
    var stbutton = document.getElementById("startbutton");
    stbutton.value="Start!";
    stbutton.removeAttribute("disabled");
    //settiamo che ha il mouse nel form
    var usamouse=document.getElementById("mouseused");
    usamouse.value=isTouch;
  }
  else
  {
    box.innerHTML=box.innerHTML.replace("Checking...","<span id=\"failure\"> Failure!</span> Are you a robot?");
    var stbutton = document.getElementById("startbutton");
    stbutton.value="Please solve the CAPTCHA before starting the survey.";
    stbutton.setAttribute("disabled", true);
  }
}
//FINE controlli mobile
function Point(mxx, mxy, cx, myx, myy, cy) {
  //RIGA = moltiplicatoreXX moltiplicatoreXY costanteX moltiplicatoreYX moltiplicatoreYY costanteY
  this.mxx = mxx;
  this.mxy = mxy;
  this.cx = cx;
  this.myx = myx;
  this.myy = myy;
  this.cy = cy;
}
function controlla(evt) {
  var canvas = document.getElementById("captcha");
  var rect = canvas.getBoundingClientRect();
  var ctx = canvas.getContext("2d");
  var mousePos = getMousePos(canvas, evt);
  var mousex=Math.round(mousePos.x);
  var mousey=Math.round(mousePos.y);
  var box = document.getElementById("result");
  var rateit = document.getElementById("rateit");
  box.innerHTML="Checking..."+box.innerHTML;

  //rimuoviamo i listener
  canvas.removeEventListener('mousemove', anima ,false);
  canvas.removeEventListener('click', controlla ,false);

  //chiama il verify

  console.log(mousex + " | " + mousey);
  var fileName = "http://starcaptcha.math.unipd.it/verify.php?tx="+mousex+"&ty="+mousey;
  var txtFile;
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    txtFile = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    txtFile = new ActiveXObject("Microsoft.XMLHTTP");
  }
  txtFile.open("GET",fileName,false);
  txtFile.send();
  var txtDoc = txtFile.responseText;
  lines = txtDoc.split("\n"); // values in lines[0], lines[1]...
  if(lines[0]=="true")
  {
    box.innerHTML=box.innerHTML.replace("Checking...","<span id=\"success\">Success!</span> You're an human!");
    var stbutton = document.getElementById("startbutton");
    stbutton.value="Start!";
    stbutton.removeAttribute("disabled");
    stbutton.style.background="lightgreen";
    //settiamo che ha il mouse nel form
    var usamouse=document.getElementById("mouseused");
    usamouse.value=isTouch;
  }
  else
  {
    box.innerHTML=box.innerHTML.replace("Checking...","<span id=\"failure\"> Failure!</span> Are you a robot?");
    var stbutton = document.getElementById("startbutton");
    stbutton.value="Please solve the CAPTCHA before starting the survey.";
    stbutton.setAttribute("disabled", true);
    stbutton.style.background="lightred";
  }
}
function anima(evt) {
  var ctx = canvas.getContext("2d");
  var mousePos = getMousePos(canvas, evt);
  var mousex=mousePos.x;
  var mousey=mousePos.y;
  //puliamo il canvas
  disegna(mousex,mousey);
}
function bug_workaround() {
  canvas.style.opacity = 0.99;
  setTimeout(function() {
    canvas.style.opacity = 1;
  }, 1);
}

function compute_coords(mousex, mousey) {
  var coords = Array(vertex.length + bigVertex.length);

  //draw everything
  for(i=0;i<vertex.length;i++)
  {
    x=vertex[i].mxy*mousey/100000+vertex[i].mxx*mousex/100000+vertex[i].cx-pointSize/2;
    y=vertex[i].myx*mousex/100000+vertex[i].myy*mousey/100000+vertex[i].cy-pointSize/2;

    coords[i] = [x, y];
  }

  for(i=0;i<bigVertex.length;i++)
  {
    x=bigVertex[i].mxy*mousey/100000+bigVertex[i].mxx*mousex/100000+bigVertex[i].cx-bigPointSize/2;
    y=bigVertex[i].myx*mousex/100000+bigVertex[i].myy*mousey/100000+bigVertex[i].cy-bigPointSize/2;

    coords[vertex.length + i] = [x, y];
  }

  return coords;
}

function compute_fill_ratio(coords, num_bins) {
  // canvas.width .height

  var CNT = Array(num_bins);
  for(var i = 0; i < num_bins; ++i) {
    CNT[i] = Array(num_bins);
    for(var j = 0; j < num_bins; ++j)
      CNT[i][j] = 0;
  }

  //  debugger;

  var bin_size = canvas.width / num_bins;
  for(var i = 0; i < coords.length; ++i) {
    var bin_x = Math.floor(coords[i][0] / bin_size);
    var bin_y = Math.floor(coords[i][1] / bin_size);

    if (0 <= bin_x && bin_x < num_bins && 0 <= bin_y && bin_y < num_bins)
      CNT[bin_x][bin_y] += 1;
  }

  var sum = 0;
  for(var i = 0; i < num_bins; ++i)
    for(var j = 0; j < num_bins; ++j)
      if (CNT[i][j] > 0)
        sum = sum + 1;

  return sum / (num_bins * num_bins);
}

function find_min_fill_ratio(num_bins) {
  var step = 5;
  var best = [0, 0, 100];
  for(var can_x = 0; can_x < canvas.width; can_x += step)
    for(var can_y = 0; can_y < canvas.height; can_y += step) {
      var coords = compute_coords(can_x, can_y);

      var can_ratio = compute_fill_ratio(coords, num_bins);

      if (can_ratio < best[2])
        best = [can_x, can_y, can_ratio];
    }

  draw_coords(compute_coords(best[0], best[1]));
  return best[2];
}

function draw_coords(coords) {
  //puliamo il canvas
  // Store the current transformation matrix
  ctx.save();
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Restore the transform
  ctx.restore();
  bug_workaround();

  //draw everything
  for(i=0;i<vertex.length;i++) {
    ctx.fillRect(coords[i][0],coords[i][1],pointSize,pointSize);
  }
  for(i=0;i<bigVertex.length;i++) {
    ctx.fillRect(coords[i+vertex.length][0],coords[i+vertex.length][1],bigPointSize,bigPointSize);
  }

}

function disegna(mousex,mousey) {
  var coords = compute_coords(mousex, mousey);
  console.log(compute_fill_ratio(coords, 10));
  draw_coords(coords);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  var newX=evt.clientX - rect.left;
  var newY=evt.clientY - rect.top;
  returnX=newX;
  returnY=newY;
  return {
    x: returnX,
    y: returnY
  };
}
function parseLines(saveTo, indToStart)
{//legge lines a partire da indToStart e salva i valori in saveTo, ritorna l'indice con valore non leggibile
  i=indToStart+1;
  while(true)
  {//RIGA = moltiplicatoreXX moltiplicatoreXY costanteX moltiplicatoreYX moltiplicatoreYY costanteY
    mxx=parseInt(lines[i]);
    if(isNaN(mxx)) break;
    lines[i]=lines[i].substring(lines[i].indexOf(" ")+1);
    mxy=parseInt(lines[i]);
    lines[i]=lines[i].substring(lines[i].indexOf(" ")+1);
    cx=parseInt(lines[i]);
    lines[i]=lines[i].substring(lines[i].indexOf(" ")+1);
    myx=parseInt(lines[i]);
    lines[i]=lines[i].substring(lines[i].indexOf(" ")+1);
    myy=parseInt(lines[i]);
    lines[i]=lines[i].substring(lines[i].indexOf(" ")+1);
    cy=parseInt(lines[i]);
    saveTo.push(new Point(mxx, mxy, cx, myx, myy,cy));
    i++;
    nvertex++;
  }
  return i;
}
function load(fileName)
{
  //svuotiamo gli array
  nvertex=0;
  while(vertex.length > 0) vertex.pop();
  while(bigVertex.length > 0) bigVertex.pop();

  fileName = fileName || "getter5.php";
  fileName = 'data/' + fileName;
  var txtFile;
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    txtFile = new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    txtFile = new ActiveXObject("Microsoft.XMLHTTP");
  }
  txtFile.open("GET",fileName,false);
  txtFile.send();
  var txtDoc = txtFile.responseText;
  lines = txtDoc.split("\n"); // values in lines[0], lines[1]...
  //in lines abbiamo linea per linea i file

  var i=0;
  while(i<lines.length)
  {
    if(lines[i].substring(0,3)==="# b")
      i=parseLines(bigVertex,i);
    else if(lines[i].substring(0,3)==="# s")
      i=parseLines(vertex,i);
    else if(lines[i].substring(0,3)==="# A")
    {
      alert(lines[i]);
      i++;
    }
    else i++;
  }
  disegna(150,150);
}
function restart()
{
  box = document.getElementById("result");
  box.innerHTML="";
  load();
  if(!isTouch)
  {
    canvas.addEventListener('mousemove', anima ,false);
    //ora il listener del click
    canvas.addEventListener('click', controlla, false);
  }
  /*else
    {
    //TODO ridondante, ma serve
    canvas.addEventListener('mousemove', anima ,false);
    canvas.addEventListener('click', controlla, false);
    }*/
  checkPerformed=false;
  virtualMousePic.src="mouse.png";
}
var canvas = document.getElementById("captcha");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FFFFFF";

load();
checkPerformed=false;
