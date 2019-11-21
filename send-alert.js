const mysql = require('mysql');
const {sendEmail} = require('./send-email.js');

module.exports = {

	async sendAlert(amostra, params){
		let numero = null;

		//Abre conexao com o banco do slrx
		const connection = mysql.createConnection({
		  host     : process.env.DB_HOST,
		  user     : process.env.DB_USER,
		  password : process.env.DB_PASSWORD,
		  database : process.env.DB_DATABASE,
		  port: process.env.DB_PORT
		});

		// const query = 'SELECT u.id_usuario, u.nome, u.email, u.telefone, sa.id_solicitacao, sa.id_usuario, s.identificacao_da_amostra, s.id_solicitacao FROM usuarios as u, solicitacoes_academicas as sa, solicitacoes as s WHERE s.identificacao_da_amostra = "'+amostra+'" AND s.id_solicitacao = sa.id_solicitacao AND sa.id_usuario = u.id_usuario;';
		const query = 'SELECT  u.id, u.name as u_name, u.email, u.other_email, u.phone1, s.name, s.user_id, s.id as s_id FROM users AS u, solicitations AS s WHERE s.name = "'+amostra+'" AND u.id = s.user_id;';
		connection.connect();

		connection.query(query, function (error, results, fields) {

		  if (error) throw error;
		  if (results.length > 0) {
			console.log(results);
			  const result = JSON.parse(JSON.stringify(results));

			  //get number
			  //numero = result.telefone;

			  //Enviar o email aqui.
			  //sendEmail(result[0], params);
		  }else{
		  	console.log(amostra ,"Não foi encontrada");

		  	//Enviar email para o professor

		  }
		});
		
		connection.end();
	}

}