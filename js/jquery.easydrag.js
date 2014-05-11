/*
Gildas P. / www.gildasp.fr / Le 17/12/2012

http://www.gildasp.fr/exp/easydrag/


jQuery UI Draggable c'est bien, mais ce n'est pas compatible mobile/tablette,
et je dois toujours ajouter du code pour passer l'élément cliqué au premier plan.

jQuery easyDrag va mon loin que jQuery UI, mais il est plus facile à paramétrer et mieux adapté à une utilisation courante.


jQuery easyDrag, c'est un plugin :

- 10 fois plus léger que jQuery UI draggable !
- entièrement compatible tablette/mobile grâce aux Touch Events
- qui affiche un curseur explicite au survol des éléments draggables

et tout ça en une seule instruction Javascript, sans rien spécifier de particulier.


En option, comme avec jQuery UI Draggable, il est aussi possible de :

- contraindre le déplacement horizontalement ou verticalement
- contraindre le déplacement à l'intérieur d'une div
- spécifier une poignée de déplacement (un petit bout du grand bout qu'on déplace)
- de spécifier une fonction lors des événements du drag : start (mousedown) / drag (mousemove) / stop (mouseup)


Testé et approuvé sur Firefox, Safari, Opera, Chrome, IE 10, 9, 8, 7, 6, tablette Android, et iPhone.
Enjoy !

*/

(function($) {
    $.fn.easyDrag = function(params) {

    	params = $.extend({
    		handle: 'this', 
    		axis: false, 
    		container: false, 
    		start: function(){},
    		drag: function(){},
    		stop: function(){}
    	}, params);

    	/////////////////////////

		easyDrag_maxZindex = 0;

		// curseur
		if(params.handle == 'this'){
			handlers = this;
		} else {
			handlers = this.find(params.handle);
		}
		handlers.css('cursor', 'move');

		easyDrag_maxZindex = 0;

		this.each(function(){

			// les handlers se souviennent de leurs items draggables
			if(params.handle == 'this'){
				handle = $(this);
			} else {
				handle = $(this).find(params.handle);
			}
			handle.data('myDragItem', $(this));
			handle.data('axis', params.axis);
			handle.data('container', params.container);
			handle.data('startFunc', params.start);
			handle.data('dragFunc', params.drag);
			handle.data('stopFunc', params.stop);	

			// z-index
			if($(this).css('z-index')!='auto'){
				easyDrag_maxZindex = Math.max(easyDrag_maxZindex, $(this).css('z-index'));
			};

			// positionnement
			if($(this).css('position') == 'absolute' || $(this).css('position') == 'fixed'){
				handle.data('origX', 0);
				handle.data('origY', 0);
			} else {
				handle.data('origX', $(this).offset().left);
				handle.data('origY', $(this).offset().top);
				$(this).css('position', 'relative');
			}
		});

		// drag and drop

		// clic events
		handlers.mousedown(function(event){
			event.preventDefault();			
			easyDrag_moveEvent(event, $(this), 'mouse', event.pageX, event.pageY);

			$(document).mouseup(function(){
				dragHandle.data('stopFunc').call(dragItem); // stop event
				$(document).unbind('mousemove mouseup');
			});
		});

		// touch events
		handlers.bind('touchstart', function(event){
			event.preventDefault();
			touch = event.originalEvent.changedTouches[0];
			easyDrag_moveEvent(event, $(this), 'touch', touch.pageX, touch.pageY);

			$(document).bind('touchend', function(){
				dragHandle.data('stopFunc').call(dragItem); // stop event
				$(document).unbind('touchmove touchend');
			});
		});

    	////////////////////////////////////

    	return this;
    };
})(jQuery);


// le composant appelé autant pour le mousemove que le touchmove
function easyDrag_moveEvent(event, JQobject, moveType, initX, initY){


	// l'objet actuel du drag...
	dragItem = JQobject.data('myDragItem');
	dragHandle = JQobject;

	dragHandle.data('startFunc').call(dragItem); // start event

	easyDrag_decaleX = initX-dragItem.offset().left;
	easyDrag_decaleY = initY-dragItem.offset().top;

	easyDrag_Axis = JQobject.data('axis');
	easyDrag_Container = JQobject.data('container');
	easyDrag_dragFunc = dragHandle.data('dragFunc');
	easyDrag_origX = dragHandle.data('origX');
	easyDrag_origY = dragHandle.data('origY');

	if(moveType == "mouse"){
		$(document).bind('mousemove', function(event){
			event.preventDefault();

			easyDrag_dragFunc.call(dragItem); // drag event

			easyDrag_nextX = event.pageX-easyDrag_decaleX-easyDrag_origX;
			easyDrag_contain('h');
			if(!easyDrag_Axis || easyDrag_Axis == 'x'){
				dragItem.css('left', easyDrag_nextX+'px');
			}

			easyDrag_nextY = event.pageY-easyDrag_decaleY-easyDrag_origY;
			easyDrag_contain('y');
			if(!easyDrag_Axis || easyDrag_Axis == 'y'){
				dragItem.css('top', easyDrag_nextY+'px');
			}
		});
	} else {
		$(document).bind('touchmove', function(event){
			event.preventDefault();
			touch = event.originalEvent.changedTouches[0];

			easyDrag_dragFunc.call(dragItem); // drag event

			easyDrag_nextX = touch.pageX-easyDrag_decaleX-easyDrag_origX;
			easyDrag_contain('h');
			if(!easyDrag_Axis || easyDrag_Axis == 'x'){
				dragItem.css('left', easyDrag_nextX+'px');
			}

			easyDrag_nextY = touch.pageY-easyDrag_decaleY-easyDrag_origY;
			easyDrag_contain('y');
			if(!easyDrag_Axis || easyDrag_Axis == 'y'){
				dragItem.css('top', easyDrag_nextY+'px');
			}
		});
	}

	// over the top !
	easyDrag_maxZindex++;
	dragItem.css('z-index', easyDrag_maxZindex);
}

function easyDrag_contain(direction){
	if(direction == 'h'){
		if(easyDrag_Container && easyDrag_Container.length>0){
			limite1 = easyDrag_Container.offset().left-easyDrag_origX;
			limite2 = limite1+easyDrag_Container.width()-dragItem.innerWidth();
			limite1 += parseInt(dragItem.css('margin-left'));
			if(easyDrag_nextX<limite1){ easyDrag_nextX = limite1; }
			if(easyDrag_nextX>limite2){ easyDrag_nextX = limite2; }
		}
	} else {
		if(easyDrag_Container && easyDrag_Container.length>0){
			limite1 = easyDrag_Container.offset().top-easyDrag_origY;
			limite2 = limite1+easyDrag_Container.height()-dragItem.innerHeight();
			limite1 += parseInt(dragItem.css('margin-top'));
			if(easyDrag_nextY<limite1){ easyDrag_nextY = limite1; }
			if(easyDrag_nextY>limite2){ easyDrag_nextY = limite2; }
		}
	}
}