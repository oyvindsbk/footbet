using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web.Mvc;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;

namespace Footbet.Controllers
{
    [Authorize]
    public class LeagueController : Common
    {
        private readonly ILeagueRepository _leagueRepository;
        private readonly ILeagueUserRepository _leagueUserRepository;
        private readonly IUserScoreRepository _userScoreRepository;

        public LeagueController(ILeagueRepository leagueRepository, ILeagueUserRepository leagueUserRepository, IUserScoreRepository userScoreRepository)
        {
            _leagueRepository = leagueRepository;
            _leagueUserRepository = leagueUserRepository;
            _userScoreRepository = userScoreRepository;
        }

        public ActionResult Index()
        {
            return View("League");
        }

        public ActionResult GetLeaguesForUser(int sportsEventId = 1)
        {
            var userId = GetUserId();
            var leagueUsers = _leagueUserRepository.GetLeagueUsersByUserId(userId);
            var leagues = _leagueRepository.GetLeaguesForUser(userId, sportsEventId, leagueUsers);
            var leagueViewModels = MapLeaguesToLeagueViewModels(leagues, userId);
            return ToJsonResult(leagueViewModels);
        }

        private IEnumerable<LeagueViewModel> MapLeaguesToLeagueViewModels(IEnumerable<League> leagues, string userId)
        {
            var leagueViewModels = new List<LeagueViewModel>();
            var userScores = _userScoreRepository.GetAllUserScoresBySportsEventId(1);
            
            foreach (var league in leagues)
            {
                var leagueUsers = _leagueUserRepository.GetLeagueUsersByLeagueId(league.Id);
                
                var position = userScores.Any() ? 
                    GetPositionOfUserInLeague(userId, leagueUsers, userScores) :
                    null;

                var leagueViewModel = MapLeagueToLeagueViewModel(league);

                leagueViewModel.NumberOfMembers = leagueUsers.Count;
                leagueViewModel.CurrentUsersPosition = position;

                leagueViewModels.Add(leagueViewModel);
            }
            return leagueViewModels;
        }

        private static int? GetPositionOfUserInLeague(string userId, List<LeagueUser> leagueUsers, List<UserScore> userScores)
        {
            var userScoresLeagueList = CreateUserScoresLeagueList(leagueUsers, userScores);
            var currentUserScore = userScoresLeagueList.FirstOrDefault(x => x.UserId == userId);
            if (currentUserScore == null) return userScoresLeagueList.Count;
            return 1 + userScoresLeagueList.Count(userScore => userScore.UserId != userId && userScore.Points > currentUserScore.Points);
        }

        private static List<UserScore> CreateUserScoresLeagueList(List<LeagueUser> leagueUsers, List<UserScore> userScores)
        {
            var userScoresLeague = new List<UserScore>();

            foreach (var leagueUser in leagueUsers)
            {
                var userScore = userScores.SingleOrDefault(x => x.UserId == leagueUser.UserId);
                if (userScore != null)
                    userScoresLeague.Add(userScore);
            }
           
            return userScoresLeague;
        }

        private LeagueViewModel MapLeagueToLeagueViewModel(League league)
        {
            return new LeagueViewModel
            {
                Id = league.Id,
                Guid = league.Guid,
                Name = league.Name,
                SportsEventId = league.SportsEventId,
            };
        }

        public ActionResult AddNewLeague(string leagueName)
        {
            var leagueExists = _leagueRepository.DoesLeagueExist(leagueName);

            if (leagueExists)
            {
                return CreateJsonError("En liga med dette navnet finnes allerede.");
            }

            var guid =  Guid.NewGuid();

            try
            {
                using (var scope = new TransactionScope())
                {
                    var league = AddNewLeague(leagueName, guid);

                    AddCurrentUserToLeague(league);

                    scope.Complete();
                }
            }
            catch (Exception)
            {

                return CreateJsonError("Oppretting av liga feilet.");
            }
            
            return Content(guid.ToString());
        }

        public ActionResult AddCurrentUserToLeagueByGuid(string guid,string userId = null)
        {
            var league = _leagueRepository.GetLeagueByGuid(guid);

            if (league == null)
            {
                return CreateJsonError(String.Format("Finner ikke liga med kode: {0}.", guid));
            }

            return AddCurrentUserToLeague(league, userId);

        }

        private ActionResult AddCurrentUserToLeague(League league, string userId = null)
        {
            if (userId == null) userId = GetUserId();
            var leagueUser = CreateLeagueUser(league.Id, userId);

            if (_leagueUserRepository.UserIsAlreadyInLeague(leagueUser))
            {
                return CreateJsonError(String.Format("Du er allerede med i liga med kode: {0}.", league.Guid));
            }
            _leagueUserRepository.AddUserToLeague(leagueUser);
            return Content("Du har nå blitt med i liga: " + league.Name);
        }

        private League AddNewLeague(string leagueName, Guid guid)
        {
            var league = CreateLeague(leagueName, guid);
            league = _leagueRepository.AddNewLeague(league);
            return league;
        }

        private static League CreateLeague(string leagueName, Guid guid)
        {
            var league = new League
            {
                Name = leagueName,
                Guid = guid.ToString(),
                SportsEventId = 1,
            };
            return league;
        }

        private LeagueUser CreateLeagueUser(int leagueId, string userId)
        {
            var leagueUser = new LeagueUser
            {
                LeagueId = leagueId,
                UserId = userId
            };
            return leagueUser;
        }
    }
}