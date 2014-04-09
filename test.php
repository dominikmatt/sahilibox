<!DOCTYPE>
<html>
    <head>
        <title>Sahilibox</title>
        <link rel="stylesheet" type="text/css" href="css/sahilibox.css" />
    </head>
    <body>
    
    <a href="img/1.jpg" data-sahilibox="test">bild1</a>
    <a href="img/2.jpg" data-sahilibox="test">bild2</a>
    <a href="img/3.jpg" data-sahilibox="test">bild3</a>
    <a href="img/1.jpg" data-sahilibox="test">bild4</a>
    <a href="img/2.jpg" data-sahilibox="test">bild5</a>
    <a href="img/3.jpg" data-sahilibox="test">bild6</a>
    <a href="img/1.jpg" data-sahilibox="test">bild7</a>
    <a href="img/2.jpg" data-sahilibox="test">bild8</a>
    <a href="img/3.jpg" data-sahilibox="test">bild9</a>
    <a href="img/1.jpg" data-sahilibox="test">bild10</a>
    <a href="img/2.jpg" data-sahilibox="test">bild11</a>
    <a href="img/3.jpg" data-sahilibox="test">bild12</a>
    <a href="img/1.jpg" data-sahilibox="test1">bild1.1</a>
    <a href="#">andra link</a>
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script type="text/javascript" src="js/sahilibox.js"></script>
    <script type="text/javascript">
            $(document).ready(function() {
               var sahilibox = $(document).sahilibox({
                   showThumbnails: 7,
                   changeImageLoaded: function(element) {
                        var maxWidth = 640; // Max width for the image
                        var maxHeight = 480;    // Max height for the image
                        var ratio = 0;  // Used for aspect ratio
                        var width = $(element).width();    // Current image width
                        var height = $(element).height();  // Current image height
                
                        // Check if the current width is larger than the max
                        if(width > maxWidth){
                            ratio = maxWidth / width;   // get ratio for scaling image
                            $(element).css("width", maxWidth); // Set new width
                            $(element).css("height", height * ratio);  // Scale height based on ratio
                            height = height * ratio;    // Reset height to match scaled image
                            width = width * ratio;    // Reset width to match scaled image
                            $(element).css('margin-top', -(height/2) + 'px');
                        }
                
                        // Check if current height is larger than max
                        if(height > maxHeight){
                            ratio = maxHeight / height; // get ratio for scaling image
                            $(element).css("height", maxHeight);   // Set new height
                            $(element).css("width", width * ratio);    // Scale width based on ratio
                            width = width * ratio;    // Reset width to match scaled image
                            height = height * ratio;    // Reset height to match scaled image
                        }
                        
                        $(element).css('margin-top', -(height/2) + 'px');
                        $(element).css('margin-left', -(width/2) + 'px');
                   }
               });
               sahilibox.addDescription('test', '<h2>TEST TITEL</h2><p>TESTDESCRIPTION</p><div class="desc-bottom"><a href="#" class="button">Anfrage senden &raquo;</a></div>');
               sahilibox.add('test1', 'img/3.jpg');
               sahilibox.add('test1', 'img/2.jpg');
               setInterval(function() {
                   sahilibox.add('test1', 'img/2.jpg');
                   sahilibox.reload();
               }, 2000);
            });
        </script>
    </body>
</html>