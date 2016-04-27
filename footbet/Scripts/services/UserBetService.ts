module Services {
    "use strict";

    export class UserBetService {
        static $inject = [
            "$http"
        ];

        constructor(private $http) { }

        public getUsers(): ng.IPromise<IUser[]> {
            return this.$http({
                    method: 'GET',
                    url: "../User/GetUsers"
                });
        }
    }
}