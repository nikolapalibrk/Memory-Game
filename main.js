var wrap = document.getElementsByClassName('wrapper')[0];
var end = document.getElementsByClassName('success')[0];
var levelDiv = document.getElementsByClassName('nivo')[0];
var starter = document.getElementsByClassName('start')[0];
var timer = document.getElementsByClassName('clock')[0];
var plusTime = document.getElementsByClassName('plus')[0];
var body = document.getElementsByTagName('body')[0];
var time;
var brojevi = [];
var clicked = [];
var allSides = [];
var pogodjeni = [];
var diceNumber = [16,36,64];
var levelWidth = [80, 70, 70]
var levelFont = [26, 24, 24]
var level = 0;
var loop;

starter.addEventListener('click', game);

function game () {
  time = 100;
  timer.innerHTML = time;
  starter.style.display = "none";
  loop = setInterval(function  () {
    time--
    if(time === 0) {
      wrap.style.display = "none"
      starter.style.display = "block";
      starter.innerHTML = "Game Over"
      clearInterval(loop);
      starter.removeEventListener("click", game);
    }
    timer.innerHTML = time;
  },1000)
  pogodjeni.length = 0;
  levelDiv.style.display = "none";
  //Kreiranje polja
  function create () {
    for (var i = 1; i <= diceNumber[level] / 2; i++) {
      brojevi.push(i);
      brojevi.push(i);
    }
    var text = "";
    for (var i = 0; i < diceNumber[level]; i++) {
      text += '<div class="box"><div class="back"></div><div class="front"></div></div>';
    }
    wrap.style.width = Math.sqrt(diceNumber[level]) * levelWidth[level] + "px";
    wrap.style.height = Math.sqrt(diceNumber[level]) * levelWidth[level] + "px";
    wrap.innerHTML = text;
  }

  //popunjavanje polja random brojevima
  function fillRandom () {
    for (var i = 0; i < diceNumber[level]; i++) {
      var randomNumber = Math.floor(Math.random()*brojevi.length);
      allBoxes[i].children[0].innerHTML = brojevi[randomNumber];
      brojevi.splice(randomNumber,1);
    }
  }

  //Dodavanje event listener-a na svako polje za flip efekat
  function addListener(){
    for (var i = 0; i < allBoxes.length; i++) {
      allBoxes[i].addEventListener('click', flip)
    }
  }

  //Skidanje event listenera sa svakog polja
  function removeListener () {
    for (var i = 0; i < allBoxes.length; i++) {
      allBoxes[i].removeEventListener('click', flip)
    }
  }


  //Glavna funkcija
  function flip () {
    this.removeEventListener("click",flip);
    var back = this.children[0];
    back.style.transform = "rotateY(0)";
    var front = this.children[1];
    front.style.transform = "rotateY(-180deg)";
    allSides.push(back);
    allSides.push(front);
    clicked.push(this);
    if(clicked.length === 2) {
      removeListener();
      checkEqual();
    }
  }

  //Provera jednakosti
  function checkEqual () {
    if(allSides[0].innerHTML === allSides[2].innerHTML){
      time += 5;
      plusTime.style.animationPlayState = "running";
      setTimeout(function  () {
        plusTime.style.animationPlayState = "paused";
      },1500)
      allSides[0].style.background = "darkseagreen";
      allSides[2].style.background = "darkseagreen";
      pogodjeni.push(clicked[0]);
      pogodjeni.push(clicked[1]);
      addListener();
      for (var i = 0; i < pogodjeni.length; i++) {
        pogodjeni[i].removeEventListener("click",flip)
      }
      clicked.length = 0;
      allSides.length = 0;
    }
    else {
      setTimeout(function() {
        allSides[0].style.transform = "rotateY(180deg)";
        allSides[2].style.transform = "rotateY(180deg)";
        allSides[1].style.transform = "rotateY(0)";
        allSides[3].style.transform = "rotateY(0)";
        allSides.length = 0;
        addListener();
        for (var i = 0; i < pogodjeni.length; i++) {
          pogodjeni[i].removeEventListener("click",flip)
        }
      },600)
      clicked.length = 0;
    }
    if(pogodjeni.length === allBoxes.length){
      plusTime.style.opacity = 0;
      clearInterval(loop);
      setTimeout(function () {
        if(level<=1){
          levelDiv.style.display = "block";
          levelDiv.innerHTML = "Level " + (level + 2);
          levelDiv.addEventListener('click', game);
        }
        else {
          end.style.zIndex = 6;
          end.style.opacity = 1;
        }
        level++;
      }, 1000)
    }
  }


  create();

  var allBoxes = document.getElementsByClassName('box');

  //Vizuelna podesavanja (visina, sirina, font-size)
  for (var i = 0; i < allBoxes.length; i++) {
    allBoxes[i].style.width = levelWidth[level] + "px";
    allBoxes[i].style.height = levelWidth[level] + "px";
    allBoxes[i].children[0].style.lineHeight = levelWidth[level] + "px";
    allBoxes[i].children[0].style.fontSize = levelFont[level] + "px";
  }
  fillRandom();

  addListener();

}
