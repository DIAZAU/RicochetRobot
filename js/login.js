var plateau = new Array();
 var tableauInput = new Array();
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
	socket.on('gamesList', function(data) {
								 var zoneJoindrePartie = document.getElementById('zoneJoindrePartie');
								 var ul = document.getElementById('lesParties');
								 ul.innerHTML='';
								 for(p in data.gamesList) {
								 	 XhrRecupere(data,p);
								 	 //Zone pour joindre une partie
								 	 var divZone = document.createElement('div');
									 divZone.setAttribute("class", "modal hide");
									 divZone.setAttribute("id", "joinGame"+p);
									 	var divZoneNiv2 = document.createElement('div');
									 	divZoneNiv2.setAttribute("class", "modal-header");
											 var aZone = document.createElement('a');
											 aZone.setAttribute("class", "close");
											 aZone.setAttribute("data-dismiss", "modal");
											 aZone.appendChild( document.createTextNode( "x" ) );
											 var h3 = document.createElement('h3');
											 h3.appendChild( document.createTextNode( "Join game !" ) );
										 divZoneNiv2.appendChild( aZone );
										 divZoneNiv2.appendChild( h3 );
										 var divZoneNiv2_1 = document.createElement('div');
										 divZoneNiv2_1.setAttribute("class", "modal-body");
											var form = document.createElement('form'); 
											form.setAttribute("method", "post");
											form.setAttribute("action", "");
											form.setAttribute("id", "nouvellePartie"+p);
												var table = document.createElement('table');	
													var tr = document.createElement('tr');
														var td1 = document.createElement('td');
														var td = document.createElement('td');
														var input = document.createElement('input');
														input.setAttribute("type","hidden");
														input.setAttribute("name","idGame");
														input.setAttribute("id","idGame");
														input.setAttribute("value",data.gamesList[p]);
														td.appendChild( input );
														tr.appendChild( td1 );
														tr.appendChild( td );
														var tr2 = document.createElement('tr');
														var td2_1 = document.createElement('td');
															var label = document.createElement('label');
															label.setAttribute("for", "login");
															label.appendChild( document.createTextNode(  "Votre nom : " ) );
															td2_1.appendChild( label );
														var td2_2 = document.createElement('td');
															inputLabel = document.createElement('input');
															inputLabel.setAttribute("type", "text");
															inputLabel.setAttribute("name", "login");
															inputLabel.setAttribute("id", "login");
															inputLabel.setAttribute("class", "input-medium");
															inputLabel.setAttribute("required", "required");
															inputLabel.setAttribute("placeholder", "Votre nom");
															td2_2.appendChild( inputLabel );
														tr2.appendChild( td2_1 );
														tr2.appendChild( td2_2 );
													var tr3 = document.createElement('tr');
														var td3_1 = document.createElement('td');
															var br = document.createElement('br');
															var button = document.createElement('button');
															button.setAttribute("type", "submit");
															button.setAttribute("class", "btn btn-primary btn-small pull-right");
															button.appendChild( document.createTextNode(  " Joindre partie !" ) );
														td3_1.appendChild( br );
														td3_1.appendChild( button );
														tr3.appendChild( td3_1 );
												table.appendChild( tr );
												table.appendChild( tr2 );
												table.appendChild( tr3 );
											form.appendChild( table );
											divZoneNiv2_1.appendChild( form );
											var divZoneNiv2_2 = document.createElement('div');
											divZoneNiv2_2.setAttribute("class", "modal-footer");
											var aLast = document.createElement('a');
												aLast.setAttribute("class", "btn btn-info");
												aLast.setAttribute("data-dismiss", "modal");
												aLast.appendChild( document.createTextNode(  " Fermer" ) );
											divZoneNiv2_2.appendChild( aLast );
									 divZone.appendChild( divZoneNiv2 );
									 divZone.appendChild( divZoneNiv2_1 );
									 divZone.appendChild( divZoneNiv2_2 );
									 zoneJoindrePartie.appendChild( divZone );
									 console.log(divZone);
									 // les balises pour affiches les etiquettes des parties existantes
									 var li = document.createElement('li');
									 var a = document.createElement('a');
									 a.setAttribute("href", "#joinGame"+p);
									 a.setAttribute("data-toggle", "modal");
									 li.appendChild( a );
									 var span = document.createElement('span');
									 a.appendChild( span );
									 var div = document.createElement('div');
									 div.setAttribute("id", "Plateau"+p);
									 div.classList.add('image');
									 a.appendChild( div );
									 ul.appendChild( li );
									 span.appendChild( document.createTextNode( data.gamesList[p] ) );
									}
								}
			 );
	socket.emit('loginPage');
}
function XhrRecupere(data,p)
{
	XHR('GET', '/'+data.gamesList[p], {
 	onload: function() {
	 	plateau.push(JSON.parse(this.responseText));
	 	Monplateau(plateau,p);
	 	}
 	});
}
function Monplateau(plateau,p)
 {
 	var tableau=document.getElementById('Plateau'+p);
 	// On crée la balise <table>
 	var table=document.createElement('table');
 	table.setAttribute("id", "plateauJeu"+p);
 	// largeur et style et couleur de bordure de la balise <table>
 	table.style.border = "1px solid #000000";
 	// pour avoir des MaTdules de tableau collé
 	table.style.borderCollapse="collapse";
 	//centrer les contenu des colonnes
 	table.style.textAlign="center";
 	//parcourir toutes les lignes
 	for(var ligne=0;ligne<16;ligne++)
 	{
 		// creation de la balise <tr> pour chaque itération
	    var tr=document.createElement('tr');
	    // largeur et style et couleur de bordure de chaque balise <tr>
	    tr.style.border = "1px solid #000000";
	    //pour chaque ligne on crée les colonne
	    for(var colonne=0;colonne<16;colonne++)
	    {
	    	// creation de la balise <td> pour chaque itération
			var td=document.createElement('td');
			//mettre le numero de la ligne ds td.ligne
			td.ligne = ligne;
			//mettre le numero de la colonne ds td.colonne
			td.colonne = colonne;
			// le nom de chaque id d'une balise <td>
	        td.setAttribute("id", ligne+"ET"+colonne+p);		
	        // largeur et style et couleur de bordure de chaque balise <td>
	        td.style.border = "1px solid #000000";
	        td.style.width="3px";
	        td.style.height="3px";
	        document.getElementById('Plateau'+p).style.margin="5px";
	        //au survol de souris
	        table.onmouseover=function()
	        {	
	        	table.style.width="140px";
	        	table.style.height="140px";
	        	document.getElementById('Plateau'+p).style.margin="5px";
	        };
	        //Taille normale onmouseout
	        table.onmouseout=function()
	        {	
	        	table.style.width="85px";
	        	table.style.height="69px";
	        	td.style.width="3px";
	        	td.style.height="3px";
	        	document.getElementById('Plateau'+p).style.margin="5px";
	        };
	        //td.style.tableLayout="fixed";
	        // on mets une bordure à gauche de colonne s'il ya un mur
	        if(plateau[p].board[ligne][colonne].g)
	        {
	        	td.style.borderLeft="2px solid #000000";
	        }
	        // on mets une bordure à droite de colonne s'il ya un mur
	        if(plateau[p].board[ligne][colonne].d)
	        {
	        	td.style.borderRight="2px solid #000000";
	        }
	        // on mets une bordure au dessus de colonne s'il ya un mur
	        if(plateau[p].board[ligne][colonne].h)
	        {
	        	td.style.borderTop="2px solid #000000";
	        }
	        // on mets une bordure au dessous de colonne s'il ya un mur
	        if(plateau[p].board[ligne][colonne].b)
	        {
	        	td.style.borderBottom="2px solid #000000";
	        }
	        //rattacher les balises <td> aux blaises <tr>
	        tr.appendChild(td);
	    }
	    //rattacher les balises <tr> à le blaise <table>
	    table.appendChild(tr);
	}
	// rattacher la table à notre div de la page logged.xhtml
	tableau.appendChild(table);
	// rajouter la cible dans le plateau
 	LaCible(plateau,p);
 	// rajouter les robots dans le plateau
	LesRobots(plateau,p);
}
function LaCible(plateau,p){
	document.getElementById(plateau[p].target.l+"ET"+plateau[p].target.c+p).classList.add( 'cibleDeCouleur' + plateau[p].target.t );	
}

function LesRobots(plateau,p){
	// boucle pour recuperer les robots avec leurs positions et leurs couleurs
	for (var nbre = 0; nbre < plateau[p].robots.length; nbre++) {
		var id=plateau[p].robots[nbre].line+"ET"+plateau[p].robots[nbre].column+p;
		//créé une div
		var div   = document.createElement('div');
		plateau[p].robots[nbre].div = div; 
		//mettre l'objet robot dans div.robot
		div.robot = plateau[p].robots[nbre];
		//rajouter une classe avec la bonne couleur dans chaque div
		div.classList.add(plateau[p].robots[nbre].color+"fish");
		//rajouter l'attribut draggable à la div
		div.setAttribute('draggable', 'true');
		//rendre la div deplacable
		div.addEventListener('dragstart', function(div) {return function(e){Ondragstart(div, e);};}(div),false);
		//affecter la div à la bonne td
		document.getElementById(id).appendChild(div);
	}
}
