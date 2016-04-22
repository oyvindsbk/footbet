using System.Collections.Generic;

namespace Footbet.Models
{
    public class GroupViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string WinnerTeamCode { get; set; }
        public string RunnerUpTeamCode { get; set; }
        public string WinnerGameCode { get; set; }
        public string RunnerUpGameCode { get; set; }
        public int SportsEventId { get; set; }

        public List<TeamViewModel> Teams { get; set; }
        public List<GameViewModel> Games { get; set; }
    }
}