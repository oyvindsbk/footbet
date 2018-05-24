var wtf = require('wtf_wikipedia');
var fs = require('fs');

wtf.fetch('2018_FIFA_World_Cup_squads').then(doc => {

  var teamsWithPlayers =  [];
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group A'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group B'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group C'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group D'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group E'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group F'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group G'))
  teamsWithPlayers.push(getPlayersFromGroup(doc, 'Group H'));
  
  var json = JSON.stringify(Array.prototype.concat.apply([], teamsWithPlayers));
  fs.writeFile('players.json', json, 'utf8', function(err) {console.log(err)});

});

var getPlayersFromGroup = function(doc, groupName) {
	var teamList = [];
	var teams = doc.sections(groupName).children();
	teams.forEach(function(team) { 
		var templates = team.data.templates;
		var teamPlayerList = [];
		templates.forEach(function(t){
			if(t.template === 'nat fs g player')
			{
				teamPlayerList.push({ name: t.data.name })
			}
		});
		teamList.push({team: team.data.title, players: teamPlayerList })

	});
	return teamList;
}