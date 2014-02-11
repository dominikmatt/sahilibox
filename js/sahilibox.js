/**
 * SAHILIBOX 
 *
 * author Dominik Matt <dma@massiveart.com>
 */
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
            if($(options.containerId).length == 0) {
                sb.tmpl['overlay'] = sb.loadTemplate('overlay', 'initOverlay');
            } else {
                sb.setEvents();
            }
            
            //search for galleries
            sb.gallerySearch();
            
        },
        
        setEvents: function()
        {
            $(options.containerId + ' .pagination').delegate('li', 'click', function(event) {
                sb.changeImage(event, $(this));
            });
            
            /* close overlay */
            $(options.containerId + ' .close, ' + options.containerId + ' .overlay-bg').on('click', function() {
                sb.hideOverlay();
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
            sb.setEvents();
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
        
        /*
         * open the overlay in a fade-in animation
         */
        showOverlay: function()
        {
            $(options.containerId).show().animate({
                opacity: '1'
            }, 500);
            
            $(window).bind('resize', function() {
               sb.resizePagination(); 
            });
        },
        
        /*
         * close the overlay in a fade-out animation
         */
        hideOverlay: function() 
        {
            $(options.containerId).animate({
                opacity: '0'
            }, 500, function() {
                $(this).hide();
            });
            
            $(window).unbind('resize');
        },
        
        /*
         * get all images for the gallery with this name
         */
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
            
            var addClass = '';
            //set all navigation images
            $.each(sb.curGallery, function(i, image) {
                
                addClass = '';
                //check if this index is the cur image
                if($(this).hasClass('sb-active')) {
                    sb.pag.curIndex = i;
                    addClass = ' sb-active';
                    sb.slidePaginationToIndex(i);
                }
            
                var imagePath = $(this).attr('href');
                $(options.containerId + ' .pagination ul').append('<li class="' + addClass + '" data-index="' + i + '"><img src="' + imagePath + '" alt=""><div class="border"></div></li>');
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
        
        /*
         * change a image when we call the next or prev navigation or we click on a pagination item
         */
        changeImage: function(event, $element)
        {
            var index = $element.data('index');
            $(options.containerId + ' .pagination li').removeClass('sb-active');
            $element.addClass('sb-active');
            
            //set current index
            sb.pag.curIndex = index;
            
            sb.slidePaginationToIndex(index);
            
            $(options.containerId + ' .content .image').html('<img src="' + sb.curGallery[index].attr('href') + '" alt="">');
        },
        
        /*
         * calculate the pagination item width and set the click events for the next and prev navigation
         */
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
        
        /*
         * that we ar responsive we must resize the pagination
         */
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
        
        /*
         * next navigation
         */
        nextImage: function(event)
        {
            var curIndex = sb.pag.curIndex;
            var nextIndex = curIndex+1;
            console.log(curIndex + ' - ' + nextIndex);
            var $pagLi = $(options.containerId + ' .pagination li');
            
            if($pagLi.length > nextIndex) {
                var nextImage = $pagLi.get(nextIndex);
                sb.changeImage(event, $(nextImage));
            }
        },
        
        /*
         * prev navigation
         */
        prevImage: function(event)
        {
            var curIndex = sb.pag.curIndex;
            var nextIndex = curIndex-1;
            console.log(curIndex + ' - ' + nextIndex);
            var $pagLi = $(options.containerId + ' .pagination li');
            
            if(nextIndex >= 0) {
                var nextImage = $pagLi.get(nextIndex);
                sb.changeImage(event, $(nextImage));
            }
        },
        
        /*
         * will calculate the center item in the navigation and then the function will do the animation
         */
        slidePaginationToIndex: function(index) {
            //calculate the first image of the pagination
            var firstIndex = (index-parseInt(options.showThumbnails/2));
            
            //if we are smaller then 0
            if(firstIndex < 0) {
                firstIndex = 0;
            // if there ist not more items in the pagination
            } else if(firstIndex > (sb.curGallery.length-options.showThumbnails)) {
                firstIndex = sb.curGallery.length-options.showThumbnails;
            }
            
            //calculate the margin left of the pagination and make a animation to this point
            var marginLeft = -(sb.pag.itemWidth*firstIndex);
            
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
            sb.galleryDescription[galleryName] = description;
        }
    };
    
    return actions;
    
    
};