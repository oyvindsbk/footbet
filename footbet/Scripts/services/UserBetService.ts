module Services {
    "use strict";

    export class UserBetService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) { }

        public getUsers(): ng.IPromise<IUser[]> {
            var promise = this.$http({
                method: "GET",
                url: "../User/GetUsers"
            }).then(response => response.data);
            return promise;
        }
    }
}