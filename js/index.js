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


        $scope.calcProfits = function() {
            if ($scope.userHashSuffix == "GH") {
                $scope.userHashSuffixMult = 1e9;
            }
            if ($scope.userHashSuffix == "TH") {
                $scope.userHashSuffixMult = 1e12;
            }
            if ($scope.userHashSuffix == "PH") {
                $scope.userHashSuffixMult = 1e15;
            }
            if ($scope.powerSuffix == "W") {
                $scope.userPowerSuffixMult = 0.001;
            } else {
                $scope.userPowerSuffixMult = 1;
            }

            $scope.earnings.hourGrossBTC = ($scope.userHash/(65536*65536*$scope.difficulty))*$scope.reward*3600*$scope.userHashSuffixMult;
            $scope.values[0] = [$scope.earnings.hourGrossBTC];
            $scope.earnings.hourGrossUSD = $scope.earnings.hourGrossBTC*$scope.price;
            $scope.values[1] = [$scope.earnings.hourGrossUSD];
            $scope.earnings.powerCostHour = ($scope.wattage*$scope.userPowerSuffixMult*$scope.powerCost)
            $scope.values[2] = [$scope.earnings.powerCostHour];
            $scope.earnings.poolCostHour = ($scope.earnings.hourGrossUSD*($scope.poolFee/100));
            $scope.values[3] = [$scope.earnings.poolCostHour];
            $scope.earnings.profitHour = (($scope.earnings.hourGrossUSD - $scope.earnings.powerCostHour) - $scope.earnings.poolCostHour);
            $scope.values[4] = [$scope.earnings.profitHour];
            $scope.earnings.hourGrossBTCNext = $scope.earnings.hourGrossBTC/(1+($scope.nextDifficulty/100));
            $scope.values[5] = [$scope.earnings.hourGrossBTCNext];
            $scope.earnings.hourGrossUSDNext = $scope.earnings.hourGrossBTCNext*$scope.price;
            $scope.values[6] = [$scope.earnings.hourGrossUSDNext];
            $scope.earnings.poolCostHourNext = ($scope.earnings.hourGrossUSDNext*($scope.poolFee/100));
            $scope.values[7] = [$scope.earnings.poolCostHourNext];
            $scope.earnings.profitHourNext = (($scope.earnings.hourGrossUSDNext - $scope.earnings.powerCostHour) - $scope.earnings.poolCostHourNext);
            $scope.values[8] = [$scope.earnings.profitHourNext];

            for (var i = 0; i < $scope.values.length; i++) {
                //earnings/costs per day
                $scope.values[i][1] = $scope.values[i][0] * 24;
                //earnings/costs per week
                $scope.values[i][2] = $scope.values[i][1] * 7;
                //earnings/costs per month
                $scope.values[i][3] = $scope.values[i][1] * 30;
                //earnings/costs per year
                $scope.values[i][4] = $scope.values[i][1] * 365;
            }

            if (typeof $scope.userHash !== "undefined" && typeof $scope.reward !== "undefined" && typeof
                    $scope.price !== "undefined" && typeof $scope.difficulty !== "undefined") {
                $scope.drawChart();
            }
        }

        $scope.drawChart = function(drawN) {
            var labels = [];
            $scope.profit = [0];
            var axisScaleFactor = Math.floor($scope.timeFrame/16) + 1;

            var rollingDiffFactor = 1/(1+($scope.nextDifficulty/100));
            for (var i = 0; i <= $scope.timeFrame; i++) {
                labels[i] = i + (i == 1? " Month" : " Months");
                if (i > 0) {
                    //profit logic
                    $scope.profit[i] = $scope.profit[i-1] + 2.167*(rollingDiffFactor*$scope.values[1][2] - rollingDiffFactor*$scope.values[3][2] - $scope.values[2][2]);
                    rollingDiffFactor *= 1/(1+($scope.nextDifficulty/100));
                    $scope.profit[i] += + 2.167*(rollingDiffFactor*$scope.values[1][2] - rollingDiffFactor*$scope.values[3][2] - $scope.values[2][2]);
                    $scope.profit[i] =  parseFloat($scope.profit[i].toFixed(2));
                }
            }


            var data = {
                labels: labels,
                datasets: [
                    {
                        label: "Profit",
                        fillColor: "rgba(0,0,0,0.2)",
                        strokeColor: "rgba(0,0,0,1)",
                        pointColor: "rgba(0,0,0,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: $scope.profit
                    }]
            };




            .config(function($mdThemingProvider) {

            // Configure a dark theme with primary foreground yellow

            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();

            $mdThemingProvider.theme('docs-light', 'default')
                .primaryPalette('blue')
                .accentPalette('green');


        });
            
            $scope.changeAxis = function() {
                $scope.myLineChart.destroy();
                $scope.drawChart(true);
            }
