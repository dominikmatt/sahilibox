var init = false;

$.fn.sahilibox = function(options){
    var options = $.extend({
        containerId: '#sahilibox',
        showThumbnails: 6
    }, options);
    
    var sb = {
        tmpl: [],
        curGallery: [],
        curImage: '',
        galleryDescription: [],
        curGalleryName: '',
        pag : {
            itemWidth: 0,
            containerWidth: 0,
            curIndex: 0
        },
    
        init: function() 
        {
            //load overlay template
            sb.tmpl['overlay'] = sb.loadTemplate('overlay', 'initOverlay');
            
            //search for galleries
            sb.gallerySearch();
            
        },
        
        setEvents: function()
        {
            $(options.containerId + ' .pagination').delegate('li', 'click', function(event) {
                console.log('test');
                sb.changeImage(event, $(this));
            });
        },
        
        /*
        * load the template that we need
        */
        loadTemplate: function(template, callback)
        {
            return $.ajax({
              url: 'template/' + template + '.html',
              type: 'POST',
              cache: true
            }).done(function( data ) {
                if(callback != false) {
                    sb['initOverlay']();
                }
                return data.responseText;
            }).fail(function() {
                if ( console && console.log ) {
                    console.log('Sahilibox: Template not found');
                    return false;
                }
            });
        },
        
        /*
        * append the overlay template to the body container
        */
        initOverlay: function()
        {
            $('body').append(sb.tmpl['overlay'].responseText);
            
            $('#sahilibox .close, #sahilibox .overlay-bg').on('click', function() {
                sb.hideOverlay();
            });
            
            sb.setEvents()
        },
        
        /*
        * search for link this open the gallery
        */
        gallerySearch: function()
        {
            $('a').each(function(i, value) {
                var $element = $(this);
                if($element.data('sahilibox') != undefined) {
                    
                    $element.on('click', function(event) {
                        sb.openBox(event, $element);
                    });
                }
            });
        },
        
        /*
        * open the overlay when the user select an image
        */
        openBox: function(event, $element)
        {
            
            var galleryName = $element.data('sahilibox');
            sb.curGalleryName = galleryName;
            sb.setCurrentImage($element);
            sb.loadGalleryByName(galleryName);
            sb.setGalleryImages();
            sb.initPagination();
               
            sb.showOverlay();
            
            event.preventDefault();
            return false;
        },
        
        showOverlay: function()
        {
            $('#sahilibox').show().animate({
                opacity: '1'
            }, 500);
            
            $(window).bind('resize', function() {
               sb.resizePagination(); 
            });
        },
        
        hideOverlay: function() 
        {
            $('#sahilibox').animate({
                opacity: '0'
            }, 500, function() {
                $(this).hide();
            });
            
            $(window).unbind('resize');
        },
        
        loadGalleryByName: function(name) 
        {
            sb.curGallery = [];
            $('a').each(function(i, value) {
                if($(this).data('sahilibox') == name) {
                    sb.curGallery.push($(this));
                }
            });
        },
        
        setCurrentImage: function($element)
        {
            sb.curImage = $element;
        },
        
        /*
        * Put pictures and description in the overlay
        */
        setGalleryImages: function()
        {
            //clear navigation
            $(options.containerId + ' .pagination ul').html('');
            sb.curImage.addClass('sb-active');
            
            //set all navigation images
            $.each(sb.curGallery, function(i, image) {
                
                //check if this index is the cur image
                if($(this).hasClass('sb-active')) {
                    sb.pag.curIndex = i;
                }
            
                var imagePath = $(this).attr('href');
                $(options.containerId + ' .pagination ul').append('<li data-index="' + i + '"><img src="' + imagePath + '" alt=""></li>');
            });
            
            //show current image
            var curImagePath = sb.curImage.attr('href');
            $(options.containerId + ' .content .image').html('<img src="' + curImagePath + '" alt="">');
            
            //set gallery description
            if(sb.galleryDescription[sb.curGalleryName] != undefined) {
                $(options.containerId + ' .content .description').html(sb.galleryDescription[sb.curGalleryName]);
            } else {
                $(options.containerId + ' .content .description').html('');
            }
        },
        
        changeImage: function(event, $element)
        {
            var index = $element.data('index');
            
            //set current index
            sb.pag.curIndex = index;
            
            console.log(sb.curGallery[index].attr('href'));
            
            $(options.containerId + ' .content .image').html('<img src="' + sb.curGallery[index].attr('href') + '" alt="">');
        },
        
        initPagination: function()
        {
            $(options.containerId + ' .pagination img').last().load(function() {
                var pagWidth = $(options.containerId + ' .pagination').width();
                var itemWidth = (pagWidth / options.showThumbnails);
                var pagContainerWidth = itemWidth * sb.curGallery.length;
                
                sb.pag.itemWidth = itemWidth;
                sb.pag.containerWidth = pagContainerWidth;
                
                $(options.containerId + ' .pagination li').css({
                    width: itemWidth + 'px'
                });
                
                $(options.containerId + ' .pagination ul').css({
                    width:  pagContainerWidth + 'px'
                });
                
                $(options.containerId + ' .next').bind('click', function(event) {
                    sb.nextImage(event);
                });
                
                $(options.containerId + ' .prev').bind('click', function(event) {
                    sb.prevImage(event);
                });
                
            }); 
        },
        
        resizePagination: function() 
        {
            var pagWidth = $(options.containerId + ' .pagination').width();
            var itemWidth = (pagWidth / options.showThumbnails);
            var pagContainerWidth = itemWidth * sb.curGallery.length;
            
            sb.pag.itemWidth = itemWidth;
            sb.pag.containerWidth = pagContainerWidth;
            
            $(options.containerId + ' .pagination li').css({
                width: itemWidth + 'px'
            });
            
            $(options.containerId + ' .pagination ul').css({
                width:  pagContainerWidth + 'px'
            });
        },
        
        nextImage: function(event)
        {
            var curIndex = sb.pag.curIndex;
            var nextIndex = curIndex+1;
            var $pagLi = $(options.containerId + ' .pagination li');
            
            if($pagLi.length > nextIndex) {
                var nextImage = $pagLi.get(nextIndex);
                sb.changeImage(event, $(nextImage));
                sb.slidePaginationToIndex(nextIndex);
            }
        },
        
        prevImage: function(event)
        {
            var curIndex = sb.pag.curIndex;
            var nextIndex = curIndex-1;
            var $pagLi = $(options.containerId + ' .pagination li');
            
            if(nextIndex >= 0) {
                var nextImage = $pagLi.get(nextIndex);
                sb.changeImage(event, $(nextImage));
                sb.slidePaginationToIndex(nextIndex);
            }
        },
        
        slidePaginationToIndex: function(index) {
            var marginLeft = sb.pag.itemWidth*index;
            console.log(marginLeft);
            $(options.containerId + ' .pagination ul').stop().animate({
                marginLeft: marginLeft + 'px'
            }, 500);
        }
        
    };
    
    if(init == false) {
        init = true;
        sb.init();
    }
    
    /*
    * DEFINE USER ACTIONS
    */
    var actions = {
        
        addDescription: function(galleryName, description)
        {
            console.log(init);
            sb.galleryDescription[galleryName] = description;
        }
    };
    
    return actions;
    
    
};

