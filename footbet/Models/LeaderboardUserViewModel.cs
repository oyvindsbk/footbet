namespace Footbet.Models
{
    public class LeaderboardUserViewModel
    {
        public string Name { get; set; }
        public string UserName { get; set; }
        public int Points { get; set; }
        public int Position { get; set; }
        public int? PlayoffScore { get; set; }
    }
}