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

function render()
{
	var x,y,flag,winner;
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

function execMove(move)
{
	split =false;
	this_player = "p"+cur_player
	opp_player = "p"+((cur_player === 1 )? 2 : 1); 

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
			if( (game_board[this_player]["l"]>0 && game_board[this_player]["r"]>0) 
				|| game_board[this_player]["l"]%2 !=0 
				|| game_board[this_player]["r"]%2 !=0)
				throw "invalid move"

			if(game_board[this_player]["l"]>0)
			{
				game_board[this_player]["r"]=game_board[this_player]["l"]=game_board[this_player]["l"]/2
			}
			else
			{
				game_board[this_player]["r"]=game_board[this_player]["l"]=game_board[this_player]["r"]/2	
			}
		}
		else
		{
			if( !game_board[opp_player][dest_h] || !game_board[this_player][src_h] )
				throw "invalid move"

			game_board[opp_player][dest_h] = (game_board[opp_player][dest_h]+game_board[this_player][src_h])%5; 
		}

		cur_player = (cur_player === 1 )? 2 : 1;
		render();
	}
	catch(err)
	{
		error_num=error_num+1;
		errorLog(error_num+": Invalid move")
	}
}

function errorLog(msg)
{
	document.getElementById("error-log").innerHTML = msg;
}