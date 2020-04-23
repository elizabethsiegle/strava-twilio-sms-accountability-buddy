const got = require('got');
exports.handler = async function (context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();
  try {
    const response = await got(
      `https://www.strava.com/api/v3/athlete/activities?per_page=1&access_token=${context.STRAVA_ACCESS_TOKEN}`
    );
    const data = JSON.parse(response.body);
    var distance = data[0].distance;
    if(!distance < 1609.34) {
        distance = Math.round(data[0].distance * 0.000621371192); //meters to miles
        distance = distance.toString().substring(0,6); 
        distance += '-mile';
    }
    else {
        distance += '-meter';
    }
    const date = data[0].start_date;
    const prettyDate = date.substring(5,10); //month and day
    var time = data[0].moving_time;
    time = secondsToHrsMins(time);
    twiml.message(`Lizzie's last Strava workout was a ${distance} ${data[0].type} on ${prettyDate} in ${time} minutes. Make her run more and run faster`);
    callback(null, twiml);
  } catch (error) {
    twiml.message("There was an error getting the data from the Strava API. Try again later or ping Lizzie directly to further guilt her into running outside today.");
    callback(null, twiml);
  }
};
function secondsToHrsMins(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);  
}
