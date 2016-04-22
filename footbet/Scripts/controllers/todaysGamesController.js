footballCompApp.controller('TodaysGamesCtrl', ['$scope', 'todaysGamesService', function ($scope, todaysGamesService) {
    $scope.todaysGames = [];
    $scope.areDetailsShown = false;
    $scope.daysFromNow = 0;
    $scope.todaysDate = Date.now();
    $scope.nextButtonDisabled = false;
    $scope.previousButtonDisabled = false;

    $scope.nextDay = function () {
        if ($scope.nextButtonDisabled) return;
        $scope.daysFromNow++;
        $scope.getNextGames();
    };

    $scope.previousDay = function () {
        if ($scope.previousButtonDisabled) return;
        $scope.daysFromNow--;
        $scope.getPreviousGames();
    };

    $scope.getNextGames = function () {
        todaysGamesService.getNextGames($scope.daysFromNow).then(function (todaysGames) {
            $scope.previousButtonDisabled = false;
            $scope.todaysGames = todaysGames.TodaysGamesSpecification;
            $scope.nextButtonDisabled = $scope.evaluateNextButtonDisabled();
            $scope.daysFromNow += todaysGames.NumberOfDaysFromToday;
            $scope.todaysDate = getTodaysDatePlusDays($scope.daysFromNow);

        });;
    };

    $scope.getPreviousGames = function () {
        todaysGamesService.getPreviousGames($scope.daysFromNow).then(function (todaysGames) {
            $scope.nextButtonDisabled = false;
            $scope.todaysGames = todaysGames.TodaysGamesSpecification;
            $scope.previousButtonDisabled = $scope.evaluatePreviousButtonDisabled();
            $scope.daysFromNow += todaysGames.NumberOfDaysFromToday;
            $scope.todaysDate = getTodaysDatePlusDays($scope.daysFromNow);
        });;
    };

    $scope.evaluateNextButtonDisabled = function () {
        var eventEnds = new Date(2014, 06, 12);
        if ($scope.todaysDate >= eventEnds.getTime()) {
            return true;
        }
        return false;
    };
     
    $scope.evaluatePreviousButtonDisabled = function () {
        var eventEnds = new Date(2014, 05, 14);
        if ($scope.todaysDate < eventEnds.getTime()) {
            return true;
        }
        return false;
    };
    $scope.getNextGames();
}]);
