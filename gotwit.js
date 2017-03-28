var Twitter = require('twitter'),golos=require('golos');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var d=[],u='vik',count;
golos.api.getAccountVotes(u, function(err, result) {
  count=result.length;
  for (var i = 0; i < result.length; i++){
  d.push({
  link:result[i].authorperm,
  power:result[i].percent
  })
  }
  var i = 0;
            var tweetVote = setInterval(function() {
                if (d[i].power / 100 >= 20) {
                  var tweet = u+" проголосовал за пост в блокчейн https://golos.io/x/@"+d[i].link;
                    client.post('statuses/update', {status: tweet},  function(error, tweet, response) {
                      if(error) throw JSON.stringify(error);
                      });
                  i++;
                }
                if (i == count) {
				    clearInterval(tweetVote);
                 }
            }, 5000);
});
