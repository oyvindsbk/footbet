namespace Footbet.Models.DomainModels
{
    public class PlayoffBet
    {
        public int Id { get; set; }
        public int? HomeGoals { get; set; }
        public int? AwayGoals { get; set; }
        public int? Result { get; set; }
        public int? UserBetId { get; set; }
        public int GameId { get; set; }
        public int? HomeTeam { get; set; }
        public int? AwayTeam { get; set; }
        public int GameType { get; set; }
    }
}