$(function () {

	var graj = function (history,msg,game){
		$('#info').html(msg);
		
		if(!game.win && !game.fail){ 
			$('.digits').val("");
			var dots = "";
			for(var i=0; i < game.dots.blackDot; i++)
				dots += "<div class='fullDot'></div>";
			for(var i=0; i < game.dots.whiteDot; i++)
				dots += "<div class='emptyDot'></div>";

			var tr= "<tr>";
			for(var i=0; i<history.length; i++)
				tr+= "<td>" +history[i]+ "</td>";

			tr+="<td>"+dots+"</td>";
			tr += "</tr>";
			$('#gameTableBody').html(tr+$('#gameTableBody').html());

			$('#attempts').html(game.attempts);

		} else {
			$('#wrap').html("");
		}
	}

	var confirmClick = function(e) {
		var link = "/mark/";
		var valid = true;
		var attempt = [];
		$('.digits').each(function(key, val){
			if(val.value.length > 0){
				link += val.value + "/";
				attempt.push(val.value);
			}
			else
				valid = false;
		});

		if(valid)
			$.ajax({
	            url: link,
	            method: 'get',
	            success: function(data){
	                graj(attempt, data.retMsg,data.retVal);
	            },
	            fail: function(data){
	                $('#place').html("Error, something went wrong!");
	            }
		    });
		else
			$('#info').html("Fill all fields!");

	}


	var createPlace = function(msg,size){
		var inputs = "";
		for(var i=1;i<=size;i++){
			inputs += "<td><input type='text' class='digits' name='"+i+"' /></td>";
		}
		inputs += "<td id='dots_str'><b>Dots</b></td>"

		var page = "<button id='restart'>Restart game</button><div id='msg'><h id='info'>"+msg+"</h></div>"+
					 "<div id='wrap'><div id='gameDiv'><button id='confirm'>Confirm!</button> Attempt: <span id='attempts'>0</span> <br/><table id='gameTable'><thead><tr>"+inputs+"</tr></thead><tbody id='gameTableBody'></tbody></table></div></div>";
		$('#place').html(page);
	
		$("#restart").click(function(e){
			window.location.reload();
		});

		$("#confirm").click(confirmClick);
			
	}

	var startClick = function(e){
	    var size = $('#size').val();
	    var dim = $('#dim').val();
		var max = $('#max').val();

	    var link = "/play/size/"+size+"/dim/"+dim+"/max/"+max+"/";

	    $.ajax({
            url: link,
            method: 'get',
            success: function(data){
                    	createPlace(data.retMsg,data.retSize);
            },
            fail: function(data){
                    $('#place').html("Error, something went wrong!");
        	}
	    });
	}
	$('#start').click(startClick);
});
