"use strict";
gereji.apps.register('basket', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(['.draggable:dragstart'], app.dragStart);
			sandbox.on(['.draggable:dragend'], app.dragEnd);
			sandbox.on(['.droppable:dragover'], app.dragOver);
			sandbox.on(['.droppable:dragenter'], app.dragEnter);
			sandbox.on(['.droppable:dragleave'], app.dragLeave);
			sandbox.on(['.droppable:drop'], app.drop);
		},
		dragStart: function(){
			var target = arguments[0].data.target;
			target.id = target.id ? target.id : sandbox.storage.uuid();
			var event = arguments[0].data.event;
			event.dataTransfer.setData("id", target.id);
		},
		dragOver: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
			event.dataTransfer.effectAllowed = 'move';
		},
		dragEnter: function(){
			var target = arguments[0].data.target;
			target.classList.add('dragover');
		},
		dragLeave: function(){
			var target = arguments[0].data.target;
			target.classList.remove('dragover');
		},
		drop: function(){
			var target = arguments[0].data.target;
			var event = arguments[0].data.event;
			var id = event.dataTransfer.getData("id");
			var subject = document.getElementById(id);
			target.appendChild(subject);
			target.classList.remove('dragover');
			var type = subject.getAttribute("name") + ":drop";
			sandbox.emit({type: type, data : {area : target, object: subject}});
		},
		dragEnd: function(){
			var target = arguments[0].data.target;
			target.classList.remove('dragover');
		}
	};
});
