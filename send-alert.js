
const mysql = require('mysql');
const sendEmail = require('./send-email.js');

module.exports.sendAlert = (amostra) => {
	let numero = null;

	//Para o sistema acadêmico
	const connectionAc = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'raiosx2',
	  port: 3306
	});

	const query = 'SELECT u.id_usuario, u.nome, u.email, u.telefone, sa.id_solicitacao, sa.id_usuario, s.identificacao_da_amostra, s.id_solicitacao FROM usuarios as u, solicitacoes_academicas as sa, solicitacoes as s WHERE s.identificacao_da_amostra = "'+amostra+'" AND s.id_solicitacao = sa.id_solicitacao AND sa.id_usuario = u.id_usuario;';
	
	connectionAc.connect();

	connectionAc.query(query, function (error, results, fields) {

	  if (error) throw error;
	  if (results.length > 0) {
		console.log("Entrou no academico");
		console.log(results);
		  const result = JSON.parse(JSON.stringify(results));

		  //get number
		  //numero = result.telefone;

		  //Enviar o email aqui.
		  sendEmail.sendEmail(result[0]);
	  }
	});
	
	connectionAc.end();

	//Para o sistema Empresa
	const connectionEm = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'empresa_raiox',
	  port: 3306
	});

	const queryEm = 'SELECT u.id, u.email, u.nome, u.telefone, s.id_solicitacao, s.identificacao_da_amostra, sc.id_solicitacao, sc.id_usuario FROM solicitacoes_comerciais as sc, solicitacoes as s, usuarios_comerciais as u WHERE s.identificacao_da_amostra = "'+amostra+'" AND s.id_solicitacao = sc.id_solicitacao AND u.id = sc.id_usuario;';
	
	connectionEm.connect();

	connectionEm.query(queryEm, function (error, results, fields) {
		console.log(error);
	  if (error) throw error;
	  if (results.length > 0) {
		console.log("Entrou no de empresa");
		console.log(results);
		  const resultEm = JSON.parse(JSON.stringify(results));

		  //get number
		  //numero = resultEm.telefone;

		  //Enviar o email aqui.
		  sendEmail.sendEmail(resultEm[0]);
	  }
	});
	
	connectionEm.end();


	//Enviar via wpp
	//link https://www.twilio.com/console/sms/whatsapp/sandbox
	// const accountSid = 'ACe66971c91ef1144196c27a9c932c2d0e'; 
	// const authToken = 'ac10ac43b230ede5c9269b374efca35f'; 
	// const client = require('twilio')(accountSid, authToken); 
	 
	// client.messages 
	//       .create({ 
	//          body: 'Your Twilio code is 1238432', 
	//          from: 'whatsapp:+14155238886',       
	//          to: 'whatsapp:+558597646060' 
	//        }) 
	//       .then(message => console.log(message.sid)) 
	//       .done();

	// const accountSid = 'ACe66971c91ef1144196c27a9c932c2d0e'; 
	// const authToken = 'ac10ac43b230ede5c9269b374efca35f'; 
	// const client = require('twilio')(accountSid, authToken); 
	 
	// client.messages 
	//       .create({ 
	//          body: 'Hello! This is an editable text message. You are free to change it and write whatever you like.', 
	//          from: 'whatsapp:+14155238886',       
	//          to: 'whatsapp:+558597646060' 
	//        }) 
	//       .then(message => console.log(message.sid)) 
	//       .done();

}
