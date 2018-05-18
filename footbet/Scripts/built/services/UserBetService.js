var Services;
(function (Services) {
    "use strict";
    var UserBetService = (function () {
        function UserBetService($http) {
            this.$http = $http;
        }
        UserBetService.prototype.getUsers = function () {
            return this.$http({
                method: 'GET',
                url: "../User/GetUsers"
            });
        };
        UserBetService.$inject = [
            "$http"
        ];
        return UserBetService;
    }());
    Services.UserBetService = UserBetService;
})(Services || (Services = {}));
//# sourceMappingURL=UserBetService.js.map