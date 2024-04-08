var path = require("path");
var fs = require("fs");
renameFilesInDir('./dist');

function changeFileName(filepath) {
	fs.stat(filepath, function (err, stats) {
		if (stats.isFile()) {
			//console.log("isFile,chaning filename...");
			var filename = path.basename(filepath);
			var parentDir = path.dirname(filepath);
			var parentDirname = path.basename(path.dirname(filepath));
			var thisFilename = path.basename(__filename);
			//console.log(thisFilename);
			//这个if就是进行更改文件名的逻辑,可以自行定义,这里定义为将文件命名为当前文件夹的名字加"-文件自身名"
			if (filename != thisFilename && filename.indexOf(parentDirname) < 0) {
				var newName = filename.replace(".gz", "").replace(".br", "");
				var newPath = parentDir + "\\" + newName;
				if (filepath != newPath) {
					console.log(filepath, newPath);
					fs.rename(filepath, newPath, () => { });
				}
			}
		} else if (stats.isDirectory()) {
			// console.log("============["+filepath+"] isDir===========");
			renameFilesInDir(filepath);
		}
	});
}

function renameFilesInDir(dir) {
	fs.readdir(dir, function (error, files) {
		var len = files.length;
		var file = null;
		for (var i = 0; i < len; i++) {
			file = files[i];
			changeFileName(dir + "\\" + file);
		}
	});
}