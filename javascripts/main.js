$(document).ready(function(){
	var jqSelectorWheel = $("#myPrettyID").SelectorWheel({"hiddenInput" : {"enabled":true, "id" : "hiddenInputID", "name" : "hiddenInputNAME"}});

	window.addEventListener("scroll", function(e){
		var nav = document.getElementById("navigation");
		nav.className = this.scrollY ? "sticky" : "";
	});

	$("nav ul li a").each(function(){
		$(this).click(function(){
			setTimeout(function(){
				$(window).scrollTop(window.scrollY-20-$(".push-up").height());
			},40);
		})
	})
})