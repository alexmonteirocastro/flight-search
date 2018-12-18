module.exports = {
  'Demo test Google' : function (browser) { 

    /* 
    *
    *
    * I decided to scrape data from each column separately, 
    * hence the different arrays for the different 
    * flight details (from the different columns).
    * In the end I loop throught the prices array and generate JSON obejcts
    * which I add to the flights array (thhe final result)
    * 
    * */

    // Initializing my variables
    var departures = []
    var arrivals = []
    var stops = []
    var durations = []
    var prices = []
    var flights = []

    // I decided to use page objects for better convenience
    const united = browser.page.united_flights()
    
    united.navigate() // navigates to United Airlines home page
      
    
    browser
      .waitForElementVisible('body', 1000) // basically waits for the page to load
      .getTitle(function(title) {
        this.assert.ok(title.includes('United Airlines')); // Initial assertion that I am in the relevant page
      })

    united
      .click('@oneWayFlight') // selecting a one-way flight
      .setValue('@flightOrigin', ['New York, NY, US (JFK - Kennedy)', browser.Keys.ENTER]) // selecting the departure airport
      .waitForElementVisible('@flightOriginSuggestion', 1000) // I wait for the suggestion
      .click('@flightOriginSuggestion') // and click on it
      .assert.value('@flightOrigin', 'New York JFK') // I then assert that the final value in the inout field is what I want
      .setValue('@flightDestination', ['Miami, FL, US (MIA - All Airports)', browser.Keys.ENTER]) // selecting the destination airport
      .waitForElementVisible('@flightDestinationSuggestion', 1000) // I wait for the suggestion
      .click('@flightDestinationSuggestion') // and click on it
      .assert.value('@flightDestination', 'Miami MFL') // I then assert that the final value in the inout field is what I want
      .click('@flightDate')
      .assert.visible('@flightCalendar') // open the calendar

    // It is good practise to have a calculate the remaining months until the desired date 
    // so that this test script can be robust and run anytime
    var todayDate = new Date();
    var travelDate = new Date(2019, 8, 20);
    var dateDiff = new Date(travelDate.getTime() - todayDate.getTime());
    var monthsRemaining = dateDiff.getUTCMonth(); // Gives month count of difference

    /* I advance the calendar a number of times which is equal the total remaining months 
    *  until the travel date minus one (1) month
    *  minus 2 becuase the calendar component shows always 2 months 
    *  and, by default, it shows the current month and the next  
    *  this way I will be able to advance the calendar until 
    *  having the month of August on the left side and then selecting the 20th of August
    * This algorithm ensures that the tests can even be run in July and even August 2019
    *
    **/

    for(i=0; i < monthsRemaining - 1; i++){
      united.click('@calendarNextMonth') 
    }
    
    united
      .click('@aug20th') // click the desired travel day
      .assert.value('@flightDate', 'Aug 20') // I then assert that the final value in the inout field is what I want
      .click('@submitBtn') // I then submit the form to search for flights
      .waitForElementVisible('@loadMsg', 1000) // wait up to 1000 to see the spinner, which means we have been redirected
      .waitForElementNotVisible('@loadMsg', 10000) // wait for the spinner to disappear and the search results will be fetched
      .waitForElementVisible('@showAllResults', 1000) // wait for the button to render
      .click('@showAllResults') // click the button to show all the results
      .waitForElementVisible('@resultList', 1000) // makes sure the results table renders
      .click('@sortByeconomy') // sorts by economy
      
      browser.waitForElementVisible('.flight-time-depart', 1000) // to make sure the departure column is rendered properly after updating the component (sorting)


      /*
      *
      *
      * This is the part where I scrape the flight data
      * since I did not have time yet to properly understand how the 
      * nightwatchJS's executeAsync() function works, 
      * I decided to hack it a little bit and manually create a promise
      * that resolves once all the data from the desired columns has been scraped 
      * (by scraped, I mean, iterated all the elements of the same type - same column - 
      * grabbed the text content and stored it into the column arrays
      * that I initialized in the beginning of the test
      * 
      * */

      var getFlightDetails = new Promise (function (resolve, reject) {
        browser
          .elements('css selector', '.flight-time-arrive', function(res){
            res.value.forEach(function(obj){
              return browser.elementIdText(obj.ELEMENT, function(res){
                return arrivals.push(res.value)
              })
            })
          })
          .elements('css selector', '.flight-time-depart', function(res){   
            res.value.forEach(function(obj){
              return browser.elementIdText(obj.ELEMENT, function(res){
                return departures.push(res.value)
              })
            })
          })
          .elements('css selector', '.flight-connection-container', function(res){
            res.value.forEach(function(obj){
              return browser.elementIdText(obj.ELEMENT, function(res){
                return stops.push(res.value)
              })
            })
          })
          .elements('css selector', '.flight-summary-bottom', function(res){
            res.value.forEach(function(obj){
              return browser.elementIdText(obj.ELEMENT, function(res){
                return durations.push(res.value)
              })
            })
          })
          .elements('css selector', '.fare-option-economy .price-point.price-point-revised.use-roundtrippricing', function(res){
            res.value.forEach(function(obj){
              return browser.elementIdText(obj.ELEMENT, function(res){
                return prices.push(res.value)
              })
            })
    
            setTimeout(function(){
              if(departures.length === arrivals.length && stops.length === durations.length 
                && prices.length === res.value.length) {
                resolve()
              } else {
                reject(Error('failed to scrape data'))
              }
            }, 1000) 
            /*
            *
            * I had to put a little timeout to make sure the function was only triggering 
            * after the latest piece iof column data has been scraped and then
            * I use the if statement for the same purpose as an assumption to make sure all
            * columns have the same ammount of data scrapped (all arrays have the same length)
            * 
            * */
          })
      })

      /*
      *
      * and here I am doing it asynchronously, waiting for the promise to resolve
      * before looping through all my column arrays, storing their data in objects 
      * and finally storing those objects in the final array, which I then parse into JSON
      *
      * */

      getFlightDetails.then(function(result){
        for(i=0; i<prices.length; i++) {
          flights.push({
            Depart: departures[i],
            Arrive: arrivals[i],
            Stops: stops[i],
            Duration: durations[i],
            Price: prices[i]
          })
        }
        console.log(JSON.stringify(flights, null, "  ")); // "pretty prints" the array of JSON objects"
      }, function(err){
        console.log(err)
      })

    browser.end(); // ends the test
  }
};