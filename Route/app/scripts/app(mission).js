var app = angular.module("fifaApp", ["ngRoute"]);

app.service("UserService", ["$http", function UserService($http) {
    var self = this;
    self.isLogged = false;
    self.test = "Test";
    self.session = function() {
        return self.isLogged;
    };
    self.login = function(user) {
        var promise = $http.post("/api/login", user);
        promise.then(function(response) {
            self.isLogged = true;
        });
        return promise;
    };
}]);

app.service("FifaService", ["$http", function FifaService($http) {
    var self = this;
    self.getTeams = function() {
        return $http.get("api/team");
    };

    self.getTeamDetails = function(code) {
        return $http.get("/api/team/" + code);
    };
}]);

app.controller("MainCtrl", ["UserService", function(UserService) {
    var self = this;
    self.UserService = UserService;
}]);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        "templateUrl": "views/team_list.html",
        "controller": ["FifaService", function(FifaService) {
            var self = this;
            self.teams = {};
            var promise = FifaService.getTeams();
            promise.then(function(response) {
                self.teams = response.data;
            });
        }],
        "controllerAs": "teamListCtrl",
    });
    $routeProvider.when("/login", {
        "templateUrl": "views/login.html",
        "controller": ["UserService", "$location", function(UserService, $location) {
            var self = this;
            self.user = {
                username: "",
                password: ""
            };
            self.login = function() {
                var promise = UserService.login(self.user);
                promise.then(function(success){
                    $location.path("/");
                }, function(error){
                    console.log("Login Failed!");
                });
            };
        }],
        "controllerAs": "loginCtrl"
    });
    //This part is OKAY but less of the Server"s Authentication.
    //Add resolve to avoid unnessasary server access.
    //$routeProvider.when("/team/:code", {
    //    "templateUrl": "views/team_details.html",
    //    "controller": ["$location", "FifaService", "$routeParams", function($location, FifaService, $routeParams) {
    //        var self = this;
    //        var promise = FifaService.getTeamDetails($routeParams.code);
    //        self.team = {};
    //        promise.then(function(response) {
    //            self.team = response.data;
    //        }, function(error) {
    //            //If failed, return to login page.
    //            $location.path("/login");
    //        });
    //    }],
    //    "controllerAs": "teamDetailsCtrl"
    //});
    $routeProvider.when("/team/:code", {
        "templateUrl": "views/team_details.html",
        "controller": ["$location", "FifaService", "$routeParams", function($location, FifaService, $routeParams) {
            var self = this;
            var promise = FifaService.getTeamDetails($routeParams.code);
            self.team = {};
            promise.then(function(response) {
                self.team = response.data;
            }, function(error) {
                //If failed, return to login page.
                $location.path("/login");
            });
        }],
        "controllerAs": "teamDetailsCtrl",
        resolve: {
            auth: ["$q", "$location", "UserService",
            function($q, $location, UserService) {
                var isLogged = UserService.session();
                if( isLogged == false ) {
                    $location.path("/login");
                    $location.replace();                    
                    $q.reject("Authentication Failed!");
                }
            }]
        }
    });
    $routeProvider.otherwise({
        "redirectTo": "/"
    });
});