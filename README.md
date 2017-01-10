## Synopsis

This is an AngularJS App for calculating profitability of mining  profitability chartsThe utility fetches live Bitcoin network &amp; price data from bitcoin.toshi.io and bitcoinaverage.com. This project is still a work in progress and is currently meant for experimental and learning purposes only. Please use at your own risk.

## Motivation

This app was created to build and expand the authors knowledge of AngularJS and to explore available API's in the cryptocurrency space. If able, please offer productive critiques and feedback for further improvement of the app.

## Demo Site
- http://btccalck.tk/

## Installation/Setup

For Merchant use, navigate to the "config/data.json" file. There are two required and one optional fields in this file at the moment (Required:items, Required:defaultCoin, Optional:addresses). The items field is meant to store merchant items (i.e. coffee, tea, concert ticket, etc.). The defaultCoin field is meant to store the primary address of the merchant for payment deposits. The addresses field is optional and is meant to store a list of additional merchant Bitcoin addresses that can be viewed on the #/search page from the "Quick Search" drop-down.

## Possible Use-Cases



## Future Improvements/Known Limitations
- Create support for more altcoins on the #/search page.
- Create support for altcoins available on ShapeShift.io that require more than an address for a successful transaction (i.e. Monero).
- $rootscope was not used throughout the app due to several suggestions that it be avoided. However, accessing parent scopes eventually became an issue. There are instances where $modalInstance is used to work around this, but it is less than ideal. This issue also seems to prevent the $scope.items array from being cleared after each transaction requiring the user to click "Remove All Items" instead. Any suggestions on how to best access parent scope would be greatly appreciated.


