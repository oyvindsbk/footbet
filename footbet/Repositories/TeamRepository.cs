using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class TeamRepository :ITeamRepository
    {
        private readonly JavaScriptSerializer _javaScriptSerializer;

        public TeamRepository(JavaScriptSerializer javaScriptSerializer)
        {
            _javaScriptSerializer = javaScriptSerializer;
        }

        public Team GetTeamById(int teamId)
        {
            var teams = GetTeamsFromResource();
            var team = teams.Where(x => x.Id == teamId).ToList();
            return team.Count == 0 ? new Team() : team.First();
        }

        public Team GetTeamById(int? teamId)
        {
            var teams = GetTeamsFromResource();
            var team = teams.Where(x => x.Id == teamId).ToList();
            return team.Count == 0 ? new Team() : team.First();
        }

        public List<Team> GetTeamsBySportsEventId(int sportsEventId)
        {
            var teams = GetTeamsFromResource();
            return teams.Where(x => x.SportsEventId == sportsEventId).ToList();
        }

        private IEnumerable<Team> GetTeamsFromResource()
        {
            var teamJson = Resources.brasil_teams;
            return _javaScriptSerializer.Deserialize<List<Team>>(teamJson);
        }
    }
}