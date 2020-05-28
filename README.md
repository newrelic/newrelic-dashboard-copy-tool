[![Community Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/Community_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#community-project)

# New Relic Dashboard Copy Tool

The Dashboard Copy Tool allows you to copy dashboards between New Relic accounts using an [REST API key](https://docs.newrelic.com/docs/apis/get-started/intro-apis/types-new-relic-api-keys#rest-api-key). The tool has the following features:

* Copies dashboards between any account
* Copies dashboards between US and EU regions
* Detects when charts have [facet filtering](https://docs.newrelic.com/docs/dashboards/new-relic-one-dashboards/manage-your-dashboard/filter-new-relic-one-dashboards-facets) enabled to "current dashboard" and preserves the setting

Note on dashboard layouts:

Currently the dashboard API only handles the 3 column layout used by the Insights UI. Dashboards that have been created/modified in New Relic One use a 12 column layout. The layout for these dashboards may need to be edited after transfering.

## Installation
This tool does not need to be installed and can be used through the [Dashboard Copy Tool]() link. See the Building section for steps to run this locally.

## Getting Started
You will need a REST API key for each account. Please refer to the [API key documentation](https://docs.newrelic.com/docs/apis/get-started/intro-apis/types-new-relic-api-keys#rest-api-key) for information on creating this API key.

Follow the link to use the [Dashboard Copy Tool]()

## Usage
Get list of dashboards:
* Enter a source REST API key
* Search for a dashboard [optional]
* You can add search term later
* Choose region US/EU
* Get Dashboards!

Choose dashboards to copy:
* Clicking on dashboard will add to copy list
* Clicking dashboards on copy list will remove them

Copy dashboards:
* Enter destination REST API key
* Self-facet filters are preserved by default
* Choose region US/EU
* Transfer Dashboards!

Once you get a list of dashboards the source API key is locked. The only way to unlock this field is to refresh the page.

After transferring dashboards the transfer button will be disabled.
Use the Reset List button to clear the list and add more dashboards if needed.
Changing the destination API key will also enable the transfer button. This allows you to copy a set of dashboards to multiple accounts sequentially.

## Building

This can be ran locally using the following steps:

1. clone repo
2. cd to repo folder
3. `npm install`
4. `node start.js`
5. navigate to `http://localhost:8080`

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

>Add the url for the support thread here

## Contributing
Full details about how to contribute to
Contributions to improve New Relic Dashboard Copy Tool are encouraged! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
To execute our corporate CLA, which is required if your contribution is on behalf of a company, or if you have any questions, please drop us an email at open-source@newrelic.com.

## License
New Relic Dashboard Copy Tool is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
