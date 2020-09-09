[![Community Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/Community_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#community-project)

# New Relic Dashboard Copy Tool

The Dashboard Copy Tool allows you to copy dashboards between New Relic accounts using a [Admin API key](https://docs.newrelic.com/docs/apis/get-started/intro-apis/types-new-relic-api-keys#admin). The copy tool:

* Copies dashboards between any account
* Copies dashboards between US and EU regions
* Detects when charts have [facet filtering](https://docs.newrelic.com/docs/dashboards/new-relic-one-dashboards/manage-your-dashboard/filter-new-relic-one-dashboards-facets) enabled to "current dashboard" and preserves the setting
* Detects if dashboard layout is New Relic One or Insights. The original layout will be preserved

A note on cross-account charts:

Dashboards can have charts that show data from different accounts. However, the dashboard API will only show details for charts with the same account ID as the API key. [Cross-account charts will be inaccessible](https://docs.newrelic.com/docs/insights/insights-api/manage-dashboards/insights-dashboard-api#requirements) by the API and fail to copy.

## Installation
This tool does not need to be installed and can be used through the [Dashboard Copy Tool](https://newrelic.github.io/newrelic-dashboard-copy-tool/) link. See the **Building** section for steps to run the copy tool locally.

## Getting Started
You need an Admin API key for each account. Please refer to the [API key documentation](https://docs.newrelic.com/docs/apis/get-started/intro-apis/types-new-relic-api-keys#admin) for information on creating this API key.

Follow the link to use the [Dashboard Copy Tool](https://newrelic.github.io/newrelic-dashboard-copy-tool/)

## Usage
Get list of dashboards:
* Enter a source Admin API key
* Search for a dashboard [optional]. You can add a search term later
* Choose region US/EU
* Get Dashboards!

Choose dashboards to copy:
* Clicking on dashboards adds them to your copy list
* Clicking dashboards on your copy list removes them

Copy dashboards:
* Enter a destination Admin API key
* Self-facet filters are preserved by default
* Choose region US/EU
* Transfer Dashboards!

Once you get a list of dashboards, the source API key is locked. The only way to unlock this field is to refresh the page.

After transferring dashboards, the **Transfer** button will be disabled.
Use the **Reset List** button to clear the list and add more dashboards if needed.
Changing the destination API key will also enable the **Transfer** button. This allows you to copy a set of dashboards to multiple accounts sequentially.

## Building

You can run the copy tool locally using the following steps:

1. clone the repo
2. `cd` to the repo folder
3. Run `npm install`
4. Run `node start.js`
5. Navigate to `http://localhost:8080`to view the local build

## Support

New Relic hosts and moderates an online forum where you can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

https://discuss.newrelic.com/t/new-relic-dashboard-copying-tool/104393

## Contributing

Contributions to improve New Relic Dashboard Copy Tool are encouraged! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
To execute our corporate CLA, which is required if your contribution is on behalf of a company, or if you have any questions, please drop us an email at open-source@newrelic.com.

## License
New Relic Dashboard Copy Tool is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

The New Relic Dashboard Copy Tool also uses source code from third party libraries. Full details on which libraries are used and the terms under which they are licensed can be found in the third party notices document.
