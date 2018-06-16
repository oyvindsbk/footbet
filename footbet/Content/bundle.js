var Services;!function(e){var a=function(){function e(e,a,o,t,s){this.$resource=e,this.$rootScope=a,this.orderByFilter=o,this.toaster=t,this.$location=s,this.isRequired=!0,this.predicate=["-points","-sumGoals","-goalsScored"],this.playoffTypes={2:"8-delsfinaler",3:"Kvartfinaler",4:"Semifinaler",5:"Bronsefinale",6:"Finale"},this.modelChanged=!1,this.isLoading=!1}return e.prototype.loadModel=function(e){var a=this;this.$resource("../Bet/GetBasisForBet/"+e).get(function(e){null!=e.ExceptionMessage?(a.$rootScope.$broadcast("modelLoaded",!0),a.toaster.pop("warning","Feil",e.ExceptionMessage)):(a.groups=e.groups,a.players=e.players,a.selectedTopScorer=e.selectedTopScorer,a.initializeGroupsForBet(),a.initializePlayoffGamesForBet(e.playoffGames),a.$rootScope.$broadcast("modelLoaded",!0))})},e.prototype.scoreChanged=function(e,a){isNaN(a.homeGoals)||isNaN(a.awayGoals)||(this.updateTeamsInGroup(e),this.setWinnerAndRunnerUpInGroup(e),this.setPlayoffGameTeams(e,!0),this.modelChanged=!0)},e.prototype.setPlayoffGameTeams=function(a,o){var t=this,s=!0;angular.forEach(a.games,function(e){null!=e.homeGoals&&null!=e.awayGoals||(s=!1)}),s&&angular.forEach(this.playoffGames,function(e){e.id===a.winnerGameId&&(e.homeTeam=a.winner),e.id===a.runnerUpGameId&&(e.awayTeam=a.runnerUp),o&&t.playoffGameScoreChanged(e)})},e.prototype.playoffAwayTeamSelected=function(e){e.homeGoals=0,e.awayGoals=1,this.playoffGameScoreChanged(e)},e.prototype.playoffHomeTeamSelected=function(e){e.homeGoals=1,e.awayGoals=0,this.playoffGameScoreChanged(e)},e.prototype.displayPlayoffHeader=function(e){var a=this.playoffTypes[e];return this.displayedPlayoffTypes.includes(e)?null:(this.displayedPlayoffTypes.push(e),a)},e.prototype.updateTeamsInGroup=function(e){var t=this;angular.forEach(e.teams,function(o){o=t.clearTeamValues(o),angular.forEach(e.games,function(e){var a;null!=e.homeGoals&&null!=e.awayGoals&&(e.homeTeam.id===o.id&&(o.goalsScored+=e.homeGoals,o.goalsConceded+=e.awayGoals,a=t.setPointsForGame(e.homeGoals,e.awayGoals),o.points+=t.setPointsForGame(e.homeGoals,e.awayGoals),3===a&&o.gamesWonAgainstTeams.push(e.awayTeam)),e.awayTeam.id===o.id&&(o.goalsScored+=e.awayGoals,o.goalsConceded+=e.homeGoals,a=t.setPointsForGame(e.awayGoals,e.homeGoals),o.points+=a,3===a&&o.gamesWonAgainstTeams.push(e.homeTeam)))}),o.sumGoals=o.goalsScored-o.goalsConceded})},e.prototype.clearTeamValues=function(e){return e.goalsScored=0,e.goalsConceded=0,e.points=0,e.sumGoals=0,e.gamesWonAgainstTeams=[],e},e.prototype.setPointsForGame=function(e,a){return a<e?3:e<a?0:e===a?1:0},e.prototype.initializeGroupsForBet=function(){var a=this;angular.forEach(this.groups,function(e){angular.forEach(e.teams,function(e){e.goalsConceded=0,e.goalsScored=0,e.points=0,e.sumGoals=0}),a.updateTeamsInGroup(e),angular.forEach(e.games,function(a){angular.forEach(a.teamGames,function(e){e.isHomeTeam?a.homeTeam=e.team:a.awayTeam=e.team})})})},e.prototype.initializePlayoffGamesForBet=function(e){angular.forEach(e,function(e){e.playoffGameDetails=e.playoffGameDetails[0]}),this.playoffGames=e},e.prototype.setWinnerAndRunnerUpInGroup=function(e){return e.teams=this.orderTeamsBestFirst(e.teams),e.winner=e.teams[0],e.runnerUp=e.teams[1],e},e.prototype.orderTeamsBestFirst=function(e){var a=this.orderByFilter(e,this.predicate,!1);return this.teamsAreEqualByPredicate(a,0,1)&&(this.swapTeamsByGamesWonAgainstEachother(a,0,1),this.teamsAreEqualByPredicate(a,1,2)&&(this.swapTeamsByGamesWonAgainstEachother(a,1,2),this.teamsAreEqualByPredicate(a,2,3)&&this.swapTeamsByGamesWonAgainstEachother(a,2,3))),a},e.prototype.playoffGameScoreChanged=function(e){var a,o,t;if(null!=e.playoffGameDetails.nextPlayoffGame){if(null==(o=this.getWinnerOfGame(e)))return;a=e.playoffGameDetails.isHomeTeamNextGame,t=e.playoffGameDetails.nextPlayoffGame,this.setNextPlayoffGame(t,o,a)}if(null!=e.playoffGameDetails.nextPlayoffGameRunnerUp){if(null==(o=this.getRunnerUpOfGame(e)))return;a=e.playoffGameDetails.isHomeTeamInRunnerUpGame,t=e.playoffGameDetails.nextPlayoffGameRunnerUp,this.setNextPlayoffGame(t,o,a)}this.modelChanged=!0},e.prototype.setNextPlayoffGame=function(a,o,t){var s=this;angular.forEach(this.playoffGames,function(e){e.id===a&&(t?e.homeTeam=o:e.awayTeam=o,s.playoffGameScoreChanged(e))})},e.prototype.getWinnerOfGame=function(e){return e.homeGoals>e.awayGoals?e.homeTeam:e.awayGoals>e.homeGoals?e.awayTeam:null},e.prototype.getRunnerUpOfGame=function(e){return e.homeGoals<e.awayGoals?e.homeTeam:e.awayTeam},e.prototype.setTeamScore=function(e,a,o){e.goalsScored+=o.homeGoals,e.goalsConceded+=o.awayGoals;var t=this.setPointsForGame(o.homeGoals,o.awayGoals);e.points+=this.setPointsForGame(o.homeGoals,o.awayGoals),3===t&&e.gamesWonAgainstTeams.push(o.awayTeam)},e.prototype.validateIfUserBetIsComplete=function(){var a=this,o=0;return angular.forEach(this.groups,function(e){angular.forEach(e.games,function(e){a.isGameIncomplete(e)&&o++})}),angular.forEach(this.playoffGames,function(e){a.isGameIncomplete(e)&&o++}),this.selectedTopScorer||o++,o},e.prototype.isGameIncomplete=function(e){return 0!==e.homeGoals&&!e.homeGoals||0!==e.awayGoals&&!e.awayGoals},e.prototype.teamsAreEqualByPredicate=function(e,a,o){return e[a].points===e[o].points&&e[a].sumGoals===e[o].sumGoals&&e[a].goalsScored===e[o].goalsScored},e.prototype.swapTeamsByGamesWonAgainstEachother=function(e,a,o){if(this.isInArray(e[a].id,e[o].gamesWonAgainstTeams)){var t=e[a];e[a]=e[o],e[o]=t}},e.prototype.isInArray=function(e,a){return-1<a.indexOf(e)},e.$inject=["$resource","$rootScope","orderByFilter","toaster","$location"],e}();e.BetBaseController=a}(Services||(Services={}));
var Services;!function(e){"use strict";var t=function(){function e(e){this.$http=e}return e.prototype.getLeaderboard=function(){return this.$http({method:"POST",url:"../Leaderboard/GetOverallLeaderboardBySportsEventId"}).then(function(e){return e.data})},e.prototype.getLeaderboardForLeague=function(e){return this.$http({method:"POST",url:"../Leaderboard/GetLeaderboardByLeagueId",data:{leagueId:e}}).then(function(e){return e.data})},e.$inject=["$http"],e}();e.LeaderboardService=t}(Services||(Services={}));
var Services;!function(e){"use strict";var t=function(){function e(e){this.$http=e}return e.prototype.getLeagues=function(){return this.$http({method:"GET",url:"GetLeaguesForUser"}).then(function(e){return e.data})},e.prototype.joinLeague=function(e){return this.$http({method:"POST",url:"AddCurrentUserToLeagueByGuid",data:{guid:e}}).then(function(e){var t=e.data,r={};return t.ExceptionMessage&&(r.message=t.ExceptionMessage,r.isError=!0),r})},e.prototype.addCurrentUserToLeague=function(e){return this.$http({method:"POST",url:"AddCurrentUserToLeague",data:{leagueName:e}}).then(function(e){var t=e.data,r={};return t.ExceptionMessage?(r.message=t.ExceptionMessage,r.isError=!0):(r.message="KODE FOR Å BLI MED I LIGA: "+t,r.isError=!1),r})},e.prototype.addNewLeague=function(e){return this.$http({method:"POST",url:"AddNewLeague",data:{leagueName:e}}).then(function(e){var t=e.data,r={};return t.ExceptionMessage?(r.message=t.ExceptionMessage,r.isError=!0):(r.message="KODE FOR Å BLI MED I LIGA: "+t,r.isError=!1),r})},e.$inject=["$http"],e}();e.LeagueService=t}(Services||(Services={}));
var Services;!function(t){"use strict";var e=function(){function t(t){this.$http=t}return t.prototype.loadResult=function(){return this.$http({url:"../ResultPage/GetResults",method:"POST"}).then(function(t){return t.data}).catch(function(t){return t.status})},t.prototype.getLeaderboardForLeague=function(t){return this.$http({method:"POST",url:"../Leaderboard/GetLeaderboardByLeagueId",data:{leagueId:t}}).then(function(t){return t.data})},t.$inject=["$http"],t}();t.ResultPageService=e}(Services||(Services={}));
var Services;!function(t){"use strict";var e=function(){function t(t){this.$http=t}return t.prototype.saveBet=function(t,e,a){var r=this.extractGroupResultFromGroups(t),o=this.extractPlayoffGamesResultFromPlayoffGames(e),u=angular.toJson(a);return this.$http({method:"POST",url:"../Bet/SavePersonBet",data:{groupGamesResult:r,playoffGamesResult:o,selectedTopScorer:u}}).then(function(t){return t.data})},t.prototype.saveBetResult=function(t,e,a){var r=this.extractGroupResultFromGroups(t),o=this.extractPlayoffGamesResultFromPlayoffGames(e);return this.$http({method:"POST",url:"../Result/SaveResultBets",data:{groupGamesResult:r,playoffGamesResult:o}}).then(function(t){return t.data})},t.prototype.extractGroupResultFromGroups=function(t){var e=[];return angular.forEach(t,function(t){angular.forEach(t.games,function(t){null==t.homeGoals&&null==t.awayGoals||e.push(t)})}),angular.toJson(e)},t.prototype.extractPlayoffGamesResultFromPlayoffGames=function(t){var e=[];return angular.forEach(t,function(t){null!=t.homeTeam&&null!=t.awayTeam&&e.push(t)}),angular.toJson(e)},t.$inject=["$http"],t}();t.BetService=e}(Services||(Services={}));
var Services;!function(t){"use strict";var e=function(){function t(t){this.$http=t}return t.prototype.getUsers=function(){return this.$http({method:"GET",url:"../User/GetUsers"}).then(function(t){return t.data})},t.$inject=["$http"],t}();t.UserBetService=e}(Services||(Services={}));
var Services;!function(t){"use strict";var e=function(){function t(t){this.$http=t}return t.prototype.getPreviousGames=function(t){return this.$http({method:"POST",url:"../TodaysGames/GetPreviousGames",data:{daysFromToday:t}}).then(function(t){return null==t.ExceptionMessage&&t.data})},t.prototype.getNextGames=function(t){return this.$http({method:"POST",url:"../TodaysGames/GetNextGames",data:{daysFromToday:t}}).then(function(t){return null!=t.data.ExceptionMessage?null:t.data})},t.$inject=["$http"],t}();t.TodaysGamesService=e}(Services||(Services={}));
var MainApp;!function(e){"use strict";angular.module("footballCompApp",["ngResource","toaster","ngAnimate","ui.bootstrap"]).service("betBaseController",Services.BetBaseController).service("betService",Services.BetService).service("userBetService",Services.UserBetService).service("resultPageService",Services.ResultPageService).service("leaderboardService",Services.LeaderboardService).service("todaysGamesService",Services.TodaysGamesService).service("leagueService",Services.LeagueService)}(MainApp||(MainApp={}));
var Controllers;!function(e){"use strict";var t=function(){function e(e,t,o,r,s){var l=this;this.$scope=e,this.$window=t,this.toaster=o,this.betBaseController=r,this.betService=s,this.numberOfIncompleteGames=0,this.currentGameType=2,this.betBaseController.loadModel(""),this.$scope.$on("modelLoaded",function(){l.initializeGroupsAndPlayoffGames(),l.setLabelForUserBetComplete()})}return e.prototype.initializeGroupsAndPlayoffGames=function(){var t=this;angular.forEach(this.betBaseController.groups,function(e){t.betBaseController.setWinnerAndRunnerUpInGroup(e),t.betBaseController.setPlayoffGameTeams(e,!0)})},e.prototype.setLabelForUserBetComplete=function(){this.numberOfIncompleteGames=this.betBaseController.validateIfUserBetIsComplete(),0<this.numberOfIncompleteGames&&this.numberOfIncompleteGames<65?this.userBetIncompleteMessage="(Ditt spill er ikke komplett!)":this.userBetIncompleteMessage=""},e.prototype.add=function(){this.currentGameType++},e.prototype.save=function(){var t=this;this.betBaseController.modelChanged=!1,this.betBaseController.isLoading=!0,this.numberOfIncompleteGames=this.betBaseController.validateIfUserBetIsComplete(),65!==this.numberOfIncompleteGames?this.betService.saveBet(this.betBaseController.groups,this.betBaseController.playoffGames,this.betBaseController.selectedTopScorer).then(function(e){t.betBaseController.isLoading=!1,t.setLabelForUserBetComplete(),null!=e.ExceptionMessage?(t.betBaseController.modelChanged=!0,t.toaster.pop("error","Feil",e.ExceptionMessage)):0===t.numberOfIncompleteGames?t.toaster.pop("success","Lagret","Ditt spill er lagret!"):t.toaster.pop("warning","Lagret","Ditt spill er lagret, men du mangler noen resultater. Husk å fyll inn disse før VM starter!")}):this.toaster.pop("error","Feil","Fyll inn resultater")},e.$inject=["$scope","$window","toaster","betBaseController","betService"],e}();e.BetController=t}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("BetController",Controllers.BetController);
var Controllers;!function(e){"use strict";var r=function(){function e(e,r,o){var t=this;this.$scope=e,this.$rootScope=r,this.leaderboardService=o,this.headerText="",this.numberOfIncompleteGames=0,this.$rootScope.$on("showLeagueEvent",function(e,r){t.getLeaderboardForLeague(r.id),t.headerText="Stilling for "+r.name})}return e.prototype.getLeaderboard=function(){var r=this;this.leaderboardService.getLeaderboard().then(function(e){r.leaderboard=e})},e.prototype.getLeaderboardForLeague=function(e){var r=this;this.leaderboardService.getLeaderboardForLeague(e).then(function(e){r.leaderboard=e})},e.$inject=["$scope","$rootScope","leaderboardService"],e}();e.LeaderboardController=r}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("LeaderboardController",Controllers.LeaderboardController);
var Controllers;!function(e){"use strict";var s=function(){function e(e,s,o){this.$scope=e,this.$rootScope=s,this.leagueService=o,this.loadLeagues()}return e.prototype.loadLeagues=function(){var s=this;this.leagueService.getLeagues().then(function(e){s.leagues=e,s.showLeague(e[0])})},e.prototype.joinLeague=function(){var s=this;this.leagueService.joinLeague(this.leagueCode).then(function(e){e.isError?(s.message=e.message,s.messageClass="error"):s.loadLeagues()})},e.prototype.addCurrentUserToLeague=function(){var s=this;this.leagueService.addCurrentUserToLeague(this.leagueName).then(function(e){s.message=e.message,e.isError?s.messageClass="error":(s.messageClass="success",s.loadLeagues())})},e.prototype.addNewLeague=function(){var s=this;if(""===this.leagueName)return this.message="Liganavn kan ikke være tomt",void(this.messageClass="error");this.leagueService.addNewLeague(this.leagueName).then(function(e){e.isError?s.messageClass="error":(s.messageClass="success",s.message=e.message,s.loadLeagues())})},e.prototype.showLeague=function(e){this.$rootScope.$broadcast("showLeagueEvent",e)},e.$inject=["$scope","$rootScope","leagueService"],e}();e.LeagueController=s}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("LeagueController",Controllers.LeagueController);
var Controllers;!function(e){"use strict";var t=function(){function e(e,t,o){var r=this;this.$scope=e,this.betBaseController=t,this.betService=o,this.betBaseController.isRequired=!1,this.betBaseController.loadModel(""),e.$on("modelLoaded",function(){r.userBetControllerInit()})}return e.prototype.saveResultBets=function(){var t=this;this.betService.saveBetResult(this.betBaseController.groups,this.betBaseController.playoffGames,this.betBaseController.selectedTopScorer).then(function(e){t.message=e})},e.prototype.initializeGroupsAndPlayoffGames=function(){var t=this;angular.forEach(this.betBaseController.groups,function(e){t.betBaseController.setWinnerAndRunnerUpInGroup(e)})},e.prototype.userBetControllerInit=function(){this.initializeGroupsAndPlayoffGames()},e.$inject=["$scope","betBaseController","betService"],e}();e.ResultController=t}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("ResultController",Controllers.ResultController);
var Controllers;!function(t){"use strict";var e=function(){function t(t,e){this.$scope=t,this.todaysGamesService=e,this.todaysDate=new Date,this.daysFromNow=0,this.loadTodaysGames()}return t.prototype.nextDay=function(){this.nextButtonDisabled||(this.daysFromNow++,this.getNextGames())},t.prototype.previousDay=function(){this.previousButtonDisabled||(this.daysFromNow--,this.getPreviousGames())},t.prototype.loadTodaysGames=function(){var e=this;this.nextButtonDisabled=!0,this.previousButtonDisabled=!0,this.todaysGamesService.getNextGames(this.daysFromNow).then(function(t){e.previousButtonDisabled=t.isFirstDay,e.nextButtonDisabled=e.isNextButtonDisabled(),e.todaysGames=t.todaysGamesSpecification,e.todaysGames[0].isExpanded=!0,e.daysFromNow+=t.numberOfDaysFromToday,e.loaded=!0,e.todaysDate=e.getTodaysDatePlusDays(e.daysFromNow)})},t.prototype.getNextGames=function(){var e=this;this.nextButtonDisabled=!0,this.todaysGamesService.getNextGames(this.daysFromNow).then(function(t){e.previousButtonDisabled=!1,e.todaysGames=t.todaysGamesSpecification,e.todaysGames[0].isExpanded=!0,e.daysFromNow+=t.numberOfDaysFromToday,e.todaysDate=e.getTodaysDatePlusDays(e.daysFromNow),e.nextButtonDisabled=e.isNextButtonDisabled()})},t.prototype.getPreviousGames=function(){var e=this;this.previousButtonDisabled=!0,this.todaysGamesService.getPreviousGames(this.daysFromNow).then(function(t){e.previousButtonDisabled=t.isFirstDay,e.nextButtonDisabled=!1,e.todaysGames=t.todaysGamesSpecification,e.todaysGames[0].isExpanded=!0,e.daysFromNow+=t.numberOfDaysFromToday,e.todaysDate=e.getTodaysDatePlusDays(e.daysFromNow)})},t.prototype.isNextButtonDisabled=function(){var t=new Date(2018,6,15);return this.todaysDate.getTime()>=t.getTime()},t.prototype.isPreviousButtonDisabled=function(){var t=new Date(2018,5,14);return this.todaysDate<t},t.prototype.getTodaysDatePlusDays=function(t){return(new Date).addDays(t)},t.$inject=["$scope","todaysGamesService"],t}();t.TodaysGamesController=e}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("TodaysGamesController",Controllers.TodaysGamesController),Date.prototype.addDays=function(t){var e=new Date(this.valueOf());return e.setDate(e.getDate()+t),e};
var Controllers;!function(e){"use strict";var t=function(){function e(e,t,o,r,s){var n=this;this.$scope=e,this.$location=t,this.betBaseController=o,this.toaster=r,this.userBetService=s,this.showSearch=!0,this.eventHasStarted=!1,o.isRequired=!1,this.loadByLocation(),e.$on("modelLoaded",function(){n.userBetControllerInit()})}return e.prototype.loadByLocation=function(){var t=this,e=this.$location.absUrl().split("username=")[1];e?(this.showSearch=!1,this.selectedUserName=e,this.betBaseController.loadModel(e),this.showUserBet=!0):this.userBetService.getUsers().then(function(e){t.users=e})},e.prototype.searchUserBet=function(t){var o=this;this.showUserBet=!1,angular.forEach(this.users,function(e){e.userName===t&&(o.betBaseController.loadModel(e.userName),o.showUserBet=!0)}),this.showUserBet||this.toaster.pop("error","Feil","Fant ikke bruker, vennligst søk med fullstendig brukernavn")},e.prototype.initializeGroupsAndPlayoffGames=function(){var t=this;angular.forEach(this.betBaseController.groups,function(e){t.betBaseController.setWinnerAndRunnerUpInGroup(e),t.betBaseController.setPlayoffGameTeams(e,!0)})},e.prototype.userBetControllerInit=function(){this.initializeGroupsAndPlayoffGames()},e.$inject=["$scope","$location","betBaseController","toaster","userBetService"],e}();e.UserBetController=t}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("UserBetController",Controllers.UserBetController);
var Controllers;!function(e){"use strict";var o=function(){function e(e,o,t,r){var l=this;this.$scope=e,this.$rootScope=o,this.betBaseController=t,this.resultPageService=r,e.$on("modelLoaded",function(){l.resultPageControllerInit()}),this.loadResult()}return e.prototype.loadResult=function(){var o=this;this.resultPageService.loadResult().then(function(e){o.betBaseController.groups=e.groups,o.betBaseController.initializeGroupsForBet(),o.betBaseController.initializePlayoffGamesForBet(e.playoffGames),o.$rootScope.$broadcast("modelLoaded",!0)})},e.prototype.initializeGroupsAndPlayoffGames=function(){var o=this;angular.forEach(this.betBaseController.groups,function(e){o.betBaseController.setWinnerAndRunnerUpInGroup(e),o.betBaseController.setPlayoffGameTeams(e,!0)})},e.prototype.resultPageControllerInit=function(){this.initializeGroupsAndPlayoffGames()},e.$inject=["$scope","$rootScope","betBaseController","resultPageService"],e}();e.ResultPageController=o}(Controllers||(Controllers={})),angular.module("footballCompApp").controller("ResultPageController",Controllers.ResultPageController);
