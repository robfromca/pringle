
/*
 * GET items listing.
 */

var sa = require('superagent');
var parseString = require('xml2js').parseString;
var Config = require('config').Mingle;

exports.list = function(req, res){
    var agent = sa.agent();
    var mqlQuery = "SELECT number, name, description, customer, status WHERE (type = story OR type = defect) AND "
        + "(Status < 'Done' AND Status != 'Rejected' AND Status != 'Removed' AND Status != 'Live' AND Status != 'Shipped')"
        + "AND number > 4000 ORDER BY PROJECT_CARD_RANK";
    var cardApiUrl = 'https://' + Config.mingleserver + '/api/v2/projects/' + Config.projectname + '/cards/execute_mql.xml'
    console.log(cardApiUrl);
    console.log(require('os').hostname());
    agent.get(cardApiUrl)
        .auth(Config.username, Config.password)
        .type('xml')
        .buffer()
        .query({ mql: mqlQuery})
        .end(function(resp) {
            parseString(resp.text, function(err, result) {

                //res.send(JSON.stringify(result.results));
                res.render('itemlist', {title: 'Mingle', results: result.results.result});
                //console.log(JSON.stringify(result.results.result));
            });
        });
};