/**
 * Created by romeyer on 3/23/14.
 */

var sa = require('superagent');
var parseString = require('xml2js').parseString;
var Config = require('config').Mingle;

exports.getCard = function(req, res){
    var agent = sa.agent();
    var cardApiUrl = 'https://' + Config.mingleserver + '/api/v2/projects/' + Config.projectname + '/cards/'
        + req.params.cardNumber + '.xml';
    agent.get(cardApiUrl)
        .auth(Config.username, Config.password)
        .type('xml')
        .buffer()
        .end(function(resp) {
            parseString(resp.text, function(err, result) {
                //console.log(result);
                res.send(JSON.stringify(result));
                //console.log(JSON.stringify(result));
                //console.log(result.card.rendered_description[0].$.url);
            });
        });
};