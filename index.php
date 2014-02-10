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
    <a href="img/1.jpg" data-sahilibox="test1">bild1.1</a>
    <a href="#">andra link</a>
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script type="text/javascript" src="js/sahilibox.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
           var sahilibox = $(document).sahilibox();
           sahilibox.addDescription('test', '<h3>titel</h3><p>das ist eine beschreibung</p>');
        });
    </script>
    </body>
</html>