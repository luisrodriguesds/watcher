const fs 	= require('fs');
const path 	= require('path');
const parser= require('xml2json-light');
const mysql = require('mysql');
const knex  = require('./connection.js');
const {sendEmailFinal} = require('./send-email');

module.exports = {

	async sendDownload(params){

		//vars
		const dir = process.env.FOLDER_PATH;
		let newName = '';
		let amostra = '';

		fs.readFile(dir+params.lastFile, 'utf-8', (err, data) => {
			//Converte para json
			let currentFile = parser.xml2json(data);
			
			//Pega o nome
			amostra = currentFile.xrdMeasurements.sample.name;

			const query = 'SELECT  u.id, u.name as u_name, u.email, u.other_email, u.phone1, s.name, s.user_id, s.id as s_id FROM users AS u, solicitations AS s WHERE s.name = "'+amostra+'" AND u.id = s.user_id;';
			
			knex.raw(query).then(function (results) {
				const result = JSON.parse(JSON.stringify(results))[0];
				if (result.length == 0) {
					//Avisar ao professor
					console.log(amostra, "não encontrada");
					return null;
				}
		        

		        //Nome do arquivo
			  	newName = `${amostra}_${Date.now().toString()}.xrdml`;

			  	//Fazer a Cópia para a pasta de upload
			  	let dir_copy = process.env.FOLDER_PATH+params.lastFile;
				let dir_past = process.env.FOLDER_DOWNLOAD+newName;
				let readableStream = fs.createReadStream(dir_copy);  
				let writableStream = fs.createWriteStream(dir_past);
				readableStream.pipe(writableStream);

				
				//Atualizar a amostra no banco, status e caminho para download
				const update = 'UPDATE solicitations SET status = 6, download = "'+newName+'" WHERE name = "'+amostra+'"';
				knex.raw(update).then(function (results) {
		        	console.log("Log de send-download \n", result);
					
					//Enviar o email aqui dizendo que a amostra questá pronta para o recolhimento
					sendEmailFinal(result[0]);
			    })
		    })
			
		});

	}
}
