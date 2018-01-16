const express = require('express');
const router = express.Router();

var app = express();

const google = require('googleapis');
const analytics = google.analyticsreporting('v4');
const requestsGen = require("analytics-reporting-request-generator");
const SERVICE_ACCOUNT_EMAIL = 'droneiro-server@droneiro-com.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_KEY_FILE = __dirname + '/credentials/key.pem';

GetNumberOfSessions = function (res, slug) {
  var authClient = new google.auth.JWT( SERVICE_ACCOUNT_EMAIL, SERVICE_ACCOUNT_KEY_FILE, null, ['https://www.googleapis.com/auth/analytics.readonly']);

  authClient.authorize(function (err, tokens) {
    if (err) { console.log("err is: " + err); return; }

    let request = requestsGen().report().viewId('167067425').dimension('ga:pagePath').metric('ga:uniquePageviews').metric('ga:avgTimeOnPage')
                   .dateRanges('2018-01-01', 'today').dateRanges('7daysAgo', 'today').filtersExpression('ga:pagePath==/piloto/'+slug).get();

    //Maybe here
    analytics.reports.batchGet({
      resource: request,
      auth: authClient
    },
      function(err, response) {
        if (err) { console.log("err is: " + err); return; }
        res.json(response);
      }
    );
  });
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.get('/:pilot', function(req, res){
  var result = GetNumberOfSessions(res, req.params.pilot);
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function(){
  console.log('Node app is running!', app.get('port'))
});
