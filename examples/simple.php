<!DOCTYPE>
<html>
    <head>
        <title>Sahilibox</title>
        <link rel="stylesheet" type="text/css" href="css/sahilibox.css" />
    </head>
    <body>
    
    <a href="img/1.jpg" data-sahilibox="gallery-1">bild1</a>
    <a href="img/2.jpg" data-sahilibox="gallery-1">bild2</a>
    <a href="img/3.jpg" data-sahilibox="gallery-1">bild3</a>
    <a href="img/1.jpg" data-sahilibox="gallery-1">bild4</a>
    <a href="img/2.jpg" data-sahilibox="gallery-1">bild5</a>
    <a href="img/3.jpg" data-sahilibox="gallery-1">bild6</a>
    <a href="img/1.jpg" data-sahilibox="gallery-1">bild7</a>
    <a href="img/2.jpg" data-sahilibox="gallery-2">bild8</a>
    <a href="img/3.jpg" data-sahilibox="gallery-2">bild9</a>
    <a href="img/1.jpg" data-sahilibox="gallery-2">bild10</a>
    <a href="img/2.jpg" data-sahilibox="gallery-2">bild11</a>
    <a href="img/3.jpg" data-sahilibox="gallery-2">bild12</a>
    <a href="img/1.jpg" data-sahilibox="gallery-2">bild1.1</a>
    <a href="#">andra link</a>
    
    <div id="sahilibox">
        <div class="overlay-bg"></div>
        <div class="overlay">   
            <span class="close"><span class="icon-cross">&nbsp;</span></span>
            <div class="content">
                <div class="image">
    
                </div>
            </div>
            <div class="pagination">
                <div class="prev"><span class="icon-arrow-left">&nbsp;</span></div>
                <ul>
    
                </ul>
                <div class="next"><span class="icon-arrow-right">&nbsp;</span></div>
            </div>
        </div>
    </div>

    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script type="text/javascript" src="../js/sahilibox.js"></script>
    <script type="text/javascript">
            $(document).ready(function() {
               var sahilibox = $(document).sahilibox({
                   showThumbnails: 7
               });
            });
        </script>
    </body>
</html>