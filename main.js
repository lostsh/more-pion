const DEBUG = false;

/**
 * Main game grid
 */
var grid = [];

function main(){
    var m = new Morpion();
}

/**
 * Morpion game main class
 */
class Morpion{
    //grid = [];
    currentPlayer = {player:true}//player one is true

    constructor(){
        console.log("[+]\tMorpion");
        
        this.build(document.querySelector(".main"));
        if(DEBUG) console.log(this.grid);
    }

    /**
     * Create the game Grid
     * and generate the grid Array
     * @param {} anchor DOM element
     */
    build(anchor) {
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");

        for(var i=0;i<3;i++){
            var line = document.createElement("tr");
            var arrayLine = [];//Cellule Array
            for(var j=0;j<3;j++){
                var cell = document.createElement("td");

                // Cellule obj
                var c = new Cellule(i, j);
                //c.dom = cell;
                c.constructor(cell, this.currentPlayer);
                arrayLine.push(c);

                cell.className = "zero";
                var span = document.createElement("span");
                span.className = "cell";
                cell.appendChild(span);

                line.appendChild(cell);
            }
            grid.push(arrayLine);//Grid append Cellule line
            tbody.appendChild(line);
        }
        table.appendChild(tbody);

        anchor.appendChild(table);
    }
}

/**
 * 
 * @param {*} lig 
 * @param {*} col 
 */
function Cellule(lig, col){
    this.lig = lig;
    this.col = col;

    this.currentPlayer;

    /**
     * 0 => Unclicked
     * 1 => player one
     * 2 => player two
     */
    this.state = 0;
    this.dom = null;
    
    var that = this;
    
    var click = function(){
        if(DEBUG) console.log("Player clicked on ("+that.col+","+that.lig+")");
        that.dom.removeEventListener("click", click);

        if(that.currentPlayer.player){
            that.cross();
            that.state = 1;
        }else{
            that.round();
            that.state = 2;
        }
        //change the current player pointer
        that.currentPlayer.player = !that.currentPlayer.player;

        victoryManager(grid);
    }

    this.constructor = function (dom, currentPlayer) {
        this.currentPlayer = currentPlayer;
        this.dom = dom;
        this.dom.addEventListener("click", click);
    }

    this.cross = function () {
        that.dom.className = "one";
    }
    this.round = function () {
        that.dom.className = "two";
    }
}

// RECURSIVE VICTORY CONDITION
/*
function isVictorious(grid, col, lig, curPlay){
    return victory(grid, col, lig, curPlay.player?1:2) > 2;
}

function victory(grid, col, lig, player){
    if (player != grid[lig][col].state) return 0;
    if(col+1 > 2 || lig+1 > 2) return 0;
    return 1 + victory(grid, col+1, lig+1, player);
}
*/

//NOOOOOOOOOOOOOOOOOOTFFINIIIISH TODOOOOOOOOOOOOOOOOOOOOOO
function victoryManager(grid) {
    var winner = victory(grid);
    switch(winner){
        case -1:
            console.log("Game still runing");
            break;
        case 0:
            console.log("No Winner TIE");
            break;                
        default :
            console.log("Winner is "+ (winner==1?"cross":"round"));
            break;                
    }
}

/**
 * Return the winner if there is one
 * return 0 if equality, no winner
 * return -1 if the game is running
 * @param {*} grid 
 */
function victory(grid) {
    var winner = 0;
    for(var i=0;i<3;i++){
        winner = line(grid, i);
        if( winner != 0 ) return winner;
        winner = column(grid, i);
        if( winner != 0 ) return winner;
    }

    winner = diagonals(grid);
    if( winner != 0 ) return winner;

    if(winner==0 && isGridFull(grid)) return 0;
    return -1;
}

/**
 * Return the player if the line
 * contains all same player
 * else return 0
 * @param {*} grid 
 * @param {*} lig 
 */
function line(grid, lig) {
    for(var i=1;i<3;i++){
        if(grid[lig][i-1].state != grid[lig][i].state) return 0;
    }
    return grid[lig][0].state;
}
/**
 * Return the player if the column
 * contains all same player
 * else return 0
 * @param {*} grid 
 * @param {*} col 
 */
function column(grid, col) {
    for(var i=1;i<3;i++){
        if(grid[i-1][col].state != grid[i][col].state) return 0;
    }
    return grid[0][col].state;
}

/**
 * Return the player if
 * the diagonal contains all same sign
 * else return 0
 * @param {*} grid 
 * @returns 0 or player number (1 or 2)
 */
function diagonals(grid) {
    /*
    var diagOneWinner = grid[0][0].state;
    var diagTwoWinner = grid[2][0].state;
    for(var i=1;i<3;i++){
        for(var j=1;j<3;j++){
            if(grid[i][j].state != grid[i-1][j-1].state) diagOneWinner = 0;
            if(grid[2-i][j].state != grid[3-i][j-1].state) diagTwoWinner = 0;
        }
    }
    console.log("diags : one:"+diagOneWinner+" two:"+diagTwoWinner);
    return diagOneWinner!=0?diagOneWinner:diagTwoWinner;*/
    var one = grid[0][0].state;
    if(one != 0 && one == grid[1][1].state && one == grid[2][2].state) return one; 
    var two = grid[0][2].state;
    if(two != 0 && two == grid[1][1].state && two == grid[2][0].state) return two;
    return 0;
}

/**
 * Return false if the grid is not full
 * @param {*} grid 
 * @returns true if the grid does not contains 0
 */
function isGridFull(grid) {
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            if(grid[j][i].state==0) return false;
        }
    }
    return true;
}

/** 
 * Launch the game
*/
main();