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






        .config(function($mdThemingProvider) {

            // Configure a dark theme with primary foreground yellow

            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();

            $mdThemingProvider.theme('docs-light', 'default')
                .primaryPalette('blue')
                .accentPalette('green');


        });