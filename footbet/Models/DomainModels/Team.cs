namespace Footbet.Models.DomainModels
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string EnglishName { get; set; }
        public string Flag { get; set; }
        public int GroupId { get; set; }
        public int SportsEventId { get; set; }
    }
}