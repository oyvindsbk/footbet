using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using Footbet.Models;
using Footbet.Models.DomainModels;
using Footbet.Repositories.Contracts;
using Footbet.Services.Contracts;

namespace Footbet.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly JavaScriptSerializer _javaScriptSerializer;

        public PlayerService(ITeamRepository teamRepository, JavaScriptSerializer javaScriptSerializer)
        {
            _teamRepository = teamRepository;
            _javaScriptSerializer = javaScriptSerializer;
        }

        public List<PlayerViewModel> GetPlayerViewModels()
        {
            var teamsWithPlayers = _javaScriptSerializer.Deserialize<List<TeamWithPlayers>>(Resources.players);
            var teams = _teamRepository.GetTeamsBySportsEventId(1);
            var playerViewModels = new List<PlayerViewModel>();
            foreach (var teamWithPlayer in teamsWithPlayers)
            {
                var team = teams.Single(x => x.EnglishName == teamWithPlayer.Team);
                foreach (var player in teamWithPlayer.Players)
                {
                    playerViewModels.Add(
                        new PlayerViewModel
                        {
                            Name = player.Name,
                            Team = team
                        });
                }
            }

            return playerViewModels;
        }
    }
}