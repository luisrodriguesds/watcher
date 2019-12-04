const mysql = require('mysql');
const {sendEmail, sendEmailNotFound} = require('./send-email.js');
const knex  = require('./connection.js');

module.exports = {

	async sendAlert(amostra, params){

		const query = 'SELECT  u.id, u.name as u_name, u.email, u.other_email, u.phone1, s.name, s.user_id, s.id as s_id FROM users AS u, solicitations AS s WHERE s.name = "'+amostra+'" AND u.id = s.user_id;';
		knex.raw(query).then(function (results) {
			const result = JSON.parse(JSON.stringify(results))[0];
			if (result.length != 0) {
				//Enviar o email aqui.
			 	// sendEmail(result[0], params);
			 	console.log("Log de send-alert \n", result);
			}else{
				sendEmailNotFound(amostra);
			  	console.log(amostra ,"Não foi encontrada");
			}
		})
	}
}