using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
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

        public LeaderBoardController(IUserScoreRepository userScoreRepository, IUserRepository userRepository, ILeagueUserRepository leagueUserRepository)
        {
            _userScoreRepository = userScoreRepository;
            _userRepository = userRepository;
            _leagueUserRepository = leagueUserRepository;
        }

        public ActionResult Index()
        {
            return View("Index");
        }


        public ActionResult GetLeaderboardByLeagueId(int leagueId, int sportsEventId = 1)
        {
            var userScores = _userScoreRepository.GetAllUserScoresBySportsEventId(sportsEventId);
            var leagueUsers = _leagueUserRepository.GetLeagueUsersByLeagueId(leagueId);
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

            return ToJsonResult(leaderboard);
        }

        //DUPLICATED IN LEAGUE CONTROLLER
        private static int GetPositionOfUserInLeague(string userId, List<LeagueUser> leagueUsers, List<UserScore> userScores)
        {
            var userScoresLeagueList = CreateUserScoresLeagueList(leagueUsers, userScores);
            var currentUserScore = userScoresLeagueList.FirstOrDefault(x => x.UserId == userId);
            if (currentUserScore == null) return userScoresLeagueList.Count();
            return 1 + userScoresLeagueList.Count(userScore => userScore.UserId != userId && userScore.Score > currentUserScore.Score);
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
                Points = score.Score,
                PlayoffScore = score.PlayoffScore,
                Name = user.Name,
                Position = position
            };
            return leaderboardUserViewModel;
        }
    }
}