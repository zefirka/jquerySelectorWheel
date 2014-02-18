(function(){
	
	window.addEventListener("scroll", function(e){
		var nav = document.getElementById("navigation");
		nav.className = this.scrollY ? "sticky" : "";
	});
})();

$(function() {
	var jqSelectorWheel = $("#myPrettyID").SelectorWheel({"hiddenInput" : {"enabled":true, "id" : "hiddenInputID", "name" : "hiddenInputNAME"}});
});