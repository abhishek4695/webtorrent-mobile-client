var client = new WebTorrent();
var bufArray,nameArray,typeArray;
var JsonArray;
var initialHref = window.location.href;
var modal = document.getElementById('myModal');
var modalImg = document.getElementById("img01");
var modalVid = document.getElementById("player");
//var deldiv = document.getElementById("cancerdiv");
modal.onclick = function() { 
    modal.style.display = "none";
	modalImg.style.display = "none";
	modalVid.style.display = "block";
	//deldiv.style.display = "block";
	modalVid.pause();
	backflag = true;
}

var lastTimeBackPress=0;
var timePeriodToExit=2000;
var backflag = true;

function onBackKeyDown(e){
	if(backflag){
	e.preventDefault();
    e.stopPropagation();
    if(new Date().getTime() - lastTimeBackPress < timePeriodToExit){
		cordova.plugins.notification.local.cancel(1, function() {
		console.log("done");
		});
        navigator.app.exitApp();
		
    }else{
        window.plugins.toast.showWithOptions(
            {
              message: "Press again to exit.",
              duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          );
        
        lastTimeBackPress=new Date().getTime();
    }
	}
	else{
		modal.style.display = "none";
		modalImg.style.display = "none";
		modalVid.style.display = "block";
		modalVid.pause();
		backflag = true;
	}
};

document.addEventListener("backbutton", onBackKeyDown, false);

var storage = window.localStorage;
if (storage.getItem("installed") == undefined) {
   storage.setItem('index', 1)
   storage.setItem("installed", true);
}


var collapsible = document.createElement('ul');
	collapsible.id = "maincollapsible";
	collapsible.className = "col s10 m10"
	document.querySelector('.logE').appendChild(collapsible);

client.on('error', function (err) {
        console.error('ERROR: ' + err.message)
		logger(err.message);
		logger(err.message);
		
		})
document.getElementById('form1').addEventListener('submit', function (e) {
        e.preventDefault() // Prevent page refresh

        var torrentId = document.querySelector('form input[name=torrentId]').value
		console.log(torrentId);
        //logD('Adding Requested Torrent ', 0 , ' ')
        client.add(torrentId, onTorrent)
		document.getElementById('textfield').value = '';
      })
document.getElementById('form').addEventListener('change' , function(e){
	var files = document.getElementById('upload').files;
	Array.prototype.forEach.call(files, function(file) {
			if(file == files[files.length-1]){
				document.getElementById('desc').value += file.name;
			}
			else{
				document.getElementById('desc').value += file.name + ',';
			}
	});
	/*cordova.plugins.notification.local.update({
    id: 1,
    title: "Updated Notification",
	text:   'Download speed: ' + filesize(client.downloadSpeed) + '/s ' +
			'Upload speed: ' + filesize(client.uploadSpeed) + '/s \n'
	});*/
    
})
function loader(){
	console.log(client.downloadSpeed);
	console.log(window.FileList);
	StartUpLoader();
}

function aboutusf(){
	
}

var interval = setInterval(function () {
	cordova.plugins.notification.local.update({
    id: 1,
    title: "App is Running",
	text:   'Download speed: ' + filesize(client.downloadSpeed) + '/s ' +
			'Upload speed: ' + filesize(client.uploadSpeed) + '/s \n',
	sound: null
	});
},1000);
document.getElementById('form').addEventListener('submit' , function(e){
		  e.preventDefault();
		  var files = document.getElementById('upload').files;
		  var bufArr = [];
		  var nameArr = [];
		  var typeArr = [];
		  console.log(files);
		  document.getElementById('desc').value = '';
		  client.seed(files, function(torrent){
			  var i = 0;
			console.log(files[0].name + ' : ' + torrent.infoHash);
		  //logU('Seeding Selected files. Click the button on top to copy magnet URI to clipboard' + '\n');
		  window.plugins.toast.show('Seeding selected files. It may take a while to add the torrent on UI for large files.', 'short', 'bottom');
		  torrentUI(torrent,parseInt(storage.getItem('index')));
			$('.collapsible').collapsible();
		  torrent.files.forEach(function (file) {
          //file.appendTo('.logU')
          file.getBlobURL(function (err, url) {
            if (err) return log(err.message)
		file.getBlob(function(err,blob){
				if (err) console.log(err.message)
				//logU('<a href="' + url + '">Save to Device   ' + file.name + '</a>',1,file.name,blob)
		})
		  })
		file.getBuffer(function (err, buffer) {
			if (err) throw err
			bufArr.push(buffer);
			nameArr.push(file.name);
			typeArr.push(files[i].type);
			if (file == torrent.files[torrent.files.length-1]){
				getArrays(JSON.stringify(bufArr),JSON.stringify(nameArr),JSON.stringify(typeArr));
				WriteToDisk();
			}
		  i++; 
		})
        })
		document.getElementById('results').value = torrent.magnetURI;
		  })
	  })

function onTorrent (torrent) {
		var bufArr = [];
		var nameArr = [];
		var typeArr = [];
		var i = 0;
		var files = torrent.files;
        //logD('Got torrent metadata!',0,' ')
		window.plugins.toast.show('Got torrent metadata! Torrent will be added shortly', 'short', 'bottom');
		document.getElementById('results').value = torrent.magnetURI;
        //logD(
         // 'File Name: ' + torrent.name + ' ' ,0, ' ');

        // Print out progress every 5 seconds
        var interval = setInterval(function () {
          var progress = (100 * torrent.progress).toFixed(1)
		  var remaining
			if (torrent.done) {
				remaining = 'Done.'
			} else {
			remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
			remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
		}
		  console.log(filesize(torrent.downloadSpeed))
		  updateSpeed(
			'<b>Peers:</b> ' + torrent.numPeers + ' ' + '\n' +
			'<b>Progress:</b> ' + progress + '% ' +
			'<b>Download speed:</b> ' + filesize(client.downloadSpeed) + '/s ' +
			'<b>Upload speed:</b> ' + filesize(client.uploadSpeed) + '/s ' +
			'<b>ETA:</b> ' + remaining
			)
        }, 2000)

        torrent.on('done', function () {
          updateSpeed(
			'<b>Peers:</b> ' + torrent.numPeers + ' ' + '\n' +
			'<b>Progress:</b> ' + '100' + '% \n' +
			'<b>Download speed:</b> ' + '0 B' + '/s ' +
			'<b>Upload speed:</b> ' + filesize(client.uploadSpeed) + '/s \n' +
			'<b>ETA:</b> ' + 'Done.'
			)
          clearInterval(interval)
        })
		
		torrentUI(torrent,parseInt(storage.getItem('index')));
		$('.collapsible').collapsible();
        // Render all files into to the page
        torrent.files.forEach(function (file) {
		  file.getBuffer(function (err, buffer) {
			if (err) throw err
			bufArr.push(buffer);
			nameArr.push(file.name);
			typeArr.push(files[i].type);
			if (file == torrent.files[torrent.files.length-1]){
				getArrays(JSON.stringify(bufArr),JSON.stringify(nameArr),JSON.stringify(typeArr));
				WriteToDisk();
			}
		  i++; 
		})
        })
      }  
function logger (str) {
        var p = document.createElement('p')
		p.className = "flow-text";
        p.innerHTML = str
        document.querySelector('.logger').appendChild(p)
      }
	  
function updateSpeed (str) {
  var speed = document.querySelector('.speed')
  speed.innerHTML = str
}
function exitapp(){
	navigator.notification.confirm(
    'Are you sure you want to Quit?', // message
     onConfirm,            // callback to invoke with index of button pressed
    'Confirm Exit',           // title
    ['No','Yes']     // buttonLabels
);	
	
}
function onConfirm(buttonIndex) {
    if(buttonIndex == 2){
		cordova.plugins.notification.local.cancel(1, function() {
    console.log("done");
		});
	navigator.app.exitApp();
	}
}

function writeFile(fileEntry, dataObj, isAppend, f) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
			if((f != 37)&&(f != 40)){
			alert('Saved Successfully!');
			}
		    else if(f == 40){
				alert('Deleted Successfully!');
				window.location = initialHref;
				window.plugins.toast.showWithOptions(
            {
              message: "Refreshing torrent list. Please wait",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          );
			}
			else if (f == 31){
				console.log(dataObj);
			}
        };

        fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString());
        };
		 if (isAppend) {
            try {
                fileWriter.seek(fileWriter.length);
            }
            catch (e) {
                console.log("file doesn't exist!");
            }
        }
        fileWriter.write(dataObj);
    });
}

function saveFile(dirEntry, fileData, fileName) {

    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

        writeFile(fileEntry, fileData);

    }, onErrorCreateFile);
}

function StartUpLoader(){
	var buf,nam,typ,nam1,typ1;
	resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload/TorrentData.json", function(entry) {
		entry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            console.log("Successful file read: ");
			var str = this.result;
			if(this.result != ','){
			window.plugins.toast.showWithOptions(
            {
              message: "Loading your previous torrents. This might take a while",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          );
			str = str.substring(0, str.length - 1);
			str = '[' + str + ']';
			var JsonArrStr = JSON.parse(str);
			var i = 0;
			for(i = 0; i < JsonArrStr.length; i++){
			if(!JsonArrStr[i]){
				continue;
			}
			nam = JSON.parse(JsonArrStr[i].names);
			typ = JSON.parse(JsonArrStr[i].type);
			var id = JsonArrStr[i].id;
			readFolder(nam,typ,id, function(result,id1){
				seedTorrent(result,id1);
			});
			//var returner = readFolder(nam,typ,id);
			//console.log(returner);
	/*var files = [];
	var j = 0;
	for(j = 0; j < nam.length ; j++){
	var myFile = new File([Uint8Array.from(buf[j].data)],nam[j], {type: typ[j]});
	files.push(myFile);
	}
	seedTorrent(files,JsonArrStr[i].id);
	files = [];*/
	
	}
		}
		else if(this.result == ','){
			deleteJSon();
			storage.setItem('index',1);
			console.log(parseInt(storage.getItem('index')));
		}
		else{
			
		}
	};
        reader.readAsText(file);
 
    }, onErrorReadFile);
	});
	
}


function seedTorrent(files,id){
	client.seed(files,function (torrent){
		console.log(' : ' +  torrent.infoHash);
		torrentUI(torrent, id);
	$('.collapsible').collapsible();
	});
}



function getArrays(bufstr,namestr,typestr){
	bufArray = bufstr;
	nameArray = namestr;
	typeArray = typestr;
	JsonArray = { "id": parseInt(storage.getItem('index')), "names":nameArray, "type":typeArray};
	createTorrentFolder(storage.getItem('index'), JSON.parse(nameArray), JSON.parse(bufArray));
}

function createTorrentFolder(id, nameArray, bufArray){
	var i = 0;
	resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload/", function(entry) {
		entry.getDirectory(id, { create: true }, function (dirEntry) {
			for(i = 0; i < nameArray.length; i++){
				var dataObj = new Blob([JSON.stringify(bufArray[i])], { type: 'text/plain' });
				plswork(dirEntry,nameArray[i],dataObj);
			}
		}, onErrorGetDir);
	});
}
function plswork(dirEntry,name,data){
	dirEntry.getFile(name,{ create : true},function(fileEntry){
					writeFile(fileEntry,data,false,37);
				})
}

function retester(){
	if(parseInt(storage.getItem('index')) > 1){
	navigator.notification.confirm(
    "All torrents in your library will be permanently deleted from your device!",  // message
    alertDeleteAll,         // callback
    'Warning!',            // title
    ['Delete All','Cancel']                  // buttonName
);
	}
}
function alertDeleteAll(buttonIndex) {
	if(buttonIndex == 1){
	var idmax = parseInt(storage.getItem('index'));
	var i = 1;
	for(i = 1; i <= idmax; i++){
		RemoveFolder(i);
	}
	storage.setItem('index',1);
	deleteJSon(function(result){
		window.location = initialHref;
	});
	window.plugins.toast.showWithOptions(
            {
              message: "Deleted all Torrents!",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          );
	}
}

function readFolder(nameA, typeA, id,callback){
	var i = 0;
	var folderURL = "file:///storage/emulated/0/WebTorrentDownload/" + id + "/";
	var files = [];
	for(i = 0; i < nameA.length; i++){
	var fileURL = folderURL + nameA[i];
	ReturnBuffer(fileURL,nameA,typeA, function(result){
		files.push(result);
		if(files.length == nameA.length){
			callback(files,id);
		}
	});
	
	}
}

function ReturnBuffer(fileURL,nameA,typeA,callback){
	resolveLocalFileSystemURL(fileURL, function(entry){
		entry.file(function (file) {
        var reader = new FileReader();
		reader.readAsText(file);
        reader.onloadend = function() {
			var str = this.result;
			var bufA = JSON.parse(str);
			var myFile = new File([Uint8Array.from(bufA.data)],entry.name, {type: typeA[nameA.indexOf(entry.name)]});
			callback(myFile);
		}
    }, onErrorReadFile);
	})
}

function WriteToDisk(){
	resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload", function(entry) {
				var myJSON = JSON.stringify(JsonArray) + ',';
				var dataObj = new Blob([myJSON], { type: 'text/plain' });
				entry.getFile('TorrentData.json', { create: true, exclusive: false }, function (fileEntry) {
				writeFile(fileEntry, dataObj,true,37);
				}, onErrorCreateFile);
				storage.setItem('index',parseInt(storage.getItem('index'))+1);
				delete JsonArray;
	})
}


function torrentUI(torrent,id){
	var cole = document.getElementById("maincollapsible");
	var list = document.createElement('li');
	var titlediv = document.createElement('div');
	var contentdiv = document.createElement('div');
	var infoic = document.createElement('i');
	var delic = document.createElement('i');
	var p1 = document.createElement('p');
	var p2 = document.createElement('p');
	cole.className = "collapsible";
	cole.setAttribute("data-collapsible", "expandable");
	p1.className = "left-align";
	p1.innerHTML = torrent.files[0].name.substring(0,13) + "...";
	titlediv.className = "collapsible-header flow-text truncate";
	contentdiv.className = "collapsible-body";
	infoic.className = "blue-text text-lighten-1 material-icons";
	infoic.innerHTML = "info";
	infoic.onclick = function(){
		navigator.notification.confirm(
    'Torrent Name: ' + torrent.name + '\n' + '\nNo. of files: ' + torrent.files.length + '\n' + '\nTorrent Info Hash: ' + torrent.infoHash + '\n' + '\nTorrent Magnet URI: ' + torrent.magnetURI,  // message
    function(buttonIndex){
            alertDismissed(buttonIndex, torrent);
        },         // callback
    'Torrent Info',            // title
    ['Copy InfoHash','Copy Magnet URI']                  // buttonName
);
	}
	delic.className = "red-text text material-icons";
	delic.innerHTML = "delete";
	delic.onclick = function(){
		//RemoveTorrent(id);
		navigator.notification.confirm(
    'Are you sure you want to delete this torrent?',  // message
	function(buttonIndex){
            alertDismissedDelete(buttonIndex, id);
        },         // callback
    'Delete Confirm',            // title
    ['Yes','No']                  // buttonName
		);
	}
	p2.className = "right-align";
	p2.appendChild(infoic);
	p2.appendChild(delic);
	titlediv.appendChild(p1);
	titlediv.appendChild(p2);
	torrent.files.forEach(function(file){
	var div = document.createElement('div');
	var divtext = document.createElement('div');
	var divwrap = document.createElement('div');
	var divcard = document.createElement('div');
	var divaction = document.createElement('div');
	var divreveal = document.createElement('div');
	var divultimate = document.createElement('div');
	var a = document.createElement('a');
	var p = document.createElement('p');
	div.className = "card-image";
	var url1;
	var blob1;
	file.getBlobURL(function (err, url) {
	if (err) return console.log(err.message)
    url1 = url;
	});
	file.getBlob(function(err,blob){
				if (err) console.log(err.message)
				blob1 = blob;
			})
	divtext.className = "card-content activator";
	//divtext.style.cssText = "width: 150px;"
	divwrap.className = "card-stacked"
	divaction.className = "card-action"
	divcard.className = "card horizontal"
	p.className = "flow-text truncate";
	p.innerHTML = file.name.substring(0,8) + "...";
	a.innerHTML = "Details";
	a.onclick = function(){
		navigator.notification.confirm(
    'File Name: ' + file.name + '\n' + '\nSize : ' + filesize(file.length),  // message
	function(buttonIndex){
            alertDismissedFile(buttonIndex, file, blob1);
        },         // callback
    'File Details',            // title
    ['Save File','Close']                  // buttonName
);
	}
	divaction.appendChild(a);
	file.appendTo(div);
	divcard.appendChild(div);
	var flag = true;
	if(div.hasChildNodes() == false ){
		var img = document.createElement('IMG');
		modalImg.style.display = "none";
		img.src = "img/icon1.png";
		div.appendChild(img);
		file.getBlobURL(function (err, url) {
			if (err) return console.log(err.message)
			modalVid.src = url;
			});
		flag = false;
	}
	div.onclick = function(){
		//deldiv.style.display = "none";
    modal.style.display = "block";
	if(flag == true){
	modalVid.style.display = "none";
	modalImg.style.display = "block";
    modalImg.src = url1;
	}
	backflag = false;
	}
	divtext.appendChild(p);
	divwrap.appendChild(divtext);
	divwrap.appendChild(divaction);
	divcard.appendChild(divwrap);
	divultimate.appendChild(divcard);
	contentdiv.appendChild(divultimate);
	})
	list.appendChild(titlediv);
	list.appendChild(contentdiv);
	cole.appendChild(list);
}

function alertDismissed(buttonIndex, torrent) {
	if(buttonIndex == 1){
		//InfoHash
		cordova.plugins.clipboard.copy(torrent.infoHash);
		window.plugins.toast.show('Infohash copied to clipboard', 'short', 'bottom');
}
	else if(buttonIndex == 2){
		//Magnet
		cordova.plugins.clipboard.copy(torrent.magnetURI);
		window.plugins.toast.show('Magnet URI copied to clipboard', 'short', 'bottom');
	}
}

function alertDismissedFile(buttonIndex,file,blob1) {
	if(buttonIndex == 1){
		resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload", function(entry) {
				saveFile(entry, blob1 , file.name);
				console.log('file system open: ' + entry.name);
	});
	}
}
function alertDismissedDelete(buttonIndex,id) {
	if(buttonIndex == 1){
	RemoveTorrent(id);
	RemoveFolder(id);
	}
}

function saver(){
	storage.setItem('index',1);
	console.log(parseInt(storage.getItem('index')));
}



function deleter(){
	window.location = initialHref;
}

function RemoveFolder(id){
	var folderURL = "file:///storage/emulated/0/WebTorrentDownload/" + id + "/";
	resolveLocalFileSystemURL(folderURL, function(entry){
		entry.removeRecursively(function(file){
					console.log('done');
				},function(error){
					console.log(error);
				},
				function(){
					console.log("No file");
				})
	})
	
}

function RemoveTorrent(id){
	var writestr;
	var ind;
	resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload/TorrentData.json", function(entry) {
		entry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
			var str = this.result;
			str = str.substring(0, str.length - 1);
			str = '[' + str + ']';
			var JsonArrStr = JSON.parse(str);
			JsonArrStr.forEach(function(element){
				if ( element.id == id ){
					ind = JsonArrStr.indexOf(element);
				}
			})
			var i;
			var Arr = [];
			for(i = 0; i<JsonArrStr.length; i++){
				if(i != ind){
					Arr.push(JsonArrStr[i]);
				}
			}
			ReWriteFile(Arr);
		}
		        reader.readAsText(file);

		}, onErrorReadFile)
	});
	//console.log(writestr)
}
function ReWriteFile(JsonArrStr){
	//deleteJSon();
	var stringer = JSON.stringify(JsonArrStr);
	stringer = stringer.substring(1,stringer.length-1);
	var myJSON = stringer + ',';
	var data = new Blob([myJSON], { type: 'text/plain' });
	resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload", function(entry) {
				entry.getFile('TorrentData.json', { create: true, exclusive: false}, function (fileEntry) {
				fileEntry.createWriter(function (fileWriter) {
		fileWriter.write(data);
        fileWriter.onwriteend = function() {
            console.log("ReWriteFile");
			alert('Deleted Successfully!');
				window.location = initialHref;
				window.plugins.toast.showWithOptions(
            {
              message: "Refreshing torrent list. Please wait",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          );
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };
    });
	}, onErrorCreateFile);
	})
}
function deleteJSon(callback){
	resolveLocalFileSystemURL("file:///storage/emulated/0/WebTorrentDownload", function(entry) {
				entry.getFile('TorrentData.json', { create: false }, function (fileEntry) {
				fileEntry.remove(function(file){
					console.log('done');
					callback(1);
				},function(error){
					console.log(error);
				},
				function(){
					console.log("No file");
				})
	})
})
}

function onErrorCreateFile() {
    console.log("Create file fail...");}

function onErrorLoadFs() {
    console.log("File system fail...");
}
function onErrorReadFile() {
    console.log("Read file system fail...");
}
function onErrorGetDir() {
    console.log("File system fail...");
}