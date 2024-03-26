function show() {
	let that = this
	setTimeout(function() {
		document.getElementById("cover").setAttribute("class", "cover loaded")
	}, 100)
	setTimeout(function() {
		document.getElementById("sidebar-mask").setAttribute("class", "sidebar mask loaded")
	}, 500)
	setTimeout(function() {
		document.getElementById("sidebar").setAttribute("class", "sidebar loaded")
	}, 1000)
}

function enter() {
	event.stopPropagation();
	document.getElementById("cover").setAttribute("class", "cover entered")
	document.getElementById("sidebar-mask").setAttribute("class", "sidebar mask")
	document.getElementById("sidebar").setAttribute("class", "sidebar")
	setTimeout(function() {
		window.location.href = "//historyApp.qqzhi.cc"
	}, 400)
}
