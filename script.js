// DOM Elements
const getSourceButton = document.getElementById('source-button');
const sourceKeyInput = document.getElementById('api-key-from-input');
const destinationKeyInput = document.getElementById('api-key-to-input');
const titleFilterInput = document.getElementById('title-filter-input');
const transferButton = document.getElementById('transfer-button');
const resetButton = document.getElementById('reset-list-button');
const sourceRegionButton = document.getElementById('sourceRegionSelect');
const destinationRegionButton = document.getElementById('destinationRegionSelect');
const sourceList = document.getElementById('source');
const pagination = {
  previous: document.getElementById('pagination-previous'),
  next: document.getElementById('pagination-next'),
  list: document.getElementById('results-pagination')
};

// Dashboards to transfer
const dashboardTransferList = new Map();
let dashboardSearchResults;
const resultsPerPage = 100;
const paginationState = {
  available: 1,
  currentPage: 1
};
// TODO updating API key should reset pagination state

// Set API region endpoint default to US
var sourceRegionUrl = 'api.newrelic.com';
var destinationRegionUrl = 'api.newrelic.com';

sourceKeyInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    listDashboards();
  }
});

titleFilterInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    listDashboards();
  }
});

// Enable the transfer button if a new API is entered
destinationKeyInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    transferButton.disabled = false;
    dashboardTransferList.forEach((dashboard, uuid) => {
      document.getElementById(uuid).setAttribute('style', "background: transparent;")
      document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ''
    })
  }
});

// Begin dashboard transfer process
function transferDashboardButton() {
  transferButton.disabled = true;
  dashboardTransferList.forEach(getDashboard);
}

// Clear the list of dashboards and enable transfer button
function resetTransferListButton() {
  dashboardTransferList.clear();
  $('#destination').empty();
  transferButton.disabled = false;
}

pagination.next.addEventListener('click', getNextPage);
pagination.previous.addEventListener('click', getPreviousPage);

function getPaginationElement(index) {
  return `<li class="page-item"><a class="page-link">${index}</a></li>`
}

function clearUIResults() {
  pagination.list.style.display = 'none';
  while (sourceList.firstChild) {
    sourceList.removeChild(sourceList.firstChild);
  }
}

function getNextPage() {
  // TODO: add numbered page list
  // pagination.list.childElementCount

  paginationState.currentPage++;
  listDashboards();
}

function getPreviousPage() {
  paginationState.currentPage--;
  listDashboards();
}

function updatePagination(resultCount, requestCount) {
  pagination.next.style.visibility = 'hidden';
  pagination.previous.style.visibility = paginationState.currentPage > 1 ? 'visible' : 'hidden';
  pagination.list.style.display = 'flex';

  if (resultCount < requestCount) {
    pagination.next.style.visibility = 'hidden';
  } else {
    checkNextPagination().then(result => {
      if (result) {
        pagination.next.style = 'visible';
        // paginationState.available++;
        // TODO: logic to verify whether we're at the end of the list and should add another element to the list (see getNextPage)
      }
    })
  }
}

function checkNextPagination() {
  return new Promise(function (resolve, reject) {
    const dashboardIndex = paginationState.currentPage * resultsPerPage + 1;

    $.ajax({
      url: `https://${sourceRegionUrl}/v2/dashboards.json?page=${dashboardIndex}&per_page=1`,
      method: 'GET',
      dataType: 'json',
      headers: {
        'X-Api-Key': sourceKeyInput.value
      }
    }).done(function (response) {
      resolve(response.dashboards.length > 0)
    });

  });
}

function setRegionUrl(region, type) {
  if (region.value == 'EU') {
    var tempRegionUrl = 'api.eu.newrelic.com';
  } else {
    var tempRegionUrl = 'api.newrelic.com';
  }

  if (type == 'source') {
    sourceRegionUrl = tempRegionUrl;
  } else if (type == 'destination') {
    destinationRegionUrl = tempRegionUrl;
  }
}

function getQueryString() {
  const currentPage = paginationState.currentPage || '1';
  const filter = titleFilterInput.value ? `&filter[title]=${titleFilterInput.value}` : ''

  return encodeURI(`https://${sourceRegionUrl}/v2/dashboards.json?page=${currentPage}&per_page=${resultsPerPage}${filter}`)
}

function listDashboards() {
  sourceKeyInput.readOnly = true;
  clearUIResults();
  setRegionUrl(sourceRegionButton, 'source');
  console.log('source API: ', sourceRegionUrl);

  const request = new XMLHttpRequest();
  request.open('GET', getQueryString());
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('X-Api-Key', sourceKeyInput.value);

  // MDN warns this event handler should not be used from "native code", investigate before publishing
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status == 200) {
      dashboardSearchResults = JSON.parse(request.response).dashboards;
      dashboardSearchResults.forEach(renderDashboard);
      updatePagination();
    } else if (request.readyState === 4) {
      // GET request error handling would go here
      console.warn('non 200 response code', request);
    }
  }
  request.send();
}

function renderDashboard(dashboard, index) {
  $('ul#source').append(`
      <li
        class="list-group-item"
        id="${dashboard.id}"
        data-dashboard-id="${dashboard.id}"
        data-index="${index}"
      >${dashboard.title}</li>`
  );
  // add selected dashboard to transfer list
  document.getElementById(`${dashboard.id}`).addEventListener("click", addDashboard);
}

function addDashboard(clickEvent) {
  const uuid = generateId();
  const index = clickEvent.target.dataset.index;
  const dashboard = dashboardSearchResults[index];
  dashboardTransferList.set(uuid, dashboard);

  $('#destination').append(`<li class="list-group-item" id="${uuid}">${dashboard.title} <span class="status"></span></li>`);
  document.getElementById(uuid).addEventListener("click", removeDashboard);
}

function removeDashboard(clickEvent) {
  const element = clickEvent.srcElement;
  dashboardTransferList.delete(element.id);
  element.remove();
}

function getDashboardIds() {
  console.log(dashboardTransferList)
  dashboardTransferList.entries().forEach((uuid, dashboard) => {
    console.log(uuid, dashboard);
  })
}


// Retrieves a selected dashboard then pass to checkLayout
function getDashboard(dashboard, uuid) {
  setRegionUrl(destinationRegionButton, 'destination');
  console.log('destination API: ', destinationRegionUrl);
  
  const id = dashboard.id;
  var sourceKey = $('#api-key-from-input').val();
  $.ajax({
    url: `https://${sourceRegionUrl}/v2/dashboards/${id}.json?sort=%2527last+edited%2527`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'X-Api-Key': sourceKey
    }
  }).done(function (response) { // response === dashboard schema
    document.getElementById(uuid).setAttribute('style', "background: yellow;")
    document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - copying...'
    checkLayout(response, uuid);
  }).fail(function (xhr, textStatus, error) {
    console.log('Errors', textStatus, error);
    document.getElementById(uuid).setAttribute('style', "background: red;")
    document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - failed!'
  })
  // NOTE: no error handling
}

// Try to determine if the dashboard has NR1 layout (12 column) then pass to sanitizeDashboard
function checkLayout(response, uuid) {
  console.log('checking dashboard layout:', response)
  const nr1TextNode = document.createTextNode(" (NR1 layout)")

  // Loop through the charts checking width, height, and column size
  if (response.dashboard.widgets) {
    response.dashboard.widgets.forEach(widget => {
      if (widget.layout.width > 3 || widget.layout.height > 3 || widget.layout.column > 3) {
        console.log('NR1 layout detected:', response)
        document.getElementById(uuid).appendChild(nr1TextNode)
        // Add element grid_column_count to dashboard and set for NR1 layout
        response.dashboard.grid_column_count = 12
      } else {
        console.log('Insights layout detected:', response)
      }
    })
  }

  sanitizeDashboard(response, uuid)
}

// Removes account specific details and check for existing facet links
function sanitizeDashboard(response, uuid) {
  console.log('sanitizing dashboard:', response)
  let facetLinkExists = false;
  //TODO: scope this variable
  oldDashboardId = response.dashboard.id;

  // Remove dashboard details which will be recreated on new account
  const attributes = ['id', 'created_at', 'updated_at', 'owner_email', 'account_id', 'api_url', 'ui_url']
  attributes.forEach(attribute => delete response.dashboard[attribute]);

  // Loop through the charts looking for facet links
  if (response.dashboard.widgets) {
    response.dashboard.widgets.forEach((widget, index) => {
      delete widget.widget_id;
      delete widget.account_id;
      // inaccessible check here accounts for improperly created dashboards without an account id
      if (widget.visualization !== 'inaccessible' && !widget.presentation.drilldown_dashboard_id) {
        facetLinkExists = true;
      } else if (widget.visualization === 'inaccessible') {
        console.log('WIDGET INACCESSIBLE')
        response.dashboard.widgets.splice(index, 1);
      }
    })
  }

  createDashboard(response, facetLinkExists, oldDashboardId, uuid);
}

// Creates dashboard on destination account
function createDashboard(response, facetLinkExists, oldDashboardId, uuid) { // response === dashboard schema from source dashboard
  $.ajax({
    url: `https://${destinationRegionUrl}/v2/dashboards.json`,
    crossDomain: true,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(response),
    contentType: 'application/json',
    headers: {
      'X-Api-Key': $('#api-key-to-input').val()
    }
  }).done(function (response) {
    // preserve self-facets if needed
    if (facetLinkExists && document.getElementById('preserveFacet').checked) { // see sanitizeDashboard() for context
      updateFacetLink(response, oldDashboardId, uuid);

      document.getElementById(uuid).setAttribute('style', "background: greenyellow;")
      document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - updating facets...'
    } else {
      document.getElementById(uuid).setAttribute('style', "background: lime;")
      document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - complete!'
    }
    
  }).fail(function (xhr, textStatus, error) {
    console.log('Errors', textStatus, error);
    document.getElementById(uuid).setAttribute('style', "background: red;")
    document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - failed!'

  });
}

// Find facet links to old dashboard id and update to the new id
function updateFacetLink(response, oldDashboardId, uuid) {
  const newDashboardId = response.dashboard.id;
  response.dashboard.widgets.forEach(widget => {
    if (widget.presentation.drilldown_dashboard_id === oldDashboardId) {
      console.log('old dashboard id found');
      console.log('old id = ' + oldDashboardId);
      console.log('new id = ' + newDashboardId);
      widget.presentation.drilldown_dashboard_id = newDashboardId;
    }
  })
  updateDashboard(response, newDashboardId, uuid);
}

// Update dashboard with the new facet links
function updateDashboard(response, newDashboardId, uuid) {
  $.ajax({
    url: `https://${destinationRegionUrl}/v2/dashboards/${newDashboardId}.json`,
    crossDomain: true,
    method: 'PUT',
    dataType: 'json',
    data: JSON.stringify(response),
    contentType: 'application/json',
    headers: {
      'X-Api-Key': $('#api-key-to-input').val()
    }
  }).done(function (response) {
    document.getElementById(uuid).setAttribute('style', "background: lime;")
    document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - complete!'
    console.log(response);
  }).fail(function (xhr, textStatus, error) {
    console.log('Errors', textStatus, error);
    document.getElementById(uuid).setAttribute('style', "background: red;")
    document.getElementById(uuid).getElementsByClassName('status')[0].innerHTML = ' - failed!'
  });
}

// -=-=-=-=-=-=-=- helper code below -=-=-=-=-=-=-=-

const generateId = (function () {
  // ID Generator source: https://gist.github.com/mikelehen/3596a30bd69384624c11
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  var lastPushTime = 0;

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we'll use those same characters except
  // "incremented" by one.
  var lastRandChars = [];

  return function () {
    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.');

    var id = timeStampChars.join('');

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) throw new Error('Length should be 20.');

    return id;
  };
})();
