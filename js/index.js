angular
    .module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('DemoCtrl', function($scope, $http) {

        if($scope.search == undefined) {
            $scope.search = "";
            $scope.currency = "USD";
            fetch();
        }

        $scope.user = {
            email: 'ipsum@lorem.com',
            firstName: '',
            lastName: '',
        };

        var task;

        $scope.change = function() {
            if(task) {
                clearTimeout(task);
            }
            task = setTimeout(fetch, 800);
        };
        $scope.update = function() {
            $scope.search = $scope.others.Search[index].Title;
            $scope.change();
        };
        $scope.select = function() {
            this.valueOfSelectionRange(0, this.value.length);
        }
        $scope.earnings = {};
        $scope.values = [];

        function fetch() {
            $http.get("https://bitcoin.toshi.io/api/v0/blocks/latest")
                .success(function(response) {
                    $scope.bitcoinStats = response;
                    $scope.difficulty = parseFloat(response.difficulty.toFixed(0));
                    $scope.reward = response.reward/1E8;
                });
            //finding average price between 3 high volume exchanges.
            $http.get("https://api.bitcoinaverage.com/exchanges/USD")
                .success(function(response) {
                    $scope.priceBitfinex = response.bitfinex.rates.last;
                    $scope.priceBitStamp = response.bitstamp.rates.last;
                    $scope.pricebtce = response.btce.rates.last;
                    $scope.price = parseFloat((($scope.priceBitfinex + $scope.priceBitStamp + $scope.pricebtce) /3).toFixed(2));
                });
        }

        $scope.getOnlyPrice = function() {
            //finding average price between 3 high volume exchanges.
            $http.get("https://api.bitcoinaverage.com/exchanges/" + $scope.currency)
                .success(function(response) {
                    if ($scope.currency == "USD") {
                        $scope.priceBitfinex = response.bitfinex.rates.last;
                        $scope.priceBitStamp = response.bitstamp.rates.last;
                        $scope.pricebtce = response.btce.rates.last;
                        $scope.price = parseFloat((($scope.priceBitfinex + $scope.priceBitStamp + $scope.pricebtce) /3).toFixed(2));
                        $scope.calcProfits();
                    } else if ($scope.currency == "CNY") {
                        $scope.price = parseFloat(response.btc38.rates.last.toFixed(2));
                        $scope.calcProfits();
                    } else if ($scope.currency == "CAD") {
                        $scope.priceQuadrigacx = response.quadrigacx.rates.last;
                        $scope.priceCavirtex = response.cavirtex.rates.last;
                        $scope.priceCoinbase = response.coinbase.rates.last;
                        $scope.price = parseFloat((($scope.priceQuadrigacx + $scope.priceCavirtex + $scope.priceCoinbase) /3).toFixed(2));
                        $scope.calcProfits();
                    } else if ($scope.currency == "AUD") {
                        $scope.btcmarkets = response.btcmarkets.rates.last;
                        $scope.price = parseFloat($scope.btcmarkets.toFixed(2));
                        $scope.calcProfits();
                    }
                });
        }




        .config(function($mdThemingProvider) {

            // Configure a dark theme with primary foreground yellow

            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();

            $mdThemingProvider.theme('docs-light', 'default')
                .primaryPalette('blue')
                .accentPalette('green');


        });