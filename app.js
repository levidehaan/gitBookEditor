
/**
 * Module dependencies.
 */

var express = require('express'),
app = module.exports = express.createServer(),
fh = require("./filehandler.js").fh;
io = require('socket.io').listen(app),

    // Configuration

    app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(__dirname + '/public'));
    });

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/chapter', function(req, res){
    res.render('index', {
        title: 'jQuery Cookbook Editor - Editing chapter.adoc',
        file: "chapter"
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {

    socket.emit("connected");
    
    socket.on("filename", function(file){
        console.log("filename");
        console.log(file+".adoc");
        socket.emit("loadfile", fh.readS(file+".adoc"));
    })
    
    socket.on("changed", function(data){
            fh.writeS(data.filename+".adoc", data.data);
    });
    
    socket.on("renderPDF", function(filename){
        fh.renderPDF(filename);
    })

});