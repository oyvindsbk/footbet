footballCompApp.controller('LeagueCtrl', ["$scope", "$http", "$rootScope", function ($scope, $http, $rootScope) {
    $scope.messageClass = "";

    $scope.leagueName = "";
    $scope.leagueCode = "";
    $scope.message = "";
    $scope.leagues = [];
    $scope.selectedLeague = $scope.leagues[1];

    $scope.loadLeagues = function() {
        $http({
            method: 'GET',
            url: "GetLeaguesForUser",
        }).success(function (leagues) {
            $scope.leagues = leagues;
        }).error(function (data, status) {
        });
    };

    $scope.joinLeague = function() {
        $http({
            method: 'POST',
            url: "AddCurrentUserToLeagueByGuid",
            data: { guid: $scope.leagueCode },
        }).success(function (data) {
            if (typeof data.ExceptionMessage != 'undefined') {
                $scope.message = data.ExceptionMessage;
                $scope.messageClass = "error";
            } else {
                $scope.loadLeagues();
            }

        }).error(function (data, status) {
        });
    }

    $scope.addCurrentUserToLeague = function () {
        $http({
            method: 'POST',
            url: "AddCurrentUserToLeague",
            data: { leagueName: $scope.leagueName },
        }).success(function (data) {
            if (typeof data.ExceptionMessage != 'undefined') {
                $scope.message = data.ExceptionMessage;
                $scope.messageClass = "error";
            } else {
                $scope.message = "Her er din kode " + data;
                $scope.messageClass = "success";
                $scope.loadLeagues();
            }

        }).error(function (data, status) {
        });
    };

    $scope.showLeague = function(league) {
        $rootScope.$broadcast("showLeagueEvent", league);
    };

    $scope.addNewLeague = function () {
        if ($scope.leagueName == "") {
            $scope.message = "Liganavn kan ikke være tomt";
            $scope.messageClass = "error";
            return;
        }
        $http({
            method: 'POST',
            url: "AddNewLeague",
            data: { leagueName: $scope.leagueName },
        }).success(function (data) {
            if (typeof data.ExceptionMessage != 'undefined') {
                $scope.message = data.ExceptionMessage;
                $scope.messageClass = "error";
            } else {
                $scope.message = "Her er din kode " + data;
                $scope.messageClass = "success";
                $scope.loadLeagues();

            }
        }).error(function (data, status) {
        });
    };

    $scope.loadLeagues();
}]);