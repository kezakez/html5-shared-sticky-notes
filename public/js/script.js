$(function () {
	var socket;
	try {
		socket = io.connect('http://localhost');
	} catch (err) {
		socket = null;
		io = null;
	}
	if (io) {
		socket.on('notedata', function (data) {
			// update notes from data
			updateNote(data.id, data.text, data.position);
		});
	}

	function updateNote(id, text, position) {
		var newnote, notetext;
		var found = $("#noteid"+id);
		
		if (found.length === 0) {
			notetext = $('<textarea></textarea>');
			newnote = $('<div class="note" id="noteid' + id +'"></div>');
			newnote.bind('drag', function (ev, dd) {
				$(this).css({
					'top': dd.offsetY,
					'left': dd.offsetX
				});
				saveNote(id, notetext.val(), newnote.position());
			});
			notetext.keyup(function () {
				saveNote(id, notetext.val(), newnote.position());
			});
			notetext.appendTo(newnote);
			newnote.appendTo($("#notes"));
		} else {
			notetext = found.find("textarea");
			newnote = found;
		}
		
		notetext.val(text);
		newnote.css({
			'position': 'absolute',
			'top': position.top,
			'left': position.left
		});
	}

	function loadNotes() {
		//localStorage.clear();
		// load all notes
		var notes = localStorage.length;
		if (notes) {
			for (var i = 0; i < notes; i++) {
				var note = localStorage.getItem(i);
				if (note) {
					note = JSON.parse(note);
					updateNote(note.id, note.text, note.position);
				}
			}
		}
		
		return notes;
	}

	function saveNote(id, text, position) {
		// save a note
		var note = {};
		note.id = id;
		note.text = text;
		note.position = position;
		localStorage.setItem(id, JSON.stringify(note));
		
		if (io) {
			socket.emit('notedata', note);
		}
	}
	
	var id = loadNotes();
	
	$("#addnote").click(function () {
		var text = "New Sticky Note";
		var pos = 50 + id * 100;
		var position = {top: pos, left: pos};
		updateNote(id, text, position);
		saveNote(id, text, position);
		id += 1;
	});
});
