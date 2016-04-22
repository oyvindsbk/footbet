namespace Footbet.Models.DomainModels
{
    public class UserScore
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public int? PlayoffScore { get; set; }
        public string UserId { get; set; }
        public int SportsEventId { get; set; }
    }
}