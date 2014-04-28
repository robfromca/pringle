/**
 * Created by romeyer on 4/24/14.
 */

/*
 * Grab issues from github and push them into mingle.
 */

var sa = require('superagent');
var parseString = require('xml2js').parseString;
var Config = require('config').Mingle;

function createDataString(cardData) {
    var buf = [];
    buf.push('card[name]=' + cardData.title);
        buf.push('card[card_type_name]=issue');
        buf.push('card[description]=' + cardData.body);
        buf.push(          'card[properties][][name]=state');
        buf.push(      'card[properties][][value]=' + cardData.state);
    buf.push(          'card[properties][][name]=issue_number');
    buf.push(          'card[properties][][value]=' + cardData.number);
    buf.push(          'card[properties][][name]=created_at');
    buf.push(          'card[properties][][value]=' + cardData.created_at);
    buf.push(          'card[properties][][name]=updated_at');
    buf.push(          'card[properties][][value]=' + cardData.updated_at);
        if (cardData.milestone != null) {
            buf.push(      'card[properties][][name]=milestone');
            buf.push(      'card[properties][][value]=' + cardData.milestone.title);
        }
        if (cardData.assignee != null) {
            buf.push(      'card[properties][][name]=assignee');
            buf.push(      'card[properties][][value]=' + cardData.assignee.login);
        }
        if (cardData.closed_at != null) {
            buf.push(          'card[properties][][name]=closed_at');
            buf.push(          'card[properties][][value]=' + cardData.closed_at);
        }
    console.log(buf.join('&'));
    return buf.join('&');
}

function createMingleCard(cardData) {
    var agent = sa.agent();
    //var cardApiUrl = 'https://' + Config.mingleserver + '/api/v2/projects/github_test/cards/' + cardData.number + '.xml'
    var cardApiUrl = 'https://' + Config.mingleserver + '/api/v2/projects/github_test/cards.xml'
    console.log(cardApiUrl);
    console.log(cardData);

    agent.post(cardApiUrl)
        .auth(Config.username, Config.password)
        .type('form')
        .buffer()
        .send(createDataString(cardData))
        .end(function(resp) {
            console.log(resp.text);
            console.log(resp.header)
        });
}

function processIssues(res, resp) {
    issue = resp.body[0];
    // limited to 3 for testing
    for (i = 0; (i < resp.body.length) && (i < 3) ; i++) {
        createMingleCard(resp.body[i]);
    }

    //console.log(resp.body);
    //console.log("issues returned:" + resp.body.length);
    //console.log("number=" + resp.body[0].number);
    res.render('sync', {title: 'Mingle Sync', issues: resp.body});
}

exports.startSync = function(req, res){
    var githubAgent = sa.agent();
    var gitHubIssueUrl = "https://api.github.com/repos/" + Config.git_org + "/" + Config.git_repo + "/issues?access_token=" + Config.git_token;
    githubAgent.get(gitHubIssueUrl)
        .buffer()
        .set("User-Agent", "githubminglesync")
        .end(function(resp) {
            processIssues(res, resp);
            res.render('sync');
        })


};