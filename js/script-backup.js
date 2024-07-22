function Fullscreen() {
    document.documentElement.requestFullscreen();
}
const CTFGAME = document.getElementById("GAME");
const canvas = CTFGAME.getContext("2d");
const battle = document.getElementById("battlefield");
const canvas2 = battle.getContext("2d");
document.getElementById("GAME").classList.add("hidden");
document.getElementById("battlefield").classList.add("hidden");

//ステータスLevelからHitopointなどを計算して出す予定。setstatus();
var name;
var LEVEL = 0;
var HitPoint = 0;
var HP = 0;
var Strength = 0;
var Defense = 0;
var XP = 0;
var GOLD = 0;
var potion = 1;
//canvasの設定
var field = []; //フィールドの移動可能範囲を表す。0が移動可能。1が移動不可。
var row = 23;
var col = 27;
const cellSize = 40;
//プレイヤー
var player = new Image();
player.src = "img/charactor/主人公1.png";
var PX = 4; //現在のプレイヤーのX軸値
var PY = 20; //現在のプレイヤーのY軸値
var Equip = 0;  //装備の数値三段階までつくります。
//場所の宣言
var map = [];   //こいつが世界
var stage = 1; //どこまでクリアしたかを確認するもの
var mapImg = new Image();
mapImg.src = "img/map.png";
var battleImg = new Image();
battleImg.src = "img/battle.png";
var nowplace = 1;
var placeY = [0,20,18,15,13,10, 7, 6, 9, 9, 8,12,13,15,15,14,10, 8, 6, 4, 3, 5, 7,13,15,19,20];
var placeX = [0, 4, 3, 4, 5, 6, 4, 6, 9,12,14,13,10, 8,13,17,19,18,19,13,15,21,23,23,21,15,22];
//操作に関する宣言
var operationmap = false;
var operationbattle = false;
var operationshop = false;
var menu = true;
var shop = false;
var magicscroll = false;  //ヒント
var chill = false;  //flag

document.getElementById("return").addEventListener("click", function() {
    window.location.reload();
});
document.getElementById("first").addEventListener("click", function() {     //最初から始めるを押したときの処理
    //最初の要素をdisplayから削除
    document.getElementById("title").classList.add("hidden");
    document.getElementById("revivaltext").classList.add("hidden");
    document.getElementById("revival").classList.add("hidden");
    document.getElementById("first").classList.add("hidden");
    document.getElementById("decision2").classList.add("hidden");
    document.getElementById("warning2").classList.add("hidden");
    //次の画面を表示
    document.getElementById("setname").classList.remove("hidden");
    document.getElementById("name").classList.remove("hidden");
    document.getElementById("decision").classList.remove("hidden");
    document.getElementById("return").classList.remove("hidden");
    Fullscreen();
    enemyIMG();
});

document.getElementById("decision").addEventListener("click", function() {
    name = document.getElementById("name").value;
    if(name.length<=4&&0<name.length){
        firstStatus();
        document.getElementById("warning2").classList.add("hidden");
    }else{
        warningmessage(1);
    }
});

function firstStatus(){     //新しく開始した場合にステータスセット
    document.getElementById("setname").classList.add("hidden");
    document.getElementById("name").classList.add("hidden");
    document.getElementById("decision").classList.add("hidden");
    document.getElementById("return").classList.add("hidden");
    LEVEL = 1;
    XP = 10;
    first();
    openmenu();
    selectmenu = 1;
    movemenu();
    menu = false;
    openguid();
    guid=true;
}

function first(){
    setfield();
    drawBoard();
    moveplayer();
    setstatus();
}

function setfield(){        //フィールドを作成
    document.getElementById("GAME").classList.remove("hidden");
    document.getElementById("status").classList.remove("hidden");
    for (let i = 0; i < row; i++) {
        field[i] = [];
        map[i] = [];
        for (let j = 0; j < col; j++) {
            field[i][j] = 0;
            map[i][j] = 0;
        }
    }
    CTFGAME.height = cellSize*row;
    CTFGAME.width = cellSize*col;
    setmap();
    operationmap=true;
    //nameでどれくらいずらすのか
    if(name.length==1){
        document.getElementById("battlesituation").style.marginLeft = "210px";
    }else if(name.length==2){
        document.getElementById("battlesituation").style.marginLeft = "250px";
    }else if(name.length==3){
        document.getElementById("battlesituation").style.marginLeft = "210px";
    }else{
        document.getElementById("battlesituation").style.marginLeft = "250px";
    }
}

function setmap(){
    map =[
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21, 0, 0, 0, 0, 0],//5
        [0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,18, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,22, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0,17, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,16, 0, 0, 0, 0, 0, 0, 0],//10
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,23, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,15, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 0, 0, 0,13, 0, 0, 0, 0,14, 0, 0, 0, 0, 0, 0, 0,24, 0, 0, 0, 0, 0],//15
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,26, 0, 0, 0, 0],//20
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
}
function drawBoard() {  //canvas描画。こいつがmakemapと共にゲーム盤の管理をする
    canvas.clearRect(0, 0, CTFGAME.width, CTFGAME.height);
    canvas.strokeStyle = "white";
    canvas.drawImage(mapImg,0,0);
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let x = j * cellSize;
            let y = i * cellSize;

            //canvas.setLineDash([1, 5]);
            //canvas.strokeRect(x, y, cellSize, cellSize);    //test用グリッド線
            if(map[i][j]!=0){
                canvas.font = '22px Impact';
                canvas.textAlign = 'center';
                canvas.textBaseline = 'middle'; 
                canvas.fillText(map[i][j],x+cellSize/2,y+cellSize/2);
                canvas.strokeStyle = "black";
                canvas.setLineDash([]);
                canvas.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }
    setstatus();
}

function updateCell(row, col, color) {     //updateGameBoardから渡された値に対して処理をするもの。canvasの書き換え
    const x = col * cellSize;
    const y = row * cellSize;
  
    canvas.fillStyle = color;
    canvas.fillRect(x, y, cellSize, cellSize);
    canvas.strokeStyle = '#ccc';
    canvas.setLineDash([1, 5]);
    canvas.strokeRect(x, y, cellSize, cellSize);
}
  
  
function updateGameBoard(row, col, state) {     //書き換え
    updateCell(row, col, state);
}

let pushspace2 = true;
document.addEventListener('keydown', function(event) { //キーイベント
    if(operationmap&&pushspace2){
        if(menu==true){
            if (event.key === ' ' || event.key === 'Space') {
                pushspace2 = false;
                battlestart();
                operationmap = false;
                operationbattle = true;
                setTimeout(() => {
                    pushspace2 = true;
                },500);
            } else if (event.key == 's') {

            } else if (event.key == 'ArrowLeft'||event.key == 'a') {
                if(nowplace!=1){
                    nowplace--;
                    moveplayer();
                }
            } else if (event.key == 'ArrowRight'||event.key == 'd') {
                if(nowplace!=26){
                    nowplace++;
                    moveplayer();
                }
            }
        }
        if(event.key === 'Tab'){
            event.preventDefault();
            if(menu){
                openmenu();
                selectmenu = 1;
                movemenu();
                menu = false;
            }else{
                closemenu();
            }
        }
    }
});

function moveplayer(){   //プレイヤーが動かして場所によって動作を加える
    player.width = cellSize.width;
    player.height = cellSize.height;
    if(nowplace<=stage){
        PY = placeY[nowplace];
        PX = placeX[nowplace];
        newx = PX*cellSize-cellSize/4;
        newy = PY*cellSize-cellSize/2;
        drawBoard();
        canvas.drawImage(player,newx,newy);
    }else{
        nowplace--;
    }
}

function setstatus(){
    document.getElementById("status").style.marginLeft = "-800px";
    if(10<=XP){
        document.getElementById("status").style.marginLeft = "-787px";
        if(100<=XP){
            document.getElementById("status").style.marginLeft = "-778px";
            if(1000<=XP){
                document.getElementById("status").style.marginLeft = "-770px";
            }
        }
    }
    if(10<=LEVEL){
        document.getElementById("status").style.marginLeft = "-787px";
        if(10<=XP){
            document.getElementById("status").style.marginLeft = "-775px";
            if(100<=XP){
                document.getElementById("status").style.marginLeft = "-763px";
                if(1000<=XP){
                    document.getElementById("status").style.marginLeft = "-750px";
                }
            }
        }
    }
    if(LEVEL<10){
        HitPoint = 20 + ((LEVEL-1)*2);
        Strength = 10 + ((LEVEL-1)*2);
        Defense = 10 + ((LEVEL-1)*1);
    }else if(LEVEL<25){
        HitPoint = 20 + ((LEVEL-1)*2) + ((LEVEL-1)*2);
        Strength = 10 + ((LEVEL-1)*2) + ((LEVEL-1)*1);
        Defense = 10 + ((LEVEL-1)*1) + ((LEVEL-1)*1);
    }else if(LEVEL<45){
        HitPoint = 20 + ((LEVEL-1)*2) + ((LEVEL-1)*2) + ((LEVEL-1)*1);
        Strength = 10 + ((LEVEL-1)*2) + ((LEVEL-1)*1) + ((LEVEL-1)*1);
        Defense = 10 + ((LEVEL-1)*1) + ((LEVEL-1)*1) + ((LEVEL-1)*1);
    }else{
        HitPoint = 20 + ((LEVEL-1)*2) + ((LEVEL-1)*2) + ((LEVEL-1)*1) + ((LEVEL-1)*3);
        Strength = 10 + ((LEVEL-1)*2) + ((LEVEL-1)*1) + ((LEVEL-1)*1) + ((LEVEL-1)*2);
        Defense = 10 + ((LEVEL-1)*1) + ((LEVEL-1)*1) + ((LEVEL-1)*1) + ((LEVEL-1)*2);
        if(LEVEL==50){
            HitPoint = 415;
            Strength = 315;
            Defense = 255;
        }
    }
    if(Equip==1){
        HitPoint += 10;
        Strength += 10;
        Defense += 5;
    }else if(Equip==2){
        HitPoint += 20;
        Strength += 20;
        Defense += 15;
    }else if(Equip==3){
        HitPoint += 35;
        Strength += 35;
        Defense += 25;
    }
    document.getElementById("playername").innerText = name;
    document.getElementById("level").innerText = "LEVEL："+LEVEL+"　XP："+XP+"　🧪："+potion+"個";
    document.getElementById("HP").innerText = "HP："+HitPoint;
    document.getElementById("STR").innerText = "STR："+Strength;
    document.getElementById("DEF").innerText = "DEF："+Defense;
    document.getElementById("XP").innerText = "GOLD："+GOLD;
}



//ここから戦闘処理
    var rowB = 20;
    var colB = 30;
    const cellSizeB = 40;
    var fieldB = [];
    var select = 1;
    //敵の宣言
    var enemys = [];
    var enemyHP =  [0,20,22,24,30,35,37,39,45,60,65,
                    75,85,100,140,150,200,300,275,300,450,
                    650,700,750,800,1500,2000];
    var enemySTR = [0,10,11,12,15,16,18,20,30,35,36,
                    38,40,45,55,60,80,100,125,120,140,
                    175,200,225,250,280,510];
    var enemyDEF = [0,8,9,10,15,20,20,20,33,37,40,
                    45,50,65,75,80,90,115,100,120,130,
                    175,200,225,250,325,650];
    var enemyXP = [0,2,3,4,5,6,7,8,10,13,15,
                    16,17,20,23,25,27,29,30,32,40,
                    65,77,100,150,200,9999];
    var enemyGOLD = [0,2,2,3,5,6,7,8,9,12,13,
                    14,15,20,22,24,26,30,32,35,40,
                    45,50,77,111,200,16383];
    var EHP;
    var ESTR;
    var EDEF;
    var EXP;
    var EGOLD;
    //戦闘での宣言
    var damagetext;
    var recoverytext;
    var judg=false;
    
function enemyIMG(){
    enemys = [];
        enemys.push(0);
    for(let i = 1;i<=26;i++){
        let enemy = new Image();
        enemy.src = "img/enemy/"+i+".png";
        enemys.push(enemy);
    }
    
}

function battlestart(){
    enemyIMG();
    HP = HitPoint;
    text = 1;
    judg = false;
    document.getElementById("GAME").classList.add("hidden");
    document.getElementById("battlefield").classList.remove("hidden");
    document.getElementById("battletext").classList.remove("hidden");
    document.getElementById("battlesituation").classList.remove("hidden");
    document.getElementById("nowsituation").classList.remove("hidden");
    setbattlefield();
    select = 1;
    moveArrow();
    nowstatus();
    battleflow();
    document.getElementById("battletext1").style.color = "white";
    document.getElementById("battletext2").style.color = "white";
    document.getElementById("battletext3").style.color = "white";
    document.getElementById("battletext4").style.color = "white";
    document.getElementById("battletext1").innerText = "";
    document.getElementById("battletext2").innerText = "";
    document.getElementById("battletext3").innerText = "";
    document.getElementById("battletext4").innerText = "";
    document.getElementById("battletext1").innerText = "？？？？？が現れた！！";
    EHP = enemyHP[nowplace];
    ESTR = enemySTR[nowplace];
    EDEF = enemyDEF[nowplace];
    EXP = enemyXP[nowplace];
    EGOLD = enemyGOLD[nowplace];
    battleflow();
}

function setbattlefield(){
    for (let i = 0; i < rowB; i++) {
        fieldB[i] = [];
        for (let j = 0; j < colB; j++) {
            fieldB[i][j] = 0;
        }
    }
    battle.height = cellSizeB*rowB;
    battle.width = cellSizeB*colB;
    drawBoardB();
    moveArrow();
}

function drawBoardB(){
    canvas2.clearRect(0, 0, battle.width, battle.height);
        canvas2.fillStyle = "black";
        canvas2.strokeStyle = "#cccccc";
        for (let i = 0; i < rowB; i++) {
            for (let j = 0; j < colB; j++) {
                const x = j * cellSizeB;
                const y = i * cellSizeB;

               // canvas2.fillRect(j * cellSizeB, i * cellSizeB, cellSizeB, cellSizeB);
               //canvas2.setLineDash([1, 5]);
               //canvas2.strokeRect(x, y, cellSizeB, cellSizeB);    テスト用のグリッド線
            }
        }
    let x = 11*cellSizeB;
    let y = 2*cellSizeB;
    canvas2.drawImage(battleImg,0,0);
    canvas2.drawImage(enemys[nowplace],x,y);
}

document.addEventListener('keydown', function(event) { //後でif文を書く。行動の選択
    if(operationbattle){
        if (event.key == 'ArrowUp') {
            if(select!=1){
                select--;
                moveArrow();
            }else{
                select=4;
                moveArrow();
            }
        }else if(event.key == 'ArrowDown'){
            if(select!=4){
                select++;
                moveArrow();
            }else{
                select=1;
                moveArrow();
            }
        }
    }
});

function moveArrow(){   //攻撃の選択
    drawBoardB();
    y = 14+select-1;
    x = 3;

    newx = x*cellSize;
    newy = y*cellSize;
    canvas2.font = '32px Impact';
    canvas2.textAlign = 'center';
    canvas2.textBaseline = 'middle'; 
    canvas2.fillStyle = 'white';
    canvas2.fillText("▶",newx,newy);
}

async function escape(){
    document.getElementById("battlefield").classList.add("hidden");
    document.getElementById("battletext").classList.add("hidden");
    document.getElementById("battlesituation").classList.add("hidden");
    document.getElementById("nowsituation").classList.add("hidden");
    document.getElementById("GAME").classList.remove("hidden");
    drawBoard();
    moveplayer();
    await sleep(500);
    operationbattle = false;
    operationmap = true;
}
let turn = 1;
async function battleflow(){ //戦闘の流れ
    operationbattle=false;
    let random;
    await waitkey();
    await selectbattle();
    await HPcheck();
    await sleep(250);
    await enemyturn();
    await nowstatus();
    await sleep(250);
    if(turn==2){
        if(judg==false){
        battletext(name+" は疲れて動けない",2);
        nowstatus();
        }
        await sleep(250);
        enemyturn();
        nowstatus();
        await sleep(250);
    }
    if(await HPcheck()){
        nowstatus();
        battleflow();
    }
}

async function waitkey(){
    operationbattle=true;
    return new Promise(resolve => {
        function waitKeydown(event) {
            if (operationbattle&&pushspace&&pushspace2) {
                if (event.key === ' ' || event.key === 'Space') {
                    pushspace = false;
                    operationbattle = false;
                    document.removeEventListener('keydown', waitKeydown);
                    resolve();
                    setTimeout(() => {
                        pushspace = true;
                    },500);
                }
            }
        }
        document.addEventListener('keydown', waitKeydown);
    });
}

function enemyturn(){
    random = Math.floor(Math.random() * 5) + 1;
            if(random!=1){
                damagetext = damage(3);
                if(judg==false){
                battletext("相手の攻撃！ "+name+" に"+damagetext+"ダメージ！",1);
                }
            }else{
                damagetext = damage(4);
                if(judg==false){
                battletext("相手の強攻撃！ "+name+" に"+damagetext+"ダメージ！",1);
                }
            }
            nowstatus();
            HPcheck();
}

async function selectbattle(){
    if(select==1){
        damagetext = damage(1);
        if(judg==false){
        battletext(name+" のこうげき！"+damagetext+"ダメージ！",0);
        nowstatus();
        }
        turn = 1;
        await sleep(250);
    }if(select==2){
        damagetext = damage(2);
        if(judg==false){
        battletext(name+" の急所突き！"+damagetext+"ダメージ！",0);
        nowstatus();
        }
        turn = 2;
        await sleep(250);
    }if(select==3){
        if(0<potion){
            recoverytext = recovery();
            if(judg==false){
                battletext(recoverytext+"HP回復した",0);
                nowstatus();
            }
            turn = 1;
            await sleep(250);
        }else{
            if(judg==false){
                if(document.getElementById("battletext"+text).innerText!="回復薬がない！"){
                    battletext("回復薬がない！",2);
                }
                    nowstatus();
                    await waitkey();
                    await selectbattle();
            }
        }
    }if(select==4){
        escape();
    }
}
function sleep(ms){ //動作にラグを入れるためのもの
    return new Promise(resolve => setTimeout(resolve, ms));
}

function HPcheck(){ //自分か相手が倒れてないか確認する
    if(HP<=0){
        lose();
        return false;
    }else if(EHP<=0){
        win();
        return false;
    }else{
        return true;
    }
}

var text = 1;
var colorlist = [0,0,0,0]
function battletext(String,color){  //右下のバトルのテキスト
    Color =["skyblue","red","yellow","blue"]
    if(text==1){
        text++;
        colorlist[1] = color;
        document.getElementById("battletext2").style.color = Color[colorlist[1]];
        document.getElementById("battletext2").innerText = String;
    }else if(text==2){
        text++;
        colorlist[2] = color;
        document.getElementById("battletext3").style.color = Color[colorlist[2]];
        document.getElementById("battletext3").innerText = String;
    }else if(text==3){
        text++;
        colorlist[3] = color;
        document.getElementById("battletext4").style.color = Color[colorlist[3]];
        document.getElementById("battletext4").innerText = String;
    }else{
        colorlist[0] = colorlist[1];
        colorlist[1] = colorlist[2];
        colorlist[2] = colorlist[3];
        colorlist[3] = color;
        document.getElementById("battletext1").style.color = Color[colorlist[0]];
        document.getElementById("battletext2").style.color = Color[colorlist[1]];
        document.getElementById("battletext3").style.color = Color[colorlist[2]];
        document.getElementById("battletext4").style.color = Color[colorlist[3]];
        document.getElementById("battletext1").innerText = document.getElementById("battletext2").innerText;
        document.getElementById("battletext2").innerText = document.getElementById("battletext3").innerText;
        document.getElementById("battletext3").innerText = document.getElementById("battletext4").innerText;
        document.getElementById("battletext4").innerText = String;
    }
}

function damage(pattern){   //ダメージ倍率の計算
    let damage;
    let random;
    let diameter;
    if(pattern==1){
        random = Math.floor(Math.random() * 4) + 1;
        if(random==1){
            diameter = 1;
        }else if(random==2){
            diameter = 1.15;
        }else if(random==3){
            diameter = 1.25;
        }else{
            diameter = 1.35;
        }
        damage = Math.floor(Strength*diameter) - EDEF;
        if(damage<=0){
            damage = 1;
        }
        EHP -= damage;
        return damage;
    }else if(pattern==2){
        random = Math.floor(Math.random() * 3) + 1;
        if(LEVEL<26){
            if(random==1){
                diameter = 1.65;
            }else if(random==2){
                diameter = 1.7;
            }else if(random==3){
                diameter = 1.75;
            }
            damage = Math.floor(Strength*diameter) - EDEF;
            if(damage<=0){
                damage = 1;
            }
        }else{
            if(random==1){
                diameter = 1.5;
            }else if(random==2){
                diameter = 1.55;
            }else if(random==3){
                diameter = 1.6;
            }
            damage = Math.floor(Strength*diameter) - EDEF;
            if(damage<=0){
                damage = 1;
            }
        }
        EHP -= damage;
        return damage;
    }else if(pattern==3){
        random = Math.floor(Math.random() * 4) + 1;
        if(random==1){
            diameter = 1;
            if(nowplace==26||nowplace==25){
                diameter = 1.1;
            }
        }else if(random==2){
            diameter = 1.15;
        }else if(random==3){
            diameter = 1.25;
        }else{
            diameter = 1.35;
        }
        damage = Math.floor(ESTR*diameter) - Defense;
        if(damage<=0){
            damage = 1;
        }
        HP -= damage;
        return damage;
    }else if(pattern==4){
        random = Math.floor(Math.random() * 3) + 1;
        if(nowplace!=26){
            if(random==1){
                diameter = 1.45;
            }else if(random==2){
                diameter = 1.5;
            }else if(random==3){
                diameter = 1.55;
            }
        }else{
            if(random==1){
                diameter = 1.3;
            }else if(random==2){
                diameter = 1.35;
            }else if(random==3){
                diameter = 1.4;
            }
        }
        damage = Math.floor(ESTR*diameter) - Defense;
        if(damage<=0){
            damage = 1;
        }
        HP -= damage;
        return damage;
    }
}

function recovery(){    //回復
    potion--;
    let recovery;
    if(LEVEL<25){
        if(50<=HitPoint-HP){
            recovery = 50;
            HP += recovery;
            return recovery;
        }else{
            recovery = HitPoint-HP;
            HP += recovery;
            return recovery;
        }
    }else if(LEVEL<50){
        if(100<=HitPoint-HP){
            recovery = 100;
            HP += recovery;
            return recovery;
        }else{
            recovery = HitPoint-HP;
            HP += recovery;
            return recovery;
        }
    }else{
        if(200<=HitPoint-HP){
            recovery = 200;
            HP += recovery;
            return recovery;
        }else{
            recovery = HitPoint-HP;
            HP += recovery;
            return recovery;
        }
    }
}

async function lose(){
    if(judg==false){
        judg = true;
        if(document.getElementById("battletext4").innerText!=name+" は力尽きた..."){
            battletext(name+" は力尽きた...",3);
            nowstatus();
        }
        await sleep(1000);
        await escape();
        setstatus();
    }
}

async function win(){
    if(judg==false){
        judg = true;
        enemys[nowplace].src = "img/enemy/"+nowplace+"M.png";
        await sleep(300);
        drawBoardB();
        if(document.getElementById("battletext4").innerText!="？？？？？を倒した"){
            battletext("？？？？？を倒した",2);
            nowstatus();
        }
        await sleep(300);
        battletext(EGOLD+"GOLDを獲得",2);
        nowstatus();
        await sleep(300);
        battletext(EXP+"経験値を獲得",2);
        nowstatus();
        await sleep(300);
        GOLD += EGOLD;
        if(16383<=GOLD){
            GOLD = 16383;
        }
        if(nowplace!=26||LEVEL<=50){
            if(LEVEL<50){
                XP -= EXP;
            }else{
                battletext("レベルはもう上がらない！");
                await sleep(300);
            }
            if(XP<=0){
                setXP(XP);
                battletext("レベルアップ！！",2);
                await sleep(300);
            }
            if(nowplace==stage){
                if(nowplace!=26){
                    stage++;
                    battletext("次のステージに進めるようになった",2)
                    await sleep(300);
                }
            }
        }else{
            if(LEVEL<50){
                battletext("レベルアップ！！",2);
                LEVEL = 50;
                XP = 0;
            }
        }
        if(nowplace==25&&magicscroll==false){
            magicscroll = true;
            battletext("魔法の紙片を手に入れた！");
            await sleep(300);
        }
        if(nowplace==26&&chill==false){
            chill = true;
            battletext("flagが閲覧可能になった！");
            await sleep(300);
        }
        await sleep(1000);
        await escape();
        setstatus();
    }
}

function setXP(xp){
    LEVEL+=1;
    XP = 10;
    for(let i=1;i<LEVEL;i++){
        if(i<=10){
            XP *= 1.2;
        }else if(i<=25){
            XP *= 1.1;
        }else{
            XP *=1.05;
        }
    }
    if(LEVEL==50){
        XP = 0;
    }
    XP = Math.floor(XP);
    XP -= xp;
}

function nowstatus(){
    if(HP<0){
        HP = 0;
    }
    if(text==1){
        document.getElementById("nowstatus").style.marginTop = "-100px";
    }else if(text==2){
        document.getElementById("nowstatus").style.marginTop = "-150px";
    }else if(text==3){
        document.getElementById("nowstatus").style.marginTop = "-200px";
    }else{
        document.getElementById("nowstatus").style.marginTop = "-250px";
    }
    if(judg==false){
        document.getElementById("nowstatus").innerText = "HP："+HP+"　🧪："+potion;
    }
}

//メニューの設定
var chillCNT = false;
var guid = false;
var spell = false;
var selectmenu = 1;
var selectshop = 1;

function openmenu(){
    document.getElementById("menu").classList.remove("hidden");
}

function closemenu(){
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("guid").classList.add("hidden");
    document.getElementById("shopmenu").classList.add("hidden");
    document.getElementById("savespell").classList.add("hidden");
    document.getElementById("flagdisplay").classList.add("hidden");
    guid = false;
    shop = false;
    spell = false;
    menu = true;
    chillCNT = false;
}

document.addEventListener('keydown', function(event) { //menu操作
    if(menu==false&&guid==false&&shop==false&&spell==false){
        if (event.key == 'ArrowUp') {
            if(selectmenu!=1){
                if(selectmenu==5){
                    if(chill==false){
                        selectmenu--;
                        if(magicscroll==false){
                            selectmenu--;
                        }
                    }
                }else if(selectmenu==4){
                    if(magicscroll==false){
                        selectmenu--;
                    }
                }
                selectmenu--;
                movemenu();
            }else{
                selectmenu=6;
                movemenu();
            }
        }else if(event.key == 'ArrowDown'){
            if(selectmenu!=6){
                if(selectmenu==2){
                    if(magicscroll==false){
                        selectmenu++;
                        if(chill==false){
                            selectmenu++;
                        }
                    }
                }else if(selectmenu==3){
                    if(chill==false){
                        selectmenu++;
                    }
                }
                selectmenu++;
                movemenu();
            }else{
                selectmenu=1;
                movemenu();
            }
        }else if(event.key === ' ' || event.key === 'Space') {  //menu選択した時の動作
            if(!operationbattle){
                pushspace = false;
                if(selectmenu==1){
                    openshop();
                    selectshop=1;
                    moveshop();
                    shop = true;
                }else if(selectmenu==2){
                    openguid();
                    guid=true;
                }else if(selectmenu==3){
                    window.open('tips.php', '_blank'); //ヒントのページへ
                }else if(selectmenu==4){
                    openflag();
                    chillCNT = true;
                }else if(selectmenu==5){
                    save();
                    spell = true;
                }else{
                    window.location.reload();
                }
                setTimeout(() => {
                    pushspace = true;
                },500);
            }
        }
    }
});

function movemenu(){    //menu移動した際の色変更
    if(selectmenu==1){
        document.getElementById("shop").style.color = "yellow";
        document.getElementById("operationguid").style.color = "white";
        document.getElementById("save").style.color = "white";
        document.getElementById("end").style.color = "white";
        if(magicscroll==false){
            document.getElementById("tips").style.color = "gray";
        }else{
            document.getElementById("tips").style.color = "white";
        }
        if(chill==false){
            document.getElementById("flag").style.color = "gray";
        }else{
            document.getElementById("flag").style.color = "white";
        }
    }else if(selectmenu==2){
        document.getElementById("shop").style.color = "white";
        document.getElementById("operationguid").style.color = "yellow";
        document.getElementById("save").style.color = "white";
        document.getElementById("end").style.color = "white";
        if(magicscroll==false){
            document.getElementById("tips").style.color = "gray";
        }else{
            document.getElementById("tips").style.color = "white";
        }
        if(chill==false){
            document.getElementById("flag").style.color = "gray";
        }else{
            document.getElementById("flag").style.color = "white";
        }
    }else if(selectmenu==3){
        document.getElementById("shop").style.color = "white";
        document.getElementById("operationguid").style.color = "white";
        document.getElementById("save").style.color = "white";
        document.getElementById("end").style.color = "white";
        document.getElementById("tips").style.color = "yellow";
        if(chill==false){
            document.getElementById("flag").style.color = "gray";
        }else{
            document.getElementById("flag").style.color = "white";
        }
    }else if(selectmenu==4){
        document.getElementById("shop").style.color = "white";
        document.getElementById("operationguid").style.color = "white";
        document.getElementById("save").style.color = "white";
        document.getElementById("end").style.color = "white";
        document.getElementById("flag").style.color = "yellow";
        if(magicscroll==false){
            document.getElementById("tips").style.color = "gray";
        }else{
            document.getElementById("tips").style.color = "white";
        }
    }else if(selectmenu==5){
        document.getElementById("shop").style.color = "white";
        document.getElementById("operationguid").style.color = "white";
        document.getElementById("save").style.color = "yellow";
        document.getElementById("end").style.color = "white";
        if(magicscroll==false){
            document.getElementById("tips").style.color = "gray";
        }else{
            document.getElementById("tips").style.color = "white";
        }
        if(chill==false){
            document.getElementById("flag").style.color = "gray";
        }else{
            document.getElementById("flag").style.color = "white";
        }
    }else{
        document.getElementById("shop").style.color = "white";
        document.getElementById("operationguid").style.color = "white";
        document.getElementById("save").style.color = "white";
        document.getElementById("end").style.color = "yellow";
        if(magicscroll==false){
            document.getElementById("tips").style.color = "gray";
        }else{
            document.getElementById("tips").style.color = "white";
        }
        if(chill==false){
            document.getElementById("flag").style.color = "gray";
        }else{
            document.getElementById("flag").style.color = "white";
        }
    }
}

function openflag(){
    fetch('flag.php')
            .then(response => response.text())
            .then(flag => {
                document.getElementById('flagtext').innerText = flag;   //flag
            })
            .catch(error => console.error('Error:', error));
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("flagdisplay").classList.remove("hidden");
}
function openguid(){
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("guid").classList.remove("hidden");
}

function openshop(){
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("shopmenu").classList.remove("hidden");
}

let pushspace = true;
document.addEventListener('keydown', function(event) {  //shopのmenu
    if(shop){
        if (event.key == 'ArrowUp') {
            if(selectshop!=1){
                selectshop--;
                moveshop();
            }else{
                selectshop = 3;
                moveshop();
            }
        }else if(event.key == 'ArrowDown'){
            if(selectshop!=3){
                selectshop++;
                moveshop();
            }else{
                selectshop = 1;
                moveshop();
            }
        }else if((event.key === ' ' || event.key === 'Space')&&pushspace) {
            pushspace = false;
            if(selectshop==1){
                if(Equip==0){
                    if(100<=GOLD){
                        GOLD -= 100;
                        Equip++;
                        setstatus(1);
                        player.src = "img/charactor/主人公2.png";
                        document.getElementById("shop1").innerText = "装備アップグレード(1000GOLD)";
                    }else{
                        warning(1);
                    }
                }else if(Equip==1){
                    if(1000<=GOLD){
                        GOLD -= 1000;
                        Equip++;
                        setstatus();
                        player.src = "img/charactor/主人公3.png";
                        document.getElementById("shop1").innerText = "装備アップグレード(10000GOLD)";
                    }else{
                        warning(1);
                    }
                }else if(Equip==2){
                    if(10000<=GOLD){
                        GOLD -= 10000;
                        Equip++;
                        setstatus();
                        player.src = "img/charactor/主人公4.png";
                        document.getElementById("shop1").innerText = "装備レベルはMAXです";
                    }else{
                        warning(1);
                    }
                }
                Equipshop();
            }else if(selectshop==2){
                if(50<=GOLD){
                    if(potion<5){
                        GOLD -= 50;
                        potion++;
                        setstatus();
                    }else{
                        warning(2);
                    }
                }else{
                    warning(1);
                }
            }else{
                closemenu();
            }
            setTimeout(() => {
                pushspace = true;
            },300);
        }
    }
});

async function Equipshop(){
    await sleep(300);
    moveplayer();
}
function moveshop(){
    if(selectshop==1){
        document.getElementById("shop1").style.color = "yellow";
        document.getElementById("shop2").style.color = "white";
        document.getElementById("endshop").style.color = "white";
    }else if(selectshop==2){
        document.getElementById("shop1").style.color = "white";
        document.getElementById("shop2").style.color = "yellow";
        document.getElementById("endshop").style.color = "white";
    }else{
        document.getElementById("shop1").style.color = "white";
        document.getElementById("shop2").style.color = "white";
        document.getElementById("endshop").style.color = "yellow";
    }
}

async function warning(j){
    if(j==1){
        document.getElementById("warning").innerText = "GOLDが足りません";
        document.getElementById("warning").classList.remove("hidden");
        await sleep(2000);
        document.getElementById("warning").classList.add("hidden");
    }else{
        document.getElementById("warning").innerText = "ポーションは5個までしか持てません";
        document.getElementById("warning").classList.remove("hidden");
        await sleep(2000);
        document.getElementById("warning").classList.add("hidden");
    }
}

async function warningmessage(i){  //記入ミスがあった場合のエラーメッセージ
    if(i==1){
        document.getElementById("warning2").classList.remove("hidden");
        document.getElementById("warning2").style.marginLeft = "180px";
        document.getElementById("warning2").style.marginTop = "-100px";
        document.getElementById("warning2").innerText = "※1～4文字で入力してください！"
        await sleep(2000);
        document.getElementById("warning2").classList.add("hidden");
    }else if(i==2){
        document.getElementById("warning2").classList.remove("hidden");
        document.getElementById("warning2").style.marginLeft = "380px";
        document.getElementById("warning2").style.marginTop = "-120px";
        document.getElementById("warning2").innerText = "※じゅもんが違います！"
        await sleep(2000);
        document.getElementById("warning2").classList.add("hidden");
    }
}

function openspell(){
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("savespell").classList.remove("hidden");
}

//ここからsave処理

function save(){    //saveを押したときの処理
    openspell();
    //受け渡す値 name(1~4文字)・LEVEL(1~50)・XP(1以上1023以下)・GOLD(0以上16383以下)・potion(0以上5以下)・Equip(0~3)・stage(1~26)
    let savetext = statespell();
    document.getElementById("revivalspell").innerText = savetext;      //ここで<p>の内容を変更する
}

document.getElementById("decision2").addEventListener("click", function() {  //ふっかつの呪文を記入し決定を押したときの処理
    spell = document.getElementById("revival").value;
    if(12<=spell.length&&spell.length<=15){
        decryption();
        if(99<LEVEL||26<stage||5<potion){
            warningmessage(2);
            LEVEL = 0;
            XP = 0;
            GOLD = 0;
            potion = 1;
            Equip = 0;
            stage = 0;
        }else{
            //装備の設定
            if(Equip==1){
                    player.src = "img/charactor/主人公2.png";
                    document.getElementById("shop1").innerText = "装備アップグレード(1000GOLD)";
            }else if(Equip==2){
                    player.src = "img/charactor/主人公3.png";
                    document.getElementById("shop1").innerText = "装備アップグレード(10000GOLD)";
            }else if(Equip==3){
                    player.src = "img/charactor/主人公4.png";
                    document.getElementById("shop1").innerText = "装備レベルはMAXです";
            }
            document.getElementById("title").classList.add("hidden");
            document.getElementById("revivaltext").classList.add("hidden");
            document.getElementById("revival").classList.add("hidden");
            document.getElementById("first").classList.add("hidden");
            document.getElementById("decision2").classList.add("hidden");
            Fullscreen();
            enemyIMG();
            first();
            Equipshop();
            openmenu();
            closemenu();
        }
    }else{
        warningmessage(2);
    }
});

//じゅもん処理
var bitcipher = ["0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111"];
var stringcipher = ["し", "に", "て", "は", "く", "ま", "い", "す", "ち", "と", "り", "ぬ", "ね", "ふ", "む", "あ"];

function statespell(){
    let statespell = "000";
    statespell += LEVEL.toString(2).padStart(7,"0");
    statespell += XP.toString(2).padStart(10,"0");
    statespell += GOLD.toString(2).padStart(14,"0");
    statespell += potion.toString(2).padStart(3,"0");
    statespell += Equip.toString(2).padStart(2,"0");
    statespell += stage.toString(2).padStart(5,"0");
    let cipher = [];
    for(let i=0;i<statespell.length;i+=4){
        cipher.push(statespell.substring(i,i+4));
    }
    for(let i=0;i<cipher.length;i++){
        for(let j=0;j<bitcipher.length;j++){
            if(cipher[i]==bitcipher[j]){
                cipher[i] = stringcipher[j];
            }
        }
    }
    let cipherchr = changebit(name);
    for(let i of cipher){
        cipherchr += i;
    }
    return cipherchr;
}

function changebit(str){
    let namearray = str.split("");
    let namespell = "";
    for(i of namearray){
        let bit = i.codePointAt(0).toString(2);
        if(bit.slice(bit.length-4,bit.length-3)=="1"){
            middle1 = bit.slice(0,bit.length-4)+"0"+bit.slice(bit.length-3,bit.length);
        }else{
            middle1 = bit.slice(0,bit.length-4)+"1"+bit.slice(bit.length-3,bit.length);
        }
        namespell += String.fromCodePoint(parseInt(middle1.toString(2),2));
    }
    return namespell;
}

function decryption(){
    let namecry = spell.slice(0,4-(15-spell.length));
    let ciphercry = spell.slice(4-(15-spell.length));
    name = changebit(namecry);
    let cipherbit = ciphercry.split("");
    for(let i=0;i<cipherbit.length;i++){
        for(let j=0;j<stringcipher.length;j++){
            if(cipherbit[i] == stringcipher[j]){
                cipherbit[i] = bitcipher[j];
            }
        }
    }
    let cipherchr = "";
    for(let i of cipherbit){
        cipherchr += i;
    }
    statedecryption(cipherchr);
}

function statedecryption(number){
    let ciphernumber = [number.slice(0,3),number.slice(3,10),number.slice(10,20),number.slice(20,34),number.slice(34,37),number.slice(37,39),number.slice(39,44)];
    for(let i=0;i<ciphernumber.length;i++){
        ciphernumber[i] = parseInt(ciphernumber[i],2);
    }
    LEVEL = ciphernumber[1];
    XP = ciphernumber[2];
    GOLD = ciphernumber[3];
    potion = ciphernumber[4];
    Equip = ciphernumber[5];
    stage = ciphernumber[6];
}