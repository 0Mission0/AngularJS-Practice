var app = angular.module("fifaApp", ["ngRoute"]);

app.controller("MainCtrl", [function() {
    this.test = function() {
        console.log("Test");
    }
}]);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        "template": "<h1>Index page</h1>"
    });
    $routeProvider.when("/login", {
        "templateUrl": "views/login.html",        
    });
    $routeProvider.when("/team/:code", {
        "template": "<h1>Login page</h1>",
        "controller": ["$log", "$routeParams", function($log, $routeParams) {
            console.log($routeParams.code);
        }]
    });
    $routeProvider.otherwise({
        "redirectTo": "/"
    });
});

/*angular.module('fifaApp', ['ngRoute'])
  .config(function($routeProvider) {

    $routeProvider.when('/', {
      templateUrl: 'views/team_list.html',
      controller: 'TeamListCtrl as teamListCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html'
    })
    .when('/team/:code', {
      templateUrl: 'views/team_details.html',
      controller:'TeamDetailsCtrl as teamDetailsCtrl',
      resolve: {
        auth: ['$q', '$location', 'UserService',
          function($q, $location, UserService) {
             return UserService.session().then(
               function(success) {},
               function(err) {
                  $location.path('/login');
                  $location.replace();
                  return $q.reject(err);
             });
        }]
      }
    });
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  });
*/