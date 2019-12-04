const request = require('request');
const dateFormat = require('dateformat');

module.exports = {

	async sendEmail(result, params){
		const [file, ext] = params.filename.split('.');
		let buff = new Buffer(file);
		let filename = buff.toString('base64');

			buff = new Buffer(params.year);
		let year = buff.toString('base64');
			params = {filename, year}
		// console.log(params);
		//Assuno e Corpo da mensagem
		const assunto = '[SLRX] Análise Solicitada por '+result.u_name;
		let   corpo = '<p>Olá '+result.u_name+',<br> O Sistema de Medida DRX do Laboratório de Raios-X da UFC';
			  corpo+= 'detectou que sua amostra, identificada como '+result.name+', teve inicío neste exato momento, '+dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss");+'.</p>';
			  corpo+= '<p> Para acompanhar sua medida, basta acessar o link abaixo. </p>';
			  corpo+= '<p><a href="http://csd.fisica.ufc.br:8080/sample?filename='+params.filename+'&year='+params.year+'" target="_blank">Sistema de Medida DRX em Tempo Real</a></p>';
			  corpo+= '<p>Para acompanhar as etapas de todas as suas amostras entre com seu login e senha em <br> </p>';
			  corpo+= '<p><a href="http://csd.fisica.ufc.br:3000" target="_blank">Sistema LRX</a></p>';
			  corpo+= '<p style="color:red;">Para ter acesso ao resultado da sua medida basta ao final da análise recolher a sua amostra no laboratório</p>';
			  corpo+= '<p style="text-align:right;">Atenciosamente, <br>Laboratório de Raios-X</p>';
			  corpo+= '<p>Caso possua alguma dúvida, por favor entre em contato com o Laboratório ';
			  corpo+= 'por meio do endereço de email lrxufc@gmail.com, ou pelo telefone 85 33669917.</p>';
		
		const email = result.email;

		//Dados a serem enviados
		const data = {assunto, corpo, email};

		//dados do post
		const op = {
			url:'http://csdint.fisica.ufc.br/solicitacoes/send-email.php',
			form: {email:JSON.stringify(data)}
		};

		//Envia o post para mandar o email
		request.post(op, (err,httpResponse,body) =>{ 
			console.log(body);
		});
	},

	async sendEmailFinal(result){
		//Assuno e Corpo da mensagem
		const assunto = '[SLRX] Término da análise Solicitada por '+result.u_name;
		let   corpo = '<p>Olá '+result.u_name+',<br> O Sistema de Medida DRX do Laboratório de Raios-X da UFC';
			  corpo+= 'detectou o termino do processo de medida DRX da sua amostra, identificada como '+result.name+'.</p>';
			  corpo+= '<p>Para relizar o download da sua medida entre com seu login e senha em <br> </p>';
			  corpo+= '<p><a href="http://csd.fisica.ufc.br:3000" target="_blank">Sistema LRX</a></p>';
			  corpo+= '<p><storng>Porém, o download da sua medida só será liberado mediante da retirada da sua amostra do LRX ou mediante a expressa comunicação do discarte da sua amostra enviando para lrxufc@gmail.com. </strong></p>';
			  corpo+= '<p style="text-align:right;">Atenciosamente, <br>Laboratório de Raios-X</p>';
			  corpo+= '<p>Caso possua alguma dúvida, por favor entre em contato com o Laboratório ';
			  corpo+= 'por meio do endereço de email lrxufc@gmail.com, ou pelo telefone 85 33669917.</p>';
		
		const email = result.email;

		//Dados a serem enviados
		const data = {assunto, corpo, email};

		//dados do post
		const op = {
			url:'http://csdint.fisica.ufc.br/solicitacoes/send-email.php',
			form: {email:JSON.stringify(data)}
		};

		//Envia o post para mandar o email
		request.post(op, (err,httpResponse,body) =>{ 
			console.log(body);
		});
	},

	async sendEmailNotFound(name){
		//Assuno e Corpo da mensagem
		const assunto = '[SLRX] Amostra não encontrada';
		let   corpo = '<p>Olá Professor! <br> O Sistema de Medida DRX do Laboratório de Raios-X da UFC';
			  corpo+= 'detectou que a amostra '+name+' não foi encontrada na base de dados.</p>';
			  
			  corpo+= '<p style="text-align:right;">Atenciosamente, <br>Laboratório de Raios-X</p>';
			  corpo+= '<p>Caso possua alguma dúvida, por favor entre em contato com o Laboratório ';
			  corpo+= 'por meio do endereço de email lrxufc@gmail.com, ou pelo telefone 85 33669917.</p>';
		
		const email = process.env.EMAIL;

		//Dados a serem enviados
		const data = {assunto, corpo, email};

		//dados do post
		const op = {
			url:'http://csdint.fisica.ufc.br/solicitacoes/send-email.php',
			form: {email:JSON.stringify(data)}
		};

		//Envia o post para mandar o email
		request.post(op, (err,httpResponse,body) =>{ 
			console.log(body);
		});
	}
	 
}