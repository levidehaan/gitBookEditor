var fs = require('fs'), spawn = require('child_process').spawn;

exports.fh = {    
    
    writeS : function(file, data){
        var wStream = fs.createWriteStream(process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile" + file);
        wStream.once('open', function(fd) {
            wStream.write(data, "utf8");
        });
    },
    
    readS : function(file){
        console.log("reading test.adoc");
        try {
            var data = fs.readFileSync(process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file, 'utf8');
        } catch (e) {}
        return data;
    },
    renderPDF : function(file){
        var asciidoc = spawn("asciidoc --backend docbook45  --verbose --out-file chapter.xml " + process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".adoc");
        asciidoc.on('exit', function (code) {
            console.log("ran against" + process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".adoc");
            console.log('asciidoc exited with code ' + code);
            var xmllint = spawn("xmllint --nonet --noout --valid" + process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".xml");
            xmllint.on('exit', function (code) {
                console.log("ran against" + process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".xml");
                console.log('xmllint exited with code ' + code);
                var dblatex = spawn("dblatex -t pdf -p /etc/asciidoc/dblatex/asciidoc-dblatex.xsl -s /etc/asciidoc/dblatex/asciidoc-dblatex.sty -V" + process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".xml");
                dblatex.on('exit', function (code) {
                    console.log("ran against" + process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".xml");
                    console.log('dblatex exited with code ' + code);
                    fs.stat(process.cwd() + "/public/book/9-building-testing-and-debugging-in-mobile/" + file + ".pdf", function (err, stats) {
                        if (err) throw err;
                        console.log('Generated PDF stats: ' + JSON.stringify(stats));
                    });
                });
            });
        });
        
    }
    

/*
asciidoc --backend docbook45  --verbose --out-file chapter.xml chapter.adoc
xmllint --nonet --noout --valid chapter.xml
dblatex -t pdf -p /etc/asciidoc/dblatex/asciidoc-dblatex.xsl -s /etc/asciidoc/dblatex/asciidoc-dblatex.sty  -V  recipe-1.xml
     */
};