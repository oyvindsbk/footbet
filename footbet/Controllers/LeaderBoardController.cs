using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Footbet.Caching;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Controllers
{
    [Authorize]
    public class LeaderBoardController : Common
    {
        private readonly IUserScoreRepository _userScoreRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILeagueUserRepository _leagueUserRepository;
        private readonly ICacheService _cacheService;

        public LeaderBoardController(IUserScoreRepository userScoreRepository, 
            IUserRepository userRepository,
            ILeagueUserRepository leagueUserRepository,
            ICacheService cacheService)
        {
            _userScoreRepository = userScoreRepository;
            _userRepository = userRepository;
            _leagueUserRepository = leagueUserRepository;
            _cacheService = cacheService;
        }

        public ActionResult Index()
        {
            return View("Index");
        }


        public ActionResult GetLeaderboardByLeagueId(int leagueId, int sportsEventId = 1)
        {
            var leaderboard = _cacheService.GetOrSet($"league.{leagueId}", () => GetLeaderboard(leagueId, sportsEventId));

            return ToJsonResult(leaderboard);
        }

        private List<LeaderboardUserViewModel> GetLeaderboard(int leagueId, int sportsEventId)
        {
            var userScores = _userScoreRepository.GetAllUserScoresBySportsEventId(sportsEventId);
            var leagueUsers = _leagueUserRepository.GetLeagueUsersByLeagueId(leagueId);
            var leaderboard = userScores.Any()
                ? CreateLeaderboardWithUserScores(leagueUsers, userScores)
                : CreateLeaderBoardWithoutUserScores(leagueUsers);
            return leaderboard;
        }

        private List<LeaderboardUserViewModel> CreateLeaderBoardWithoutUserScores(List<LeagueUser> leagueUsers)
        {
            var leaderboard = new List<LeaderboardUserViewModel>();

            foreach (var leagueUser in leagueUsers)
            {
                var user = _userRepository.GetUserByUserId(leagueUser.UserId);

                if (user == null)
                    continue;

                var leaderboardUserViewModel = CreateLeaderBoardUserViewModel(user, new UserScore(), 0);
                leaderboard.Add(leaderboardUserViewModel);
            }

            var leaderBoardSorted = leaderboard.OrderBy(x => x.Points).ThenBy(x => x.Name).ToList();

            for (var i = 0; i < leaderBoardSorted.Count; i++)
            {
                leaderBoardSorted[i].Position = i + 1;
            }

            return leaderBoardSorted;
        }

        private List<LeaderboardUserViewModel> CreateLeaderboardWithUserScores(List<LeagueUser> leagueUsers, List<UserScore> userScores)
        {
            var leaderboard = new List<LeaderboardUserViewModel>();

            foreach (var leagueUser in leagueUsers)
            {
                var score = userScores.SingleOrDefault(x => x.UserId == leagueUser.UserId);

                if (score == null)
                    continue;

                var user = _userRepository.GetUserByUserId(leagueUser.UserId);

                if (user == null)
                    continue;
                var usersPositionInLeague = GetPositionOfUserInLeague(user.Id, leagueUsers, userScores);
                var leaderboardUserViewModel = CreateLeaderBoardUserViewModel(user, score, usersPositionInLeague);
                leaderboard.Add(leaderboardUserViewModel);
            }

            return leaderboard;
        }

        //DUPLICATED IN LEAGUE CONTROLLER
        private static int GetPositionOfUserInLeague(string userId, List<LeagueUser> leagueUsers, List<UserScore> userScores)
        {
            var userScoresLeagueList = CreateUserScoresLeagueList(leagueUsers, userScores);
            var currentUserScore = userScoresLeagueList.FirstOrDefault(x => x.UserId == userId);
            if (currentUserScore == null) return userScoresLeagueList.Count;
            return 1 + userScoresLeagueList.Count(userScore => userScore.UserId != userId && userScore.Points > currentUserScore.Points);
        }
        //DUPLICATED IN LEAGUE CONTROLLER
        private static List<UserScore> CreateUserScoresLeagueList(List<LeagueUser> leagueUsers, List<UserScore> userScores)
        {
            var userScoresLeague = new List<UserScore>();

            foreach (var leagueUser in leagueUsers)
            {
                var userScore = userScores.SingleOrDefault(x => x.UserId == leagueUser.UserId);
                if (userScore != null)
                    userScoresLeague.Add(userScore);
            }

            //userScoresLeague.Sort((s1, s2) => s1.Score.CompareTo(s2.Score));
            return userScoresLeague;
        }

        private static LeaderboardUserViewModel CreateLeaderBoardUserViewModel(ApplicationUser user, UserScore score, int position)
        {
            var leaderboardUserViewModel = new LeaderboardUserViewModel
            {
                UserName = user.UserName,
                GroupScore = score.Score,
                PlayoffScore = score.PlayoffScore ?? 0,
                TopScorerScore = score.TopScorerScore ?? 0,
                BonusScore = score.BonusScore ?? 0,
                Name = user.Name,
                Position = position
            };
            return leaderboardUserViewModel;
        }
    }
}