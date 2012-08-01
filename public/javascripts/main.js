var socket = io.connect('http://10.1.10.5'), editor;

socket.on("connected", function(){
    console.log("connected");
    var file = window.file;
    
    editor = ace.edit('editor');
    
    socket.emit("filename", file);
    
    editor.getSession().on('change', function(){
        socket.emit("changed", {
            "filename" : file, 
            "data" : editor.getSession().getValue()
            });
    });
    
    socket.on('readfiledata', function (data) {
        editor.getSession().setValue(data);
    });
    
    socket.on("loadfile", function(data){
        editor.getSession().setValue(data);
    });
    
});

function genpdf(){
    socket.emit("renderPDF", window.file);
    console.log("genpdf called");
}