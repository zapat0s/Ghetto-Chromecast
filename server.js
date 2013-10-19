var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var exec = require('child_process').exec;

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	console.log("request method: " + req.method);
	if(uri == '/upload') {
		console.log('uploading shit');
		
		form = new formidable.IncomingForm();
		form.uploadDir = 'uploads';
		console.log(form.type + '\n');
		var uploaded_file;
		

		form.on('fileBegin', function(name, file) {
			file.path = 'pipe';
			child = exec('cat pipe | vlc -');
		});

		form.on('file', function(field, file) {
			uploaded_file = file.name;
			console.log(uploaded_file);
		});

		form.parse(req);

		res.writeHead(200, {'content-type': 'text/plain'});
		res.write('received upload:\n\n');
		res.end();
		return;
	}
	else if(uri =='/upload') {
		res.writeHead(200, {'content-type': 'text/plain'});
		res.write('Please select a file to upload');
		res.end();
		return;
	}
	var filename = path.join('www', uri);
	if(filename =='www/') {
		filename = 'www/index.html';
	}
	fs.exists(filename, function(exists) {
		if(!exists) {
			console.log("404 error: " + uri);
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.write('404 Not Found\n');
			res.end();
			return;
		}
		res.writeHead(200, 'text/plain');
		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	});
}).listen(8080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:80');
