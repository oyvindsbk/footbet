using System.Collections.Generic;

namespace Footbet.Models
{
    public class BetViewModel
    {
        public List<GroupViewModel> Groups { get; set; }
        public List<GameViewModel> PlayoffGames { get; set; }
    }
}