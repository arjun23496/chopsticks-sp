var cur_player=1;
var error_num=0;
var verbose = false;
var viewAllErrors = true;
var game_board = {

					"p1": {
						"l": 1,
						"r": 1
					},

					"p2": {
						"l": 1,
						"r": 1
					}
				};

var simulated_board={};

function initialize()
{
	game_board = {
					"p1": {
						"l": 1,
						"r": 1
					},

					"p2": {
						"l": 1,
						"r": 1
					}
				};
	render();
}

function gameLog(msg)
{
	if(verbose)
		console.log(msg);
}

function render()
{
	var x,y;
	console.log(game_board);
	for(x in game_board)
	{
		for(y in game_board[x])
		{
			document.getElementById(x+y).innerHTML = game_board[x][y];
		}
	}

	document.getElementById("current-player").innerHTML = "Player 1";
}

function checkCompletion()
{
	if(game_board["p1"]["l"]==0 && game_board["p1"]["r"]==0)
	{
		errorLog("you have lost")
		return true;	
	}
	else if(game_board["p2"]["l"]==0 && game_board["p2"]["r"]==0)
	{
		errorLog("you have won !!!!!!!!!")
		return true;
	}

	return false;
}

function gameLoop(move)
{
	var this_board=execMove(game_board,1,move);
	if(this_board)
	{
		game_board = this_board;
		render();

		if(checkCompletion())
		{
			return;
		}

		errorLog("AI working......");
		aiPlayer(aiCallback);
	}
}

function aiCallback(move)
{
	this_board=execMove(game_board,2,move)

	if(this_board)
	{
		game_board = this_board;
		errorLog("ai move : "+move);
		render();
		if(checkCompletion())
		{
			return;
		}
	}
	else
	{
		errorLog("ai failed "+move);
	}
}

function execMove(this_board,this_player,move)
{

	if(!move)
		return false;

	this_board = JSON.parse(JSON.stringify(this_board))
	split =false;
	opp_player = "p"+((this_player === 1 )? 2 : 1);
	this_player = "p"+this_player 

	if(move == "s")
	{
		split=true;
	}
	else
	{
		src_h = move[0];
		dest_h = move[1];
	}

	try{

		if(split)
		{
			if( (this_board[this_player]["l"]>0 && this_board[this_player]["r"]>0) 
				|| this_board[this_player]["l"]%2 !=0 
				|| this_board[this_player]["r"]%2 !=0)
				throw "invalid move"

			if(this_board[this_player]["l"]>0)
			{
				this_board[this_player]["r"]=this_board[this_player]["l"]=this_board[this_player]["l"]/2
			}
			else
			{
				this_board[this_player]["r"]=this_board[this_player]["l"]=this_board[this_player]["r"]/2	
			}
		}
		else
		{
			gameLog("execMove")
			gameLog(this_player)
			gameLog(opp_player)
			if( !this_board[opp_player][dest_h] || !this_board[this_player][src_h] )
				throw "invalid move"

			this_board[opp_player][dest_h] = (this_board[opp_player][dest_h]+this_board[this_player][src_h])%5; 
		}

		return this_board;
	}
	catch(err)
	{
		error_num=error_num+1;
		errorLog(error_num+": Invalid move");
		return false;
	}
}

function aiPlayer(callback)
{
	viewAllErrors = false;
	simulated_board = JSON.parse(JSON.stringify(game_board));
	gameLog("simulating...........................................")
	ret = minMax(simulated_board,2,0,9);
	gameLog("end simulation.......................................")
	gameLog("aiPlayer");
	gameLog(ret);
	viewAllErrors = true;
	callback(ret[1]);
}

function minMax(simulated_board,mover,sim_score,depth)
{
	var sim_pre_player = "p"+mover
	var sim_opp_player = "p"+((mover%2) + 1)
	depth = depth-1;

	gameLog("minMax start")
	gameLog("depth : "+depth)
	gameLog(sim_pre_player)
	gameLog(sim_opp_player)
	gameLog(JSON.stringify(simulated_board).substr(0,19))
	gameLog(JSON.stringify(simulated_board).substr(19,19))

	if(JSON.stringify(simulated_board).substr(0,19) === '{"p1":{"l":0,"r":0}')
	{
		gameLog("winning move");
		sim_score=10;
		return [sim_score,"w"];
	}

	if(JSON.stringify(simulated_board).substr(19,19) === ',"p2":{"l":0,"r":0}')
	{
		gameLog("losing move");
		sim_score=-10;
		return [sim_score,"l"];
	}

	if(simulated_board == false)
	{
		gameLog("invalid move");
		return [-1000,1];
	}

	if(depth == 0)
		return [0,1];

	var eval_array = [];
	var mov_array = [];

	if(simulated_board[sim_pre_player]["l"] > 0)
	{
		if(simulated_board[sim_opp_player]["l"] > 0)
		{
			gameLog("ll")
			gameLog(mov_array)
			eval_array.push(minMax(execMove(simulated_board,mover,"ll"),(mover%2) + 1,sim_score,depth)[0])
			mov_array.push("ll")
		}

		if(simulated_board[sim_opp_player]["r"] > 0)
		{
			gameLog("lr")
			gameLog(mov_array)
			eval_array.push(minMax(execMove(simulated_board,mover,"lr"),(mover%2) + 1,sim_score,depth)[0])
			mov_array.push("lr")
		}

		if(simulated_board[sim_pre_player]["r"] == 0 && simulated_board[sim_pre_player]["l"]%2 == 0)
		{
			gameLog("ls")
			gameLog(mov_array)
			eval_array.push(minMax(execMove(simulated_board,mover,"s"),(mover%2) + 1,sim_score,depth)[0])
			mov_array.push("s")
		}		
	}

	if(simulated_board[sim_pre_player]["r"] > 0)
	{
		if(simulated_board[sim_opp_player]["l"] > 0)
		{
			gameLog("rl")
			gameLog(mov_array)
			eval_array.push(minMax(execMove(simulated_board,mover,"rl"),(mover%2) + 1,sim_score,depth)[0])
			mov_array.push("rl")
		}
		
		if(simulated_board[sim_opp_player]["r"] > 0)
		{
			gameLog("rr")
			gameLog(mov_array)
			eval_array.push(minMax(execMove(simulated_board,mover,"rr"),(mover%2) + 1,sim_score,depth)[0])
			mov_array.push("rr")
		}

		if(simulated_board[sim_pre_player]["l"] == 0 && simulated_board[sim_pre_player]["r"]%2 == 0)
		{
			gameLog("rs")
			gameLog(mov_array)
			eval_array.push(minMax(execMove(simulated_board,mover,"s"),(mover%2) + 1,sim_score,depth)[0])
			mov_array.push("s")
		}		
	}

	ret= (mover === 2)? indexOfMax( eval_array ) : indexOfMin( eval_array );

	gameLog("move array")
	gameLog(mov_array)
	gameLog("ret")
	gameLog(ret)

	return [ ret[0], mov_array[ret[1]] ] ;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;
    var m = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
        	m = [];
        	m.push(i);
            maxIndex = i;
            max = arr[i];
        }
        else if(arr[i] == max)
        {
        	m.push(i);
        }
    }

    var ret = [ max, m[Math.floor(Math.random()*m.length)] ]
    gameLog("indexOfMax")
    gameLog("m")
    gameLog(m)
    gameLog(maxIndex)
    gameLog(arr)
    gameLog(ret)

    return ret;
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;
    var m = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < max) {
        	m = [];
        	m.push(i);
            maxIndex = i;
            max = arr[i];
        }
        else if(arr[i] == max)
        {
        	m.push(i);
        }
    }

    var ret = [ max, m[Math.floor(Math.random()*m.length)] ]
    gameLog("indexOfMax")
    gameLog("m")
    gameLog(m)
    gameLog(maxIndex)
    gameLog(arr)
    gameLog(ret)

    return ret;
}

function errorLog(msg)
{
	if(viewAllErrors)
		document.getElementById("error-log").innerHTML = msg;
}