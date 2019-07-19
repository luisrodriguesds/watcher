const fs 	= require('fs');
const path 	= require('path');
const parser= require('xml2json-light');
const send 	= require('./send-alert.js');
const dir 	= __dirname+'\\medidas\\';
let lastFile ='';

function getLatestFile({directory, extension}, callback){
  fs.readdir(directory, (_ , dirlist)=>{
    const latest = dirlist.map(_path => ({stat:fs.lstatSync(path.join(directory, _path)), dir:_path}))
      .filter(_path => _path.stat.isFile())
      .filter(_path => extension ? _path.dir.endsWith(`.${extension}`) : 1)
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .map(_path => _path.dir);
    callback(latest[0]);
  });
}

//Começa com o primeiro arquivo
getLatestFile({directory:dir, extension:'xrdml'}, (filename=null)=>{
	lastFile = filename;
});

//Chama a função para sempre ficar refificando o último arquivo
setInterval(() => {
	getLatestFile({directory:dir, extension:'xrdml'}, (filename=null)=>{
		if (lastFile != filename) {
			//Get the file
			fs.readFile(dir+filename, 'utf-8', (err, data) =>{
				//Converte para json
				let currentFile = parser.xml2json(data);
				
				//Pega o nome
				let currentSampleName = currentFile.xrdMeasurements.sample.name;
				
				//Para a funcao que irá enviar o email e a mensagem via wpp - ascincrono
				send.sendAlert(currentSampleName);
			});			

			console.log("Trocou o arquivo");
			lastFile = filename;
		}else{
			lastFile = filename;
		}
  		console.log(filename);
	});
}, 3000);