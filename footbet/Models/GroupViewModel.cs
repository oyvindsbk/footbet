using System.Collections.Generic;

namespace Footbet.Models
{
    public class GroupViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int WinnerGameId { get; set; }
        public int RunnerUpGameId { get; set; }
        public int SportsEventId { get; set; }

        public List<TeamViewModel> Teams { get; set; }
        public List<GameViewModel> Games { get; set; }
    }
}