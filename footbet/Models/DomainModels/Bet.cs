namespace Footbet.Models.DomainModels
{
    public class Bet
    {
        public int Id { get; set; }
        public int? HomeGoals { get; set; }
        public int? AwayGoals { get; set; }
        public int? Result { get; set; }
        public int? UserBetId { get; set; }
        public int GameId { get; set; }
    }
}