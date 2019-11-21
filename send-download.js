const fs 	= require('fs');
const path 	= require('path');
const parser= require('xml2json-light');
const mysql = require('mysql');

module.exports = {
	async sendDownload(params){

		//vars
		const dir = process.env.FOLDER_PATH;
		let newName = '';
		let amostra = '';
		fs.readFile(dir+params.lastFile, 'utf-8', (err, data) =>{
			//Converte para json
			let currentFile = parser.xml2json(data);
			
			//Pega o nome
			amostra = currentFile.xrdMeasurements.sample.name;
			
			console.log("Irão para o download",params.lastFile, amostra);
			
			const connection = mysql.createConnection({
			  host     : process.env.DB_HOST,
			  user     : process.env.DB_USER,
			  password : process.env.DB_PASSWORD,
			  database : process.env.DB_DATABASE,
			  port: process.env.DB_PORT
			});

			const query = 'SELECT  u.id, u.name as u_name, u.email, u.other_email, u.phone1, s.name, s.user_id, s.id as s_id FROM users AS u, solicitations AS s WHERE s.name = "'+amostra+'" AND u.id = s.user_id;';
			connection.connect();
			connection.query(query, function (error, results, fields) {

				if (error) throw error;
				if (results.length > 0) {
					console.log(results);
				  	const result = JSON.parse(JSON.stringify(results));

				  	//Nome do arquivo
				  	newName = `${amostra}_${Date.now().toString()}.xrdml`;

				  	//Fazer a Cópia para a pasta de upload
				  	let dir_copy = process.env.FOLDER_PATH+params.lastFile;
					let dir_past = process.env.FOLDER_DOWNLOAD+newName;
					let readableStream = fs.createReadStream(dir_copy);  
					let writableStream = fs.createWriteStream(dir_past);
					readableStream.pipe(writableStream);

					//Enviar o email aqui.
					//sendEmail(result[0], params);
					console.log("Enviando email para o dono vir buscar amostra");
					
					//Atualizar a amostra no banco
					const update = 'UPDATE solicitations SET status = 6 WHERE name = "'+amostra+'"';
					console.log(update);
					connection.query(update);
				}else{
					console.log(amostra ,"Não foi encontrada.");
				}
			});
			connection.end();



		});

	}
}
