using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Models
{
    public class BetViewModel
    {
        public List<GroupViewModel> Groups { get; set; }
        public List<GameViewModel> PlayoffGames { get; set; }
        public List<PlayerViewModel> Players { get; set; }
        public PlayerViewModel SelectedTopScorer { get; set; }
    }

    public class PlayerViewModel
    {
        public string Name { get; set; }
        public Team Team { get; set; }
    }
}