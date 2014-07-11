//= require jquery-ui-1.10.4.custom.min
//= require jquery.easing.1.3
//= require gfw/ui/circle

// Circle
$(document).ready(function(){
	var $map = $('#map');

	Circle = new gfw.ui.view.Circle({ circles: circleSummary });
	$map.append(Circle.render());
	Circle.show();

	$map.on('click', function(){
		window.location.replace('/map');
	})
});
