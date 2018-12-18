const searchForm = {
  oneWayFlight: {
    selector: '#oneway'
  },
  flightOrigin: {
    selector: '#bookFlightOriginInput'
  },
  flightOriginSuggestion: {
    selector: 'UL#downshift-0-menu'
  },
  flightDestination: {
    selector: '#bookFlightDestinationInput'
  },
  flightDestinationSuggestion: {
    selector: 'UL#downshift-1-menu'
  },
  flightDate:{
    selector: 'input[name="DepartDate"]'
  },
  flightCalendar: {
    selector: '[aria-label="Calendar"]'
  },
  calendarNextMonth: {
    selector: 'button.DayPickerNavigation_rightButton__horizontal'
  },
  aug20th: {
    selector: '//*[@id="passengersSlidingInputContainer"]/div[1]/div/div/div/div/div[2]/div/div/div[1]/div[2]/div[2]/div/div[2]/div/table/tbody/tr[4]/td[2]',
    locateStrategy: 'xpath'
  },
  submitBtn: {
    selector: 'button[aria-label="Find flights"]'
  }
};

const resultsPage = {
  loadMsg: {
    selector: '.loading-message'
  },
  showAllResults: {
    selector: '#fl-results-pagerShowAll'
  },
  resultList: {
    selector: '.flight-result-list'
  },
  sortByeconomy: {
    selector: '#column-ECONOMY .icon-sorter'
  }
};

module.exports = {
  url: 'https://www.united.com/',
  elements: [
    searchForm,
    resultsPage
  ]
};