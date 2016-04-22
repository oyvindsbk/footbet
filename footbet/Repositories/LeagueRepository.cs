using System.Collections.Generic;
using System.Linq;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class LeagueRepository : ILeagueRepository
    {
        private readonly IGenericRepository<League> _leagueRepository;
        
        public LeagueRepository(IGenericRepository<League> leagueRepository)
        {
            _leagueRepository = leagueRepository;
        }

        public League AddNewLeague(League league)
        {
            _leagueRepository.Add(league);
            _leagueRepository.Save();
            return league;
        }

        public bool DoesLeagueExist(string leagueName)
        {
            var leagues = _leagueRepository.FindBy(x => x.Name == leagueName);
            return leagues.Any();
        }

        public List<League> GetLeaguesForUser(string userId, int sportsEventId, List<LeagueUser> leagueUsers)
        {
            var leagues = _leagueRepository.FindBy(x => x.SportsEventId == sportsEventId);

            return leagueUsers.Select(leagueUser => leagues.First(x => x.Id == leagueUser.LeagueId)).ToList();
        }

        public League GetLeagueByGuid(string guid)
        {
            return _leagueRepository.FindBy(x => x.Guid == guid).FirstOrDefault();
        }
    }
}