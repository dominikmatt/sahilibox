/**
 * SAHILIBOX 
 *
 * VERSION 0.1.1
 *
 * CAHNGELOG
 * 
 * VERSION 1.0
 * - ADDED: DEFAULT THEME
 * - ADDED: OVERLAY
 * - ADDED: PAGINATION
 * - ADDED: PLUGIN CORE
 * - ADDED: IMAGE HANDLER 
 *
 * author Dominik Matt <dma@massiveart.com>
 */
var init = false;

$.fn.sahilibox = function(options){
    options = $.extend({
        containerId: '#sahilibox',
        showThumbnails: 6,
        touchEvents: true,
        keyboardEvents: true,
        changeImageLoaded: function($element, index) {},
        changeImageBefore: function($element, index) {},
        imageDataChanged: function($element, index) {}
    }, options);
    
    var sb = {
        tmpl: [],
        curGallery: [],
        curImage: '',
        galleryDescription: [],
        curGalleryName: '',
        addedGalleryItems: [],
        lastTouchPosition: null,
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
                sb.closeBox();
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
            if(sb.curGallery.length <= 0) {
                sb.hideOverlay();
                sb.closeBox();
                console.log('no images are set on sahilibox: ' + galleryName);
            } else {
                sb.setGalleryImages(false);
                sb.initPagination();
            
                sb.showOverlay();
            }
            //enable body scrolling
            $('body').css('overflow', 'hidden');
            
            event.preventDefault();
            return false;
        },
        
        closeBox: function() 
        {
            //disable body scrolling
            $('body').css('overflow', 'auto');
             if(options.keyboardEvents == true) {
                 $(document).off("keydown");
             }
        },
        
        /*
         * open the overlay in a fade-in animation
         */
        showOverlay: function()
        {
            $(options.containerId).fadeIn(500);
            if(options.keyboardEvents == true) {
                sb.initKeyboardControl();
            }
            
            $(window).bind('resize', function() {
               sb.resizePagination(); 
            });
        },
        
        /*
         * close the overlay in a fade-out animation
         */
        hideOverlay: function() 
        {
            $('a').removeClass('sb-active');
        
            $(options.containerId).fadeOut(500);
            
            $(window).unbind('resize');
            $(options.containerId + ' .next').unbind('click');
            $(options.containerId + ' .prev').unbind('click');
        },
        
        /*
         * get all images for the gallery with this name
         */
        loadGalleryByName: function(name) 
        {
            sb.curGallery = [];
            $('a').each(function(i, value) {
                if($(this).data('sahilibox') == name && $(this).attr('href') != '#') {
                    sb.curGallery.push($(this));
                }
            });
            
            
            if((name in sb.addedGalleryItems) && sb.addedGalleryItems.length) {
                $.each(sb.addedGalleryItems[name], function() {
                    sb.curGallery.push($(this));
                });
            }
            
        },
        
        setCurrentImage: function($element)
        {
            sb.curImage = $element;
        },
        
        /*
        * Put pictures and description in the overlay
        */
        setGalleryImages: function(ajax)
        {
            //clear navigation
            $(options.containerId + ' .pagination ul').html('');
            if(ajax == false) {
                sb.curImage.addClass('sb-active');
            }
            
            var addClass = '';
            
            //set all navigation images
            $.each(sb.curGallery, function(i, image) {
                
                addClass = '';
                if(ajax == false) {
                    //check if this index is the cur image
                    if($(this).hasClass('sb-active')) {
                        sb.pag.curIndex = i;
                        addClass = ' sb-active';
                        sb.changeImageBefore($(this), i);
                    }
                } else {
                    if(i == sb.pag.curIndex) {
                        addClass = ' sb-active';
                    }
                }
                var imagePath = $(this).attr('href');
                
                var altTitle = '';
                if($(this).data('title') != '' && $(this).data('title') != undefined) {
                    altTitle = $(this).data('title') ;
                }
                $(options.containerId + ' .pagination ul').append('<li class="' + addClass + '" data-index="' + i + '"><img src="' + imagePath + '" alt="' + altTitle + '" style="display: none"><div class="border"></div></li>').find('img').load(function() {
                    $(this).show();
                    sb.slidePaginationToIndex(sb.pag.curIndex);
                });
            });
            
            if(ajax == false) {
                //show current image
                sb.changeImageData(0);
                var curImagePath = sb.curImage.attr('href');
                $(options.containerId + ' .content .image').html('<img src="' + curImagePath + '" alt="' + sb.curImage.data('title') + '" style="display: none">').find('img').load(function() {
                    sb.hideLoaderAndShowImage($(this));
                    sb.changeImageLoaded($(this), sb.pag.curIndex);
                });
                
                //set gallery description
                /*if(sb.galleryDescription[sb.curGalleryName] != undefined) {
                    $(options.containerId + ' .content .description').html(sb.galleryDescription[sb.curGalleryName]);
                } else {
                    $(options.containerId + ' .content .description').html('');
                }*/
            }
            
            
        },
        
        /*
         * change a image when we call the next or prev navigation or we click on a pagination item
         */
        changeImage: function(event, $element)
        {
            
            var index = $element.data('index');
            if(sb.pag.curIndex != index) {
                
                sb.changeImageData(index);
                
                sb.changeImageBefore($element, index);
                
                $(options.containerId + ' .pagination li').removeClass('sb-active');
                $element.addClass('sb-active');
                
                //set current index
                sb.pag.curIndex = index;
                
                sb.slidePaginationToIndex(index);
                
                $(options.containerId + ' .content .image').html('<img src="' + sb.curGallery[index].attr('href') + '" alt="' + sb.curGallery[index].data('title') + '" style="display: none">').find('img').load(function() {
                    sb.hideLoaderAndShowImage($(this));
                    sb.changeImageLoaded($(this));
                });
            }
        },
        
        changeImageData: function(index) 
        {
            $element = sb.curGallery[index];
            if($element.data('title') != '' && $element.data('title') != undefined) {
                helper.insertContent('title', $element.data('title'));
            } else {
                helper.insertContent('title', '');
            }
            
            if($element.data('description') != '' && $element.data('description') != undefined) {
                helper.insertContent('description', $element.data('description'));
            } else {
                helper.insertContent('description', '');
            }
            
            options.imageDataChanged($element, index);
        },
        
        hideLoaderAndShowImage: function($element)
        {
            $element.fadeIn();
        },
        
        /*
         * calculate the pagination item width and set the click events for the next and prev navigation
         */
        initPagination: function()
        {
            $(options.containerId + ' .pagination img').last().load(function() {
                var pagWidth = $(options.containerId + ' .pagination').width();
                var itemWidth = (pagWidth / options.showThumbnails);
                var pagContainerWidth = (itemWidth * sb.curGallery.length)+10;
                
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
                
                if(options.touchEvents == true) {
                    sb.initPaginationTouch();
                }
                
            }); 
        },
        
        initKeyboardControl: function() 
        {
            $(document).on('keydown', function(e) {
                var nextIndex = null;
                if(e.which == 37 || e.which == 40) {
                    nextIndex = sb.pag.curIndex-1;
                    if(nextIndex <= 0) {
                        nextIndex = 0;
                    }
                } else if(e.which == 39 || e.which == 38) {
                    nextIndex = sb.pag.curIndex+1;
                    if(nextIndex >= sb.curGallery.length) {
                        nextIndex = sb.curGallery.length-1;
                    }
                } else if(e.which == 27) {
                    sb.hideOverlay();
                    sb.closeBox();
                }
                
                
                if(nextIndex != null) {
                    var $pagLi = $(options.containerId + ' .pagination li');
                    var nextImage = $pagLi.get(nextIndex);
                    sb.changeImage(event, $(nextImage));
                }
            });
        },
        
        initPaginationTouch: function() 
        {
            $(document).on('touchmove', function(e) {
                x = e.originalEvent.touches[0].clientX;
                if(sb.lastTouchPosition == null) {
                    sb.lastTouchPosition = x;
                }

                var marginLeft = parseInt($(options.containerId + ' .pagination ul').css('margin-left'))-(sb.lastTouchPosition-x);
                
                if(marginLeft > 0) {
                    marginLeft = 0;
                }
                
                if(-((sb.curGallery.length-options.showThumbnails)*sb.pag.itemWidth) > marginLeft) {
                    marginLeft = -((sb.curGallery.length-options.showThumbnails)*sb.pag.itemWidth);
                }
                
                
                $(options.containerId + ' .pagination ul').css({
                    marginLeft: marginLeft + 'px'
                });
                
                sb.lastTouchPosition = x;
                e.preventDefault();
                
                
            });
            
            $(document).on('touchend', function(e) {
                sb.lastTouchPosition = null;
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

            //check if the gallery has more items then we show in the thumbnail
            if(sb.curGallery.length > options.showThumbnails) {
                $(options.containerId + ' .pagination ul').stop().animate({
                    marginLeft: marginLeft + 'px'
                }, 500);
            } else {
                $(options.containerId + ' .pagination ul').stop().animate({
                    marginLeft: '0'
                }, 500);
            }
        },
        
        /*
         * this function is calling after the image is changed and loaded
         */
        changeImageLoaded: function(element)
        {
            options.changeImageLoaded(element);
        },
        
        /*
         * this function is called before the image is changed
         */
        changeImageBefore: function($element, index)
        {
            options.changeImageBefore($element, index);

            //hide/show next button when the last item is selected
            if(sb.curGallery.length == (index+1) || sb.curGallery.length == 0 || sb.curGallery.length == 1) {
                if($(options.containerId + ' .next').css('opacity') != 0) {
                    $(options.containerId + ' .next').stop().animate({ 'opacity': '0'}, 500);
                }
            } else {
                $(options.containerId + ' .next').stop().animate({ 'opacity': '1'}, 500);
            }
            
            //hide/show prev button when first item is selected
            if(index == 0) {
                if($(options.containerId + ' .prev').css('opacity') != 0) {
                    $(options.containerId + ' .prev').stop().animate({ 'opacity': '0'}, 500);
                }
            } else {
                $(options.containerId + ' .prev').stop().animate({ 'opacity': '1'}, 500);
            }
        }
        
    };
    
    var helper = {
        replace: function(search, replace) 
        {
            search = '/{{' + search + '}}/g';
            var replaced = $(options.containerId).html().replace(search, replace);
            $("body").html(replaced);
        },
        
        insertContent: function(name, content) 
        {
            $(options.containerId + ' *[data-sahilibox-content="' + name + '"]').stop().fadeOut(0, function() {
                $(this).html(content);
                $(this).fadeIn(300);
            });
        }
    }
    
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
        },
        
        addImage: function(name, path, title, description) 
        {
            if(!(name in sb.addedGalleryItems)) {
                sb.addedGalleryItems.push(name);
                sb.addedGalleryItems[name] = [];
            }
            var image = $('<a/>', {
                            href: path,
                            style: 'display: none'
                        });
            image.data('title', title);
            image.data('description', description);
            sb.addedGalleryItems[name].push(image);
        },
        
        reload: function()
        {
            sb.loadGalleryByName(sb.curGalleryName);
            sb.setGalleryImages(true);
            sb.resizePagination();
        }
    };
    
    return actions;
    
    
};