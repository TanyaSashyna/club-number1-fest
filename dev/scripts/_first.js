var html = document.documentElement,
	body = document.body,
	isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

html.className = html.className.replace('no-js', '');

if(isTouchDevice) {
	html.className += ' touch';
}
else {
	html.className += ' no-touch';
}