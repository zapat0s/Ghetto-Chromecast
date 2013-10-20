var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var exec = require('child_process').exec;

process.on('uncaughtException', function (err) {
	if(err.errorno == 36) {
		console.log("Pipe Broke");
		return;
	}	
	console.error(err);
	console.log("Error occured: " + err);
});

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	
	// Accept Uploads
	if(uri == '/upload') {
		
		form = new formidable.IncomingForm();

		form.on('fileBegin', function(name, file) {
			file.path = 'pipe';
			console.log('Now Playing: ' + file.name);
			child = exec('cat pipe | vlc --fullscreen -');

			child.on('exit', function(code, signal) {
				console.log('VLC exited with code: ' + code);
			});
		});

		try {
			form.parse(req);
		}
		catch(err) {
			console.log('error: ' + err);
		}

		res.statusCode = 200;
		res.write('File recived.\n');
		res.end();
		return;
	}

	// Server static files	
	var filename = path.join('www', uri);
	if(filename =='www/') {
		filename = 'www/index.html';
	}
	fs.exists(filename, function(exists) {
		if(!exists) {
			console.log('404 error: ' + uri);
			res.statusCode = 404;
			res.write('404 File Not Found\n');
			res.end();
			return;
		}
		res.statusCode = 200;
		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	});
}).listen(8080, '127.0.0.1');
console.log('Server running at http://192.168.1.129:80');
