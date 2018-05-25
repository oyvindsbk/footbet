using System.Collections.Generic;
using System.Linq;
using Footbet.Data;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class UserBetRepository : IUserBetRepository
    {
        private readonly IBetRepository _betRepository;
        private readonly IPlayoffBetRepository _playoffBetRepository;
        private readonly IGenericRepository<UserBet> _repository; 
        public UserBetRepository(IBetRepository betRepository, IPlayoffBetRepository playoffBetRepository, IGenericRepository<UserBet> repository)
        {
            _betRepository = betRepository;
            _playoffBetRepository = playoffBetRepository;
            _repository = repository;
        }

        public int SaveOrUpdateUserBet(UserBet userBet)
        {
            var userBetId = 0;
            var original = _repository.FindBy(x => x.UserId == userBet.UserId && x.SportsEventId == userBet.SportsEventId).ToList();

            if (original.Any())
            {
                var originalUserBet = original.First();
                userBetId = originalUserBet.Id;
                originalUserBet.CreatedAt = userBet.CreatedAt;
                originalUserBet.TopScorerTeam = userBet.TopScorerTeam;
                originalUserBet.TopScorerName = userBet.TopScorerName;
                _playoffBetRepository.SaveOrUpdatePlayoffBets(userBet.PlayoffBets.ToList(), userBetId);
                _betRepository.SaveOrUpdateBets(userBet.Bets.ToList(), userBetId);
            }
            else
            {
                _repository.Add(userBet);
            }
            _repository.Save();

            return userBetId != 0 ? userBetId : userBet.Id;
        }

        public UserBet GetUserBetByUserId(string userId)
        {
            IList<UserBet> userBets = _repository.FindBy(x => x.UserId == userId).ToList();
            return userBets.Count == 0 ? new UserBet() : userBets.First();
        }

        public UserBet GetUserBetById(int userBetId)
        {
            return _repository.FindBy(x => x.Id == userBetId).FirstOrDefault();
        }

        public List<UserBet> GetAllUserBetsBySportsEventIdWithoutResultBet(int sportsEventId)
        {
            return _repository.FindBy(x => x.SportsEventId == sportsEventId && !x.IsResultBet).ToList();
        }
    }
}