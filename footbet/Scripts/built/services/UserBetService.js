var Services;
(function (Services) {
    "use strict";
    var UserBetService = (function () {
        function UserBetService($http) {
            this.$http = $http;
        }
        UserBetService.prototype.getUsers = function () {
            var promise = this.$http({
                method: "GET",
                url: "../User/GetUsers"
            }).then(function (response) { return response.data; });
            return promise;
        };
        UserBetService.$inject = [
            "$http"
        ];
        return UserBetService;
    }());
    Services.UserBetService = UserBetService;
})(Services || (Services = {}));
