namespace Footbet.Models
{
    public class LeaderboardUserViewModel
    {
        public int Points => GroupScore + PlayoffScore + TopScorerScore + BonusScore;

        public string Name { get; set; }
        public string UserName { get; set; }
        public int GroupScore { get; set; }
        public int BonusScore { get; set; }
        public int TopScorerScore { get; set; }
        public int Position { get; set; }
        public int PlayoffScore { get; set; }
    }
}