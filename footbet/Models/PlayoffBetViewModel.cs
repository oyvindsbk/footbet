using Footbet.Models.DomainModels;

namespace Footbet.Models
{
    public class PlayoffBetViewModel
    {
        public int Id { get; set; }
        public Team HomeTeam { get; set; }
        public Team AwayTeam { get; set; }
        public int? HomeGoals { get; set; }
        public int? AwayGoals { get; set; }
        public int? Result { get; set; }
        public int GameType { get; set; }
    }
}