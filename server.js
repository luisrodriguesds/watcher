const fs 	= require('fs');
const path 	= require('path');
const parser= require('xml2json-light');
const {sendAlert} 	= require('./send-alert.js');
const {sendDownload}= require('./send-download.js');
const year = '2019'; //Para saber qual ano\pasta será observada
const dot = require('dotenv').config({  
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
}); //Para rodar com a .env de ambiente - NODE_ENV=test node server.js

const dir = process.env.FOLDER_PATH; 
let lastFile ='';

//Função para pegar o último arquivo
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

//Chama a função para sempre ficar verificando o último arquivo
setInterval(() => {
	getLatestFile({directory:dir, extension:'xrdml'}, (filename=null)=>{
		if (lastFile != filename) {
			
			//Pega o atual e manda email para o dono da amostra dizendo que está sendo analisada
			fs.readFile(dir+filename, 'utf-8', (err, data) =>{
				//Converte para json
				let currentFile = parser.xml2json(data);
				
				//Pega o nome
				let currentSampleName = currentFile.xrdMeasurements.sample.name;
				
				//Para a funcao que irá enviar o email e a mensagem via wpp - ascincrono
				sendAlert(currentSampleName, {filename, year});

			});
			console.log("Trocou o arquivo");

			//Enviar arquivo concluído para a pasta de download (Pegar arquivo, mudar nome e mudar) 
			sendDownload({lastFile});

			lastFile = filename;
		}else{
			lastFile = filename;
		}
  		console.log(filename);
	});
}, 1000);