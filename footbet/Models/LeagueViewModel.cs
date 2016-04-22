namespace Footbet.Models
{
    public class LeagueViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SportsEventId { get; set; }
        public string Guid { get; set; }
        public int NumberOfMembers { get; set; }
        public int CurrentUsersPosition { get; set; }
    }
}