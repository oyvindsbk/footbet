using System.Collections.Generic;
using System.Linq;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class UserScoreRepository : IUserScoreRepository
    {
        private readonly IGenericRepository<UserScore> _genericRepository;

        public UserScoreRepository(IGenericRepository<UserScore> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        public void AddUserScore(UserScore userScore)
        {
            _genericRepository.Add(userScore);
            _genericRepository.Save();
        }

        public void SaveOrUpdateUserScores(List<UserScore> userScores)
        {
            foreach (var userScore in userScores)
            {
                var original = _genericRepository.FindBy(x => x.UserId == userScore.UserId && x.SportsEventId == userScore.SportsEventId);
                if (original.Count() == 1)
                {
                    _genericRepository.Edit(original.First(), userScore);
                }
                else
                {
                    _genericRepository.Add(userScore);
                }
                _genericRepository.Save();
            }
        }

        public List<UserScore> GetAllUserScoresBySportsEventId(int sportsEventId)
        {
            var userScores = _genericRepository.FindBy(x => x.SportsEventId == sportsEventId);
            return userScores.ToList();
        }
    }
}