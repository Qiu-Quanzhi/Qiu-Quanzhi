function show() {
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

function enter(e) {
	e.stopPropagation();
	document.getElementById("cover").setAttribute("class", "cover entered")
	document.getElementById("sidebar-mask").setAttribute("class", "sidebar mask")
	document.getElementById("sidebar").setAttribute("class", "sidebar")
	setTimeout(function() {
		window.location.href = "https://Qiu-Quanzhi.github.io/HistoryMap/"
	}, 400)
}

window.addEventListener('load', show);
document.getElementById('enter-btn').addEventListener('click', enter);
