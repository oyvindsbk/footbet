namespace Footbet.Models.DomainModels
{
    public class ScoreBasis
    {
        public int Id { get; set; }
        public int GameType { get; set; }
        public int SportsEventId { get; set; }
        public int GradeOfMatchType { get; set; }
        public int Points { get; set; }
        public bool IsRunnerUp { get; set; }
    }
}