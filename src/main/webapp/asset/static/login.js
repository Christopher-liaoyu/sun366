 $(document).ready(function(){
	$('.form-radios label:first').click(function(e){
		$('.form-radios label:first').addClass('active');
		$('.form-radios label:last').removeClass('active');
	});
	$('.form-radios label:last').click(function(e){
		$('.form-radios label:last').addClass('active');
		$('.form-radios label:first').removeClass('active');
	});
});