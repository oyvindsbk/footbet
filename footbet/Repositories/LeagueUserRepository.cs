using System.Collections.Generic;
using System.Linq;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class LeagueUserRepository : ILeagueUserRepository
    {
        private readonly IGenericRepository<LeagueUser> _repository;

        public LeagueUserRepository(IGenericRepository<LeagueUser> repository)
        {
            _repository = repository;
        }

        public List<LeagueUser> GetLeagueUsersByUserId(string userId)
        {
            return _repository.FindBy(x => x.UserId == userId).ToList();
        }

        public List<LeagueUser> GetLeagueUsersByLeagueId(int leagueId)
        {
            return _repository.FindBy(x => x.LeagueId == leagueId).ToList();
        }

        public void AddUserToLeague(LeagueUser leagueUser)
        {
            _repository.Add(leagueUser);
            _repository.Save();
        }

        public bool UserIsAlreadyInLeague(LeagueUser leagueUser)
        {
            return _repository.FindBy(x => x.LeagueId == leagueUser.LeagueId && x.UserId == leagueUser.UserId).Any();
        }
    }
}