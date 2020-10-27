const lineByLine = require('n-readlines');
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var ivs = new AWS.IVS();

PollingFeed = function(){};

PollingFeed.prototype.getPollingQuestion= function(callback) {
    getFacts();
};

function getFacts() {
    const liner = new lineByLine('facts.txt');
    let line;
    var lines = [];
    while (line = liner.next()) {
        lines.push(line);
    }

    setInterval(function(){
      putIvsMetadata(lines);
    }, 5000);


}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function putIvsMetadata(lines) {
    var size = lines.length;
    var today = new Date();
    var question = lines[getRandomInt(size)].toString('utf8')
    var data = {
                    current_time : today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '-' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
                    poll_id: "Test Poll ID",
                    question: question,
                    answers: {
                        "1": "True",
                        "2": "False",
                        "3": "Maybe"
                    }
                };

    var params = {
      channelArn: 'arn:aws:ivs:us-east-1:025525423149:channel/shnpN5d2gp4C', /* required */
      metadata: JSON.stringify(data) /* required */
    };
    ivs.putMetadata(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     console.log(data);           // successful response
                });
}

exports.PollingFeed = PollingFeed;



