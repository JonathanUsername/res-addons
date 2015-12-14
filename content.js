
function showComments(cm) {
	if (commentsExist(cm)) return false
	var containing_div = '<div style="border-top:1px solid black;height:1px;width:100%;"></div>'
	res_comments_loading(cm, true)
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
			return prefix + containing_div + htmlDecode(c)
		})
		$('#commentsWindow' + window.frameCounter).html(html)
		res_comments_loading(cm, false)
	})
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function removeComments(cm) {
	if (!commentsExist(cm)) return false
	res_comments_loading(true)
	$('#commentsWindow' + window.frameCounter).remove()
	window.frameCounter--
	res_comments_loading(false)
}

function commentsExist(cm) {
	return cm.find('#commentsWindow' + window.frameCounter).length > 0 ? true : false
}

function res_comments_loading(cm, on) {
	if (on) {
		window.isBouncing = true;
		cm.append('<div id="res_comments_loading">LOADING...</div>')
	} else {
		$('#res_comments_loading').remove()
		window.setTimeout(function(){ window.isBouncing = false }, 250)
	}	
}

$(document).keypress(function(event){
	if (event.which == 109 && !window.isBouncing) { 
		var cm = $(".RES-keyNav-activeElement")
		showComments(cm)
	}
	if (event.which == 105 && !window.isBouncing) {
		var cm = $(".RES-keyNav-activeElement")
		removeComments(cm)
	}
})
