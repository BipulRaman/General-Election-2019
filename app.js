// Defining AngularJS App
var MainApp = angular.module('MainApp', [
    'ngRoute',
    'MainAppControllers',
    'ngSanitize'
]);

// Route Config
MainApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/error', {
            templateUrl: 'partials/error.html',
            controller: 'ErrorCtrl'
        })
        .otherwise({
            redirectTo: '/error'
        });
}]);

// Main controller
var MainAppControllers = angular.module('MainAppControllers', []);

// Controller for Body
MainAppControllers.controller('BodyCtrl', function ($scope, $http) {

});

// Controller for Home View
MainAppControllers.controller('HomeCtrl', function ($scope, $http) {
    $scope.Links = [];
    getConstituencyData($http)
        .then(r => {
            var states = [...new Set(r.data.map(item => item.State))];
            var countryData = [];
            states.forEach(function (element) {
                countryData[element] = r.data.filter(item => item.State == element);
            });
            $scope.Data = countryData;
        })
        .catch(error => {
            console.log(error);
        });

    getElectionSchedule($http)
        .then(r => {
            $scope.Dates = r.data;
        })
        .catch(error => {
            console.log(error);
        });

    // On Constituency Select Change
    $scope.constituencySelect = function () {
        $scope.Schedule = $scope.Dates.filter(item => item.Schedule == $scope.selectedConstituency.Schedule)[0];
        console.log($scope.selectedConstituency);
        console.log($scope.Schedule);
        var selectedConstituency = $scope.selectedConstituency;
        $scope.Links.MPProfile = encodeURI("http://myneta.info/search_myneta.php?q=" + selectedConstituency.MP_2014 + "+" + selectedConstituency.Constituency);
        $scope.Links.AllNeta = encodeURI("http://myneta.info/search_myneta.php?q=" + selectedConstituency.Constituency);

    }
});

// Function to get Formatted Date
function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    return str;
}

// Function to get LokSabha constituency details schedule
function getConstituencyData($http) {
    var xTime = getFormattedDate();
    return $http.get("data/eci.json?t=" + xTime);
}

// Function to get election schedule
function getElectionSchedule($http) {
    var xTime = getFormattedDate();
    return $http.get("data/schedule.json?t=" + xTime);
}