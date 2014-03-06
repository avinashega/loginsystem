var fs = require('fs'),
	q = require('q'),
	i = require('../i'),
	c = require('../c'),
	agenda = i.agenda(),
	config = require('getconfig'),
	handlebars = require('handlebars');
var welcome, reset, success, error, authErr, locationErr, alert, postAlert;
module.exports = {
		welcomeEmail: function(user){
			if(!welcome) {
				var templateFile = fs.readFileSync('app/views/emails/welcome.hbs', 'utf8');
			 	welcome = handlebars.compile( templateFile );
			}
			var html = welcome({user:user, host:config.http.host});
        	var jobData = {
                    html: html,
                    text: 'Welcome to Login',
                    subject: 'Welcome to Login',
                    from_email: config.emails.info,
                    from_name: 'Login',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving welcome email job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
		resetEmail: function(user){
			if(!reset){
				var templateFile = fs.readFileSync('app/views/emails/resetPassword.hbs', 'utf8');
			 	reset = handlebars.compile( templateFile );
			}
			var html = reset({user:user, host:config.http.host});
			var jobData = {
                    html: html,
                    text: 'Reset Password',
                    subject: 'Login Password Reset Request',
                    from_email: config.emails.info,
                    from_name: 'Login',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving reset email job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            return q.nbind(job.save, job)();
		}
};