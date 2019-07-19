const request = require('request');

module.exports.sendEmail = (results)=>{
	const op = {
		url:'http://csd.fisica.ufc.br/solicitacoes/send-email.php',
		form: {key:JSON.stringify(results)}
	}

	request.post(op, (err,httpResponse,body) =>{ 
		console.log(body);
	});
}
