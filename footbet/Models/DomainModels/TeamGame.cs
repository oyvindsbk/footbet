namespace Footbet.Models.DomainModels
{
    public class TeamGame
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public bool IsHomeTeam { get; set; }
        public int GameId { get; set; }
        public virtual Team Team { get; set; }
    }
}