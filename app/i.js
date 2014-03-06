var m = require('underscore').memoize,
    config = require('getconfig');

function _formatErrors(errors) {
    if (typeof errors === 'string') {
        return errors;
    } else if (errors instanceof Error) {
        return 'System error';
    } else {
        var result = {};
        errors.forEach(function (e) {
            result[e.param] = e.msg;
        });
        return result;
    }
}

module.exports = {

    /**
     * @return {SkinDb}
     */
    db: m(function () {
        return require('./bootstraps/mongoskin');
    }),

    /**
     *
     * @returns {agenda}
     */
    agenda: function () {
        return require('./bootstraps/agenda');
    },

    userService: function () {
        return require('./services/users');
    },
    
    
    jobsService: function () {
        return require('./services/jobs');
    },
    emailService: function(){
    	return require('./services/email');
    },
    authMiddleware: function (needGuest) {
        return function (req, resp, next) {
            var isGuest = !req.session.userId;

            if (needGuest && !isGuest) {
                resp.redirect('/home');
                return;
            }

            if (!needGuest && isGuest) {
                resp.redirect('/');
                return;
            }
            next();
        };
    },
    makePromiseError: function (key, message) {
        return [
            {param: key, msg: message}
        ];
    },

    jsonResponse: {
        data: function (data) {
            return {
                status: 'ok',
                data: data
            }
        },
        error: function (message) {
            return {
                status: 'error',
                message: _formatErrors(message)
            };
        },
        redirect: function (url) {
            return {
                status: 'redirect',
                url: url
            };
        }
    }
};