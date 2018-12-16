module.exports = {
  'Demo test Google' : function (browser) { 
    
    flight = {}

    const united = browser.page.united_flights()
    
    united.navigate()
      
    browser
      .waitForElementVisible('body', 1000)
      .getTitle(function(title) {
        this.assert.ok(title.includes('United Airlines'));
      })

    united
      .click('@oneWayFlight')
      .setValue('@flightOrigin', ['New York, NY, US (JFK - Kennedy)', browser.Keys.ENTER])
      .waitForElementVisible('@flightOriginSuggestion', 1000)
      .click('@flightOriginSuggestion')
      .assert.value('@flightOrigin', 'New York JFK')
      .setValue('@flightDestination', ['Miami, FL, US (MIA - All Airports)', browser.Keys.ENTER])
      .waitForElementVisible('@flightDestinationSuggestion', 1000)
      .click('@flightDestinationSuggestion')
      .assert.value('@flightDestination', 'Miami MFL')
      .click('@flightDate')
      .assert.visible('@flightCalendar')
      .click('@calendarNextMonth')
      .click('@calendarNextMonth')
      .click('@calendarNextMonth')
      .click('@calendarNextMonth')
      .click('@calendarNextMonth')
      .click('@calendarNextMonth')
      .click('@calendarNextMonth')
      .click('@aug20th')
      .assert.value('@flightDate', 'Aug 20')
      .click('@submitBtn')
      .waitForElementVisible('@loadMsg', 1000)
      .waitForElementNotVisible('@loadMsg', 10000)
      .waitForElementVisible('@showAllResults', 1000)
      .click('@showAllResults')
      .waitForElementVisible('@resultList', 1000)
      .click('@sortByeconomy') 
      
    browser
      .pause(1000)
      .end();
  }
};
