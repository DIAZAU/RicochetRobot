var proposition = [];
var compteur=0;
// permet de recuperer le nom de partie
var partie=document.getElementById("idGame").value;
// permet de recuperer le nom de joueur
var login=document.getElementById("login").value;
// permet de recuperer les données json et de les parser
XHR('GET', '/'+partie, {
 	onload: function() {
	 	//console.log("Le serveur me renvoie :\n" + this.responseText);
	 	var plateau = JSON.parse(this.responseText);
	 	Monplateau(plateau);
	 	}
 	});
//les fonctions pour le glisser deposer 
function Ondragstart(div, evt){
	//recuperer le robot de la div selectionner
	var robot = div.robot;
	 //rajouter dans le tableau de proposition le robot selectionner
	 proposition.push({command: 'select', robot: robot.color});
	 console.log( "robot selectionner :\n\t" + JSON.stringify( this.proposition ) );
	 //on appelle la fonction envoyerProposition qui permet d'interroger le serveur
	 envoyerProposition(div); 
}
//
function Ondragover(div, td, e) {

	//on recupere la ligne de destination
	 var ligne   = td.ligne;
	//on recupere la colonne de destination
	 var colonne = td.colonne;
	//supprimer la div de l'ancienne td
	 div.parentNode.removeChild(div);
	//rattacher la div à la nouvelle td
	 td.appendChild(div);
	 //rajouter dans le tableau de proposition le deplacement proposer par le joueur
	 proposition.push( {command: 'move', line:ligne , column:colonne} );
	 //on appelle la fonction envoyerProposition qui permet d'interroger le serveur pour savoir si c'est un deplacement valide
	 envoyerProposition(div);
}
function onTouch(evt) {
  evt.preventDefault();
  if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
    return;

  var newEvt = document.createEvent("MouseEvents");
  var type = null;
  var touch = null;
  switch (evt.type) {
    case "touchstart":    type = "mousedown";    touch = evt.changedTouches[0];break;
    case "touchmove":        type = "mousemove";    touch = evt.changedTouches[0];break;
    case "touchend":        type = "mouseup";    touch = evt.changedTouches[0];break;
  }
  newEvt.initMouseEvent(type, true, true, evt.originalTarget.ownerDocument.defaultView, 0,
    touch.screenX, touch.screenY, touch.clientX, touch.clientY,
    evt.ctrlKey, evt.altKey, evt.shirtKey, evt.metaKey, 0, null);
  evt.originalTarget.dispatchEvent(newEvt);
}
function envoyerProposition(div){
	// on reccupere le contenu de table
	var table=document.getElementById("plateauJeu");
	// mettre dans TdColorerRouge tous les colonnes qui comporte une classe colorerCheminRouge
	var TdColorerRouge = table.querySelectorAll('td.colorerCheminRouge');
 	for(var i=0; i<TdColorerRouge.length; i++) {
 	 // effacer le classe colorerCheminRouge de td contenant la div	
	 TdColorerRouge.item(i).classList.remove('colorerCheminRouge');
	}
	var TdColorerVert = table.querySelectorAll('td.colorerCheminVert');
 	for(var i=0; i<TdColorerVert.length; i++) {
 	 // effacer le classe colorerCheminVert de td contenant la div	
	 TdColorerVert.item(i).classList.remove('colorerCheminVert');
	}
	var TdColorerBleu = table.querySelectorAll('td.colorerCheminBleu');
 	for(var i=0; i<TdColorerBleu.length; i++) {
 	 // effacer le classe colorerCheminBleu de td contenant la div	
	 TdColorerBleu.item(i).classList.remove('colorerCheminBleu');
	}
	var TdColorerJaune = table.querySelectorAll('td.colorerCheminJaune');
 	for(var i=0; i<TdColorerJaune.length; i++) {
 	 // effacer le classe colorerCheminJaune de td contenant la div	
	 TdColorerJaune.item(i).classList.remove('colorerCheminJaune');
	}
	// mettre dans MesTd tous les colonnes qui comporte une classe recevable
 	var MesTd = table.querySelectorAll('td.recevable');
 	for(var i=0; i<MesTd.length; i++) {
 	 // effacer le classe recevable de td contenant la div	
	 MesTd.item(i).classList.remove('recevable');
	 //on fait rien si on essaye de mettre des elements
	 MesTd.item(i).ondragover = null;
	}
	XHR('POST', '/proposition', {			
				variables: {
					proposition: JSON.stringify(proposition),
					idGame: partie,
					login: login
				},
				
				onload: function() {
					var reponse = JSON.parse( this.responseText );
					//recuperer la position de ligne de robot
						var ligneRobot = div.parentNode.id.substring(0, div.parentNode.id.indexOf('ET'));
					//recuperer la position de colonne de robot
						var ColonneRobot = div.parentNode.id.substring(div.parentNode.id.indexOf('ET')+2);
					//pour chaque positions envoyer par le serveur
					for(var pro in reponse.nextPositions) {
						// l'id de la prochaine position
						var id = reponse.nextPositions[pro].l+'ET'+reponse.nextPositions[pro].c;
						// traitement quand on est en train de jouer avec le robot rouge de colorer les chemins possibles
						if(div.robot.color=="red"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
						}
						// traitement quand on est en train de jouer avec le robot vert de colorer les chemins possibles
						if(div.robot.color=="green"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminVert');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminVert');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminVert');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminVert');
								}
							}
						}
						// traitement quand on est en train de jouer avec le robot bleu de colorer les chemins possibles
						if(div.robot.color=="blue"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
						}
						// traitement quand on est en train de jouer avec le robot jaune de colorer les chemins possibles
						if(div.robot.color=="yellow"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
						}
						// on recupere l'id de colonne de destination
						var MaTd = document.getElementById(id);
						// on rajoute une classe recevable dans la colonne de destination
						MaTd.classList.add('recevable');
						// on rend cette colonne recevable en appelant la fonction Ondragover
						MaTd.ondragover = function(div, td) {return function(e) {return Ondragover(div, td, e);};}(div, MaTd);
                        MaTd.onclick = function(div, td) {return function(e) {return Ondragover(div, td, e);};}(div, MaTd);
					}
				}		
	});
}
function envoyerPropositionClavier(div,color){
	var robot = div.robot;
	// on reccupere le contenu de table
	var table=document.getElementById("plateauJeu");
	// mettre dans TdColorerRouge tous les colonnes qui comporte une classe colorerCheminRouge
	var TdColorerRouge = table.querySelectorAll('td.colorerCheminRouge');
 	for(var i=0; i<TdColorerRouge.length; i++) {
 	 // effacer le classe colorerCheminRouge de td contenant la div	
	 TdColorerRouge.item(i).classList.remove('colorerCheminRouge');
	}
	var TdColorerVert = table.querySelectorAll('td.colorerCheminVert');
 	for(var i=0; i<TdColorerVert.length; i++) {
 	 // effacer le classe colorerCheminVert de td contenant la div	
	 TdColorerVert.item(i).classList.remove('colorerCheminVert');
	}
	var TdColorerBleu = table.querySelectorAll('td.colorerCheminBleu');
 	for(var i=0; i<TdColorerBleu.length; i++) {
 	 // effacer le classe colorerCheminBleu de td contenant la div	
	 TdColorerBleu.item(i).classList.remove('colorerCheminBleu');
	}
	var TdColorerJaune = table.querySelectorAll('td.colorerCheminJaune');
 	for(var i=0; i<TdColorerJaune.length; i++) {
 	 // effacer le classe colorerCheminJaune de td contenant la div	
	 TdColorerJaune.item(i).classList.remove('colorerCheminJaune');
	}
	// mettre dans MesTd tous les colonnes qui comporte une classe recevable
 	var MesTd = table.querySelectorAll('td.recevable');
 	for(var i=0; i<MesTd.length; i++) {
 	 // effacer le classe recevable de td contenant la div	
	 MesTd.item(i).classList.remove('recevable');
	 //on fait rien si on essaye de mettre des elements
	 MesTd.item(i).ondragover = null;
	}
	XHR('POST', '/proposition', {			
				variables: {
					proposition: JSON.stringify(proposition),
					idGame: partie,
					login: login
				},
				
				onload: function() {
					var reponse = JSON.parse( this.responseText );
					console.log(div);
					console.log("td de div: "+div.parentNode.id);
					//recuperer la position de ligne de robot
						var ligneRobot = div.parentNode.id.substring(0, div.parentNode.id.indexOf('ET'));
					//recuperer la position de colonne de robot
						var ColonneRobot = div.parentNode.id.substring(div.parentNode.id.indexOf('ET')+2);
					//pour chaque positions envoyer par le serveur
					for(var pro in reponse.nextPositions) {
//						console.log( JSON.stringify(reponse.nextPositions[pro]) );
						
						var id = reponse.nextPositions[pro].l+'ET'+reponse.nextPositions[pro].c;
						// traitement quand on est en train de jouer avec le robot rouge de colorer les chemins possibles
						if(color=="red"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminRouge');
								}
							}
						}
						// traitement quand on est en train de jouer avec le robot vert de colorer les chemins possibles
						if(color=="green"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminVert');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminVert');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminVert');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminVert');
								}
							}
						}
						// traitement quand on est en train de jouer avec le robot bleu de colorer les chemins possibles
						if(color=="blue"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
									console.log(ligneRobot);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminBleu');
								}
							}
						}
						// traitement quand on est en train de jouer avec le robot jaune de colorer les chemins possibles
						if(color=="yellow"){
							if(ligneRobot < reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i < reponse.nextPositions[pro].l; i++) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
							if(ligneRobot > reponse.nextPositions[pro].l){
								for (var i = ligneRobot; i > reponse.nextPositions[pro].l; i--) {
									var leChemin = document.getElementById(i+"ET"+reponse.nextPositions[pro].c);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
							if(ColonneRobot < reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i < reponse.nextPositions[pro].c; i++) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
							if(ColonneRobot > reponse.nextPositions[pro].c){
								for (var i = ColonneRobot; i > reponse.nextPositions[pro].c; i--) {
									var leChemin = document.getElementById(reponse.nextPositions[pro].l+"ET"+i);
										leChemin.classList.add('colorerCheminJaune');
								}
							}
						}
						// on recupere l'id de colonne de destination
						var MaTd = document.getElementById(id);
						// on rajoute une classe recevable dans la colonne de destination
						MaTd.classList.add('recevable');
						// on rend cette colonne recevable en appelant la fonction Ondragover
						MaTd.ondragover = function(div, td) {return function(e) {return Ondragover(div, td, e);};}(div, MaTd);
					}
				}		
	});
}

 function Monplateau(plateau)
 {
 	var tableau=document.getElementById('Plateau');
 	// On crée la balise <table>
 	var table=document.createElement('table');
 	table.setAttribute("id", "plateauJeu");
 	// largeur et style et couleur de bordure de la balise <table>
 	table.style.border = "4px solid #000000";
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
	        td.setAttribute("id", ligne+"ET"+colonne);		
	        // largeur et style et couleur de bordure de chaque balise <td>
	        td.style.border = "1px solid #000000";
	        // fixer la largeur de colonne à 18px
	        td.style.width="20px";
	        // fixer la l'hauteur de colonne à 18px
	        td.style.height="20px";
	        //td.style.tableLayout="fixed";
	        // on mets une bordure à gauche de colonne s'il ya un mur
	        if(plateau.board[ligne][colonne].g)
	        {
	        	td.style.borderLeft="4px solid #000000";
	        }
	        // on mets une bordure à droite de colonne s'il ya un mur
	        if(plateau.board[ligne][colonne].d)
	        {
	        	td.style.borderRight="4px solid #000000";
	        }
	        // on mets une bordure au dessus de colonne s'il ya un mur
	        if(plateau.board[ligne][colonne].h)
	        {
	        	td.style.borderTop="4px solid #000000";
	        }
	        // on mets une bordure au dessous de colonne s'il ya un mur
	        if(plateau.board[ligne][colonne].b)
	        {
	        	td.style.borderBottom="4px solid #000000";
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
 	LaCible(plateau);
 	// rajouter les robots dans le plateau
	LesRobots(plateau);
	//fonction pour declencher les touches clavier
	AppliquerTouche();
}

function Touche(e) {
	//var robot = div.robot;
	switch (e.keyCode) {
		// on click sur espace
		case 32:
		// le compteur pour savoir le nombre de clique sur la touche espace
		compteur++;
		if(compteur==1)
		{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot bleu
			var div = table.querySelector('div.blue');
			// rajouter dans tableau proposition que le robot bleu est selectionner 
			proposition.push({command: 'select', robot: 'blue'});
			var color='blue';
		 	//on appelle la fonction envoyerPropositionClavier qui permet d'interroger le serveur
	 		envoyerPropositionClavier(div,color); 
		}
		if(compteur==2)
		{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot vert
			var div = table.querySelector('div.green');
			// rajouter dans tableau proposition que le robot vert est selectionner 
			proposition.push({command: 'select', robot: 'green'});
			var color='green';
		 	//on appelle la fonction envoyerPropositionClavier qui permet d'interroger le serveur
		 	envoyerPropositionClavier(div,color); 
		}
		if(compteur==3)
		{
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot rouge
			var div = table.querySelector('div.red');
			// rajouter dans tableau proposition que le robot rouge est selectionner 
			proposition.push({command: 'select', robot: 'red'});
			var color='red';
		 	console.log( "robot selectionner dans touche :\n\t" + JSON.stringify( this.proposition ) );
		 	envoyerPropositionClavier(div,color);
		}
		if(compteur==4)
		{
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot jaune
			var div = table.querySelector('div.yellow');
			// rajouter dans tableau proposition que le robot jaune est selectionner 
			proposition.push({command: 'select', robot: 'yellow'});
			var color='yellow';
			//on appelle la fonction envoyerPropositionClavier qui permet d'interroger le serveur
		 	envoyerPropositionClavier(div,color);
		}

		break;
		// quand on click la fleche gauche de clavier
		case 37:
			if(compteur==1)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot bleu
			var div = table.querySelector('div.blue');
			// la fonction qui permet de deplacer à gauche
			deplacerAGauche(div);
			}
			if(compteur==2)
			{
				// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot vert
			var div = table.querySelector('div.green');
			// la fonction qui permet de deplacer à gauche
			deplacerAGauche(div); 
			}
			if(compteur==3)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot rouge
			var div = table.querySelector('div.red');
			// la fonction qui permet de deplacer à gauche
			deplacerAGauche(div);
			}
			if(compteur==4)
			{
				// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot jaune
			var div = table.querySelector('div.yellow');
			// la fonction qui permet de deplacer à gauche
			deplacerAGauche(div); 
			}
		break;
		// quand on click la fleche haut de clavier
		case 38:
			if(compteur==1)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot bleu
			var div = table.querySelector('div.blue');
			// la fonction qui permet de deplacer en haut
			deplacerEnHaut(div);
			}
			if(compteur==2)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot vert
			var div = table.querySelector('div.green');
			// la fonction qui permet de deplacer en haut
			deplacerEnHaut(div);
			}
			if(compteur==3)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot rouge
			var div = table.querySelector('div.red');
			// la fonction qui permet de deplacer en haut
			deplacerEnHaut(div);
			}
			if(compteur==4)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot jaune
			var div = table.querySelector('div.yellow');
			// la fonction qui permet de deplacer en haut
			deplacerEnHaut(div);
			}
		break;
		// quand on click la fleche droite de clavier
		case 39:
			if(compteur==1)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot bleu
			var div = table.querySelector('div.blue'); 
			// la fonction qui permet de deplacer à droite
			deplacerADroite(div);
			}
			if(compteur==2)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot vert
			var div = table.querySelector('div.green'); 
			// la fonction qui permet de deplacer à droite
			deplacerADroite(div);
			}
			if(compteur==3)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot rouge
			var div = table.querySelector('div.red'); 
			// la fonction qui permet de deplacer à droite
			deplacerADroite(div);
			}
			if(compteur==4)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot jaune
			var div = table.querySelector('div.yellow'); 
			// la fonction qui permet de deplacer à droite
			deplacerADroite(div);
			}
		break;
		// quand on click la fleche bas de clavier
		case 40:
			if(compteur==1)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot bleu
			var div = table.querySelector('div.blue');
			// la fonction qui permet de deplacer en bas
			deplacerEnBas(div);
			}
			if(compteur==2)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot vert
			var div = table.querySelector('div.green');
			// la fonction qui permet de deplacer en bas
			deplacerEnBas(div);
			}
			if(compteur==3)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot rouge
			var div = table.querySelector('div.red');
			// la fonction qui permet de deplacer en bas
			deplacerEnBas(div);
			}
			if(compteur==4)
			{
			// on reccupere le contenu de table
			var table=document.getElementById("plateauJeu");
			// mettre dans div la div de robot jaune
			var div = table.querySelector('div.yellow');
			// la fonction qui permet de deplacer en bas
			deplacerEnBas(div);
			}
		break;
	}
}
function deplacerAGauche(div){
	XHR('POST', '/proposition', {			
				variables: {
					proposition: JSON.stringify(proposition),
					idGame: partie,
					login: login
				},
				
				onload: function() {
					var reponse = JSON.parse(this.responseText);
					//recuperer la position de ligne de robot
						var ligneRobot = div.parentNode.id.substring(0, div.parentNode.id.indexOf('ET'));
					//recuperer la position de colonne de robot
						var ColonneRobot = div.parentNode.id.substring(div.parentNode.id.indexOf('ET')+2);
					//pour chaque positions envoyer par le serveur
					for(var pro in reponse.nextPositions) {
						// l'id de prochaine position
						var id = reponse.nextPositions[pro].l+'ET'+reponse.nextPositions[pro].c;
						// on recuperer la td (colonne) de div
						var MaTd = document.getElementById(id);
						// test pour se deplacer juste sur l'horizentale gauche
						if((ligneRobot == reponse.nextPositions[pro].l) && (ColonneRobot > reponse.nextPositions[pro].c)){
							// on supprime la div de l'ancienne td 
							 div.parentNode.removeChild(div);
							 // on rajoute la div à la nouvelle position
							 MaTd.appendChild(div);
							 // on rajoute dans le tableau proposition les deplacement donnée par le joueur
							 proposition.push( {command: 'move', line:MaTd.ligne , column:MaTd.colonne} );
							 // on interroge le serveur
							 envoyerProposition(div);
						}
					}
					
				}
				});
	
}
function deplacerADroite(div){
	XHR('POST', '/proposition', {			
				variables: {
					proposition: JSON.stringify(proposition),
					idGame: partie,
					login: login
				},
				
				onload: function() {
					var reponse = JSON.parse( this.responseText );
					//recuperer la position de ligne de robot
						var ligneRobot = div.parentNode.id.substring(0, div.parentNode.id.indexOf('ET'));
					//recuperer la position de colonne de robot
						var ColonneRobot = div.parentNode.id.substring(div.parentNode.id.indexOf('ET')+2);
					//pour chaque positions envoyer par le serveur
					for(var pro in reponse.nextPositions) {
						// l'id de prochaine position
						var id = reponse.nextPositions[pro].l+'ET'+reponse.nextPositions[pro].c;
						// on recuperer la td (colonne) de div
						var MaTd = document.getElementById(id);
						// test pour se deplacer juste sur l'horizentale droite
						if((ligneRobot == reponse.nextPositions[pro].l) && (ColonneRobot < reponse.nextPositions[pro].c)){
							// on supprime la div de l'ancienne td 
							 div.parentNode.removeChild(div);
							  // on rajoute la div à la nouvelle position
							 MaTd.appendChild(div);
							 // on rajoute dans le tableau proposition les deplacement donnée par le joueur
							 proposition.push( {command: 'move', line:MaTd.ligne , column:MaTd.colonne} );
							 // on interroge le serveur
							 envoyerProposition(div);
						}
					}
					
				}
				});
	
}
function deplacerEnHaut(div){
	XHR('POST', '/proposition', {			
				variables: {
					proposition: JSON.stringify(proposition),
					idGame: partie,
					login: login
				},
				
				onload: function() {
					var reponse = JSON.parse( this.responseText );
					//recuperer la position de ligne de robot
						var ligneRobot = div.parentNode.id.substring(0, div.parentNode.id.indexOf('ET'));
					//recuperer la position de colonne de robot
						var ColonneRobot = div.parentNode.id.substring(div.parentNode.id.indexOf('ET')+2);
					//pour chaque positions envoyer par le serveur
					for(var pro in reponse.nextPositions) {
						// l'id de prochaine position
						var id = reponse.nextPositions[pro].l+'ET'+reponse.nextPositions[pro].c;
						// on recuperer la td (colonne) de div
						var MaTd = document.getElementById(id);
						// test pour se deplacer juste sur la verticale haut
						if((ligneRobot > reponse.nextPositions[pro].l) && (ColonneRobot == reponse.nextPositions[pro].c)){
							// on supprime la div de l'ancienne td 
							 div.parentNode.removeChild(div);
							 // on rajoute la div à la nouvelle position
							 MaTd.appendChild(div);
							 // on rajoute dans le tableau proposition les deplacement donnée par le joueur
							 proposition.push( {command: 'move', line:MaTd.ligne , column:MaTd.colonne} );
							 // on interroge le serveur
							 envoyerProposition(div);
						}
					}
					
				}
				});
	
}
function deplacerEnBas(div){
	XHR('POST', '/proposition', {			
				variables: {
					proposition: JSON.stringify(proposition),
					idGame: partie,
					login: login
				},
				
				onload: function() {
					var reponse = JSON.parse( this.responseText );
					//recuperer la position de ligne de robot
						var ligneRobot = div.parentNode.id.substring(0, div.parentNode.id.indexOf('ET'));
					//recuperer la position de colonne de robot
						var ColonneRobot = div.parentNode.id.substring(div.parentNode.id.indexOf('ET')+2);
					//pour chaque positions envoyer par le serveur
					for(var pro in reponse.nextPositions) {
						// l'id de prochaine position
						var id = reponse.nextPositions[pro].l+'ET'+reponse.nextPositions[pro].c;
						// on recuperer la td (colonne) de div
						var MaTd = document.getElementById(id);
						// test pour se deplacer juste sur la verticale bas
						if((ligneRobot < reponse.nextPositions[pro].l) && (ColonneRobot == reponse.nextPositions[pro].c)){
							// on supprime la div de l'ancienne td 
							 div.parentNode.removeChild(div);
							 // on rajoute la div à la nouvelle position
							 MaTd.appendChild(div);
							 // on rajoute dans le tableau proposition les deplacement donnée par le joueur
							 proposition.push( {command: 'move', line:MaTd.ligne , column:MaTd.colonne} );
							 // on interroge le serveur
							 envoyerProposition(div);
						}
					}
					
				}
				});
	
}
function AppliquerTouche() {
	document.addEventListener('keydown', function() {return function(e){Touche(e);};}(),false);
}

function LaCible(plateau){
	document.getElementById(plateau.target.l+"ET"+plateau.target.c).classList.add( 'cibleDeCouleur' + plateau.target.t );	
}

function LesRobots(plateau){
	// boucle pour recuperer les robots avec leurs positions et leurs couleurs
	for (var nbre = 0; nbre < plateau.robots.length; nbre++) {
		var id=plateau.robots[nbre].line+"ET"+plateau.robots[nbre].column;
		//créé une div
		var div   = document.createElement('div');
		plateau.robots[nbre].div = div; 
		//mettre l'objet robot dans div.robot
		div.robot = plateau.robots[nbre];
		//rajouter une classe avec la bonne couleur dans chaque div
		div.classList.add(plateau.robots[nbre].color);
		//rajouter l'attribut draggable à la div
		div.setAttribute('draggable', 'true');
		//rendre la div deplacable
		div.addEventListener('dragstart', function(div) {return function(e){Ondragstart(div, e);};}(div),false);
        div.addEventListener('touchstart', function(div) {return function(e){Ondragstart(div, e);};}(div),true);
        div.addEventListener('click', function(div) {return function(e){Ondragstart(div, e);};}(div),true);
		//affecter la div à la bonne td
		document.getElementById(id).appendChild(div);
	}
}
