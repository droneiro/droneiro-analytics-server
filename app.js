const express = require('express');
const router = express.Router();

var app = express();

const google = require('googleapis');
const analytics = google.analyticsreporting('v4');
const requestsGen = require("analytics-reporting-request-generator");
const SERVICE_ACCOUNT_EMAIL = 'droneiro-server@droneiro-com.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_KEY_FILE = __dirname + '/credentials/key.pem';

GetNumberOfSessions = function (res) {
  var authClient = new google.auth.JWT( SERVICE_ACCOUNT_EMAIL, SERVICE_ACCOUNT_KEY_FILE, null, ['https://www.googleapis.com/auth/analytics.readonly']);

  authClient.authorize(function (err, tokens) {
    if (err) { console.log("err is: " + err); return; }

    let request = requestsGen().report().viewId('167067425').dimension('ga:pagePath').metric('ga:uniquePageviews').metric('ga:avgTimeOnPage')
                   .dateRanges('2018-01-01', 'today').dateRanges('7daysAgo', 'today').filtersExpression('ga:pagePath==/piloto/carcara').get();

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

app.get('/', function(req, res){
  var result = GetNumberOfSessions(res);
});

app.listen(3000, function(){
  console.log('App running!')
});
