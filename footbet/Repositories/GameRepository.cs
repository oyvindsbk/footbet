using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using Footbet.Models.DomainModels;
using Footbet.Models.Enums;
using Footbet.Repositories.Contracts;

namespace Footbet.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly IGenericRepository<Game> _repository;
        private readonly JavaScriptSerializer _javaScriptSerializer;

        public GameRepository(IGenericRepository<Game> repository, JavaScriptSerializer javaScriptSerializer)
        {
            _repository = repository;
            _javaScriptSerializer = javaScriptSerializer;
        }

        public void UpdateHomeAndAwayTeamOnGame(int homeTeamId, int awayTeamId, int gameId)
        {
            var oldEntity = _repository.FindBy(x => x.Id == gameId).ToList().First();
            oldEntity.HomeTeam = homeTeamId;
            oldEntity.AwayTeam = awayTeamId;
            _repository.Save();
        }

        public IList<Game> GetGroupGamesBySportsEventId(int sportsEventId)
        {
            return _repository.FindBy(x => x.SportsEventId == sportsEventId && x.GameType == (int)GameType.GroupGame).ToList();
        }

        public IList<Game> GetAllGamesBySportsEventId(int sportsEventId)
        {
            return _repository.FindBy(x => x.SportsEventId == sportsEventId).ToList();
        }

        public IList<Game> GetGamesForDay(DateTime day, int sportsEventId)
        {
            var games = GetGamesFromResource();

            var fromDate = new DateTime(day.Year, day.Month, day.Day, 6, 0, 0);
            var toDate = new DateTime(day.Year, day.Month, day.Day, 5, 59, 59).AddDays(1);

            return games.Where(x => x.SportsEventId == sportsEventId && x.StartTime > fromDate && x.StartTime < toDate).ToList();
        }

        public IList<Game> GetPlayOffGamesBySportsEventId(int sportsEventId)
        {
            var games = GetGamesFromResource();
            return games.Where(x => x.SportsEventId == sportsEventId && x.GameType != (int)GameType.GroupGame).ToList();
        }

        private IEnumerable<Game> GetGamesFromResource()
        {
            var gameJson = Resources.games;
            return _javaScriptSerializer.Deserialize<List<Game>>(gameJson);
        }
    }
}