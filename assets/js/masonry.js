jQuery(window).on('load', function() {
  
  $('.grid').masonry({
    itemSelector : '.card',
    percentPosition: true,
    stagger: 30,
    columnWidth: '.card',
  });
  	$('a[data-toggle=tab]').each(function () {
		var $this = $(this);

		$this.on('shown.bs.tab', function () {
		
            $('.grid').masonry({
                itemSelector : '.card',
                percentPosition: true,
                // gutter: 10,
                stagger: 30,
                columnWidth: '.card',
              });

		}); //end shown
	});  //end each
});