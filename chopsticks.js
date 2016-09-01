var cur_player=1;
var error_num=0;
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

function render()
{
	var x,y,flag,winner="";
	console.log(game_board);
	for(x in game_board)
	{
		flag = true
		for(y in game_board[x])
		{
			if(game_board[x] > 0)
				flag = false
			document.getElementById(x+y).innerHTML = game_board[x][y];
		}
		if(flag)
			winner = (x=="p1")? "p2" : "p1";
	}

	document.getElementById("current-player").innerHTML = "Player "+cur_player;
}	

function gameLoop(move)
{
	var this_board=execMove(game_board,cur_player,move);

	if(this_board)
	{
		game_board = this_board;
		cur_player = (cur_player === 1 )? 2 : 1;
		render();

		move=aiPlayer();
		this_board=execMove(game_board,2,move)

		if(this_board)
		{
			game_board = this_board;
			cur_player = (cur_player === 1 )? 2 : 1;
			errorLog("ai move : "+move);
			render();
		}
		else
		{
			errorLog("ai failed "+move);
		}
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
			console.log("execMove")
			console.log(this_player)
			console.log(opp_player)
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

function i_to_move(index)
{
	switch(index)
	{
		case 0: 
			return "ll"
		case 1: 
			return "lr"
		case 2: 
			return "rl"
		case 3: 
			return "rr"
		case 4: 
			return "s" 
	}
}

function aiPlayer()
{
	simulated_board = JSON.parse(JSON.stringify(game_board));
	ret = minMax(simulated_board,0,3);
	console.log("aiPlayer");
	console.log(ret);
	return i_to_move(ret[1]);
}

function minMax(simulated_board,sim_score,depth)
{
	depth = depth-1;
	if(depth == 0)
		return [0,1];

	if(JSON.stringify(simulated_board).substr(0,19) === '{"p1":{"l":0,"r":0}')
	{
		sim_score+=10;
		return [sim_score,1];
	}

	if(JSON.stringify(simulated_board).substr(19,19) === '{"p2":{"l":0,"r":0}')
	{
		sim_score-=10;
		return [sim_score,1];
	}

	if(simulated_board == false)
		return [-1000,1];

	ret=indexOfMax( [ 
				minMax(execMove(simulated_board,(depth%2)+1,"ll"),sim_score,depth)[0],
				minMax(execMove(simulated_board,(depth%2)+1,"lr"),sim_score,depth)[0],
				minMax(execMove(simulated_board,(depth%2)+1,"rl"),sim_score,depth)[0],
				minMax(execMove(simulated_board,(depth%2)+1,"rr"),sim_score,depth)[0],
				minMax(execMove(simulated_board,(depth%2)+1,"s"),sim_score,depth)[0]
			]);

	console.log("minMax")
	console.log(ret);
	console.log(depth);
	return ret;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;
    var m = [];

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
        	m = [];
            maxIndex = i;
            max = arr[i];
        }
        else if(arr[i] == max)
        {
        	m.push(i);
        }
    }

    var ret = [ max, m[Math.floor(Math.random()*m.length)] ]
    console.log("indexOfMax")
    console.log(arr)
    console.log(ret)

    return ret;
}

function errorLog(msg)
{
	document.getElementById("error-log").innerHTML = msg;
}