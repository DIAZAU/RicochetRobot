var SolutionTrouver = null;
var solution = '';
var nombreParticipant = 0;
var vainqueurs = "";
var listeParticipant = [];
function affichageSalution(){
    for (var nbre = 0; nbre < SolutionTrouver.length; nbre++) {
        if (SolutionTrouver[nbre].command == 'select'){
            switch (SolutionTrouver[nbre].robot){
                case 'red':solution+="Robot rouge séléctionné\n";
                    break;
                case 'green':solution+="Robot vert séléctionné\n";
                    break;
                case 'yellow':solution+="Robot jaune séléctionné\n";
                    break;
                case 'blue':solution+="Robot bleu séléctionné\n";
                    break;
            }

        }
        else{
            solution+=" Déplacement à la ligne "+SolutionTrouver[nbre].line + " colonne " +SolutionTrouver[nbre].column+"\n";
        }

    }

}
var XHR = function(method, ad, params) {
	var xhr = new XMLHttpRequest();
	xhr.onload = params.onload || null;
	xhr.open(method, ad);
	if(method == 'POST') {xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');}
	var variables   = params.variables || null
	  , str			= '';
	for(var i in variables) {
		 str += i + '=' + encodeURIComponent( variables[i] ) + '&';
		}
	xhr.send( str );
}

function init() {
	// Connect to the SocketIO server to retrieve ongoing games.
	socket = io.connect();
	socket.on('participants', function(data) {
		 var ul = document.getElementById('lesParticipants');
		 ul.innerHTML='';
		 nombreParticipant = data.participants.length;
		 for(p in data.participants) {
			 var li = document.createElement('li'); 
			 li.setAttribute("id", "participant"+p);
			 listeParticipant[p] = data.participants[p];
			 ul.appendChild( li );
			 li.appendChild( document.createTextNode( data.participants[p] ) );
			}
		});
	socket.on('FinalCountDown'	, function(data) {
		
        var ms   = data.FinalCountDown;
        console.log("FinalCountDown : " + ms);
        var iv = setInterval(function() {

            ms -= 1000;
            
            if (ms <= 0) {
                clearInterval(iv);
                document.getElementById('compteur').innerHTML = 'Temps restant : '+'terminé';
            } else {
                document.getElementById('compteur').innerHTML = 'Temps restant : '+parseInt(ms / 1000) + 's';
            }
        }, 1000);

		});

	socket.on('TerminateGame'	, function(data) {
         affichageSalution();
		 //document.getElementById('afficherSolution').innerHTML = 'La partie est terminée ! et voilà la solution trouvée :<br/>' + solution;
		 alert('La partie est terminée ! et voilà la solution trouvée :\n' + solution);
		  for (var nbre = 0; nbre < nombreParticipant; nbre++) {
		  	if (listeParticipant[nbre] == vainqueurs)
		 		document.getElementById('participant'+nbre).innerHTML += '  est vainqueur';
		 }
		});

	socket.on('solutions'		, function(data) {
		 console.log("Solutions are :\n"+JSON.stringify(data.solutions));
		 var winner = data.solutions;
		 SolutionTrouver = winner[0].proposition;
		 console.log(winner[0].player);
		 vainqueurs = winner[0].player;
		 if (winner[0].player == document.getElementById('login').value)
		 	document.getElementById('vainqueur').innerHTML = ' Vous venez de trouver une solution';
		 else
		 	document.getElementById('vainqueur').innerHTML = winner[0].player +' vient de trouver une solution';
		});

	socket.emit ('identification', 	{ login	: document.getElementById('login').value
									, idGame: document.getElementById('idGame').value}
				);
}