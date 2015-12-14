function showComments(cm) {
    if (commentsExist(cm)) return false
    var containing_div = '<div style="border-top:1px solid black;height:1px;width:100%;"></div>'
    resCommentsLoading(cm, true)
    window.frameCounter ? window.frameCounter++ : window.frameCounter = 1
    var url = cm.find(".comments").attr("href").replace(/\/$/, '') + ".json"
    $('<div />', {
        id: 'commentsWindow' + window.frameCounter
    }).appendTo(cm);
    $.get(url)
        .done(function(d) {
            var children = d[1].data.children
            if (typeof d !== "object" || children.length === 0)
                return removeComments(cm)
            var comments_arr = children.map(function(i) {
                var html_chunk = i.data.body_html
                return html_chunk
            })
            var html = htmlDecode(comments_arr[0])
            if (comments_arr.length > 1) {
            	html = comments_arr.reduce(function(p, c, i) {
            		if (i > 0)
		                return p + containing_div + htmlDecode(c)
		            else
		            	return ''
	            })
	        }
            $('#commentsWindow' + window.frameCounter).html(html)
            resCommentsLoading(cm, false)
        })
        .fail(function(e) {
            removeComments(cm)
        })
}

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function removeComments(cm) {
    if (!commentsExist(cm)) return false
    resCommentsLoading(true)
    $('#commentsWindow' + window.frameCounter).remove()
    window.frameCounter--
        resCommentsLoading(false)
}

function commentsExist(cm) {
    return cm.find('#commentsWindow' + window.frameCounter).length > 0 ? true : false
}

function resCommentsLoading(cm, on) {
    if (on) {
        window.isBouncing = true;
        cm.append('<div id="resCommentsLoading">LOADING...</div>')
    } else {
        $('#resCommentsLoading').remove()
        window.setTimeout(function() {
            window.isBouncing = false
        }, 250)
    }
}

$(document).keypress(function(event) {
    if (event.which == 109 && !window.isBouncing) {
        var cm = $(".RES-keyNav-activeElement")
        showComments(cm)
    }
    if (event.which == 105 && !window.isBouncing) {
        var cm = $(".RES-keyNav-activeElement")
        removeComments(cm)
    }
})