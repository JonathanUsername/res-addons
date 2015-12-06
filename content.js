
function showComments(cm) {
	var divvy = '<div style="border-top:1px solid black;height:1px;width:100%;"></div>'
	if (cm.find('commentsWindow' + window.frameCounter).length > 0){
		return false
	}
	bouncing(cm, true)
	window.frameCounter ? window.frameCounter++ : window.frameCounter = 1
	var url = cm.find(".comments").attr("href").replace(/\/$/, '') + ".json"
	$('<div />', {
	  id: 'commentsWindow' + window.frameCounter
	}).appendTo(cm);
	$.get(url, function(d){
		var comments_arr = d[1].data.children.map(function(i) {
			var html = i.data.body_html
			return html
		})
		var html = comments_arr.reduce(function(p, c, i) {
			var prefix
			if (i === 1)
				prefix = htmlDecode(p)
			else
				prefix = p
			return prefix + divvy + htmlDecode(c)
		})
		$('#commentsWindow' + window.frameCounter).html(html)
		bouncing(cm, false)
	})
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function removeComments() {
	bouncing(true)
	$('#commentsWindow' + window.frameCounter).remove()
	window.frameCounter--
	bouncing(false)
}

function bouncing(cm, on) {
	if (on) {
		window.isBouncing = true;
		cm.append('<div id="bouncing">LOADING...</div>')
	} else {
		$('#bouncing').remove()
		window.setTimeout(function(){ window.isBouncing = false }, 250)
	}	
}

$(document).keypress(function(event){
	if (event.which == 59 && !window.isBouncing) { // semicolon
		console.log('got semicolon')
		var cm = $(".RES-keyNav-activeElement")
		showComments(cm)
	}
	if (event.which == 39 && !window.isBouncing) { // apostrophe
		console.log('got apostrophe')
		var cm = $(".RES-keyNav-activeElement")
		removeComments(cm)
	}
})
