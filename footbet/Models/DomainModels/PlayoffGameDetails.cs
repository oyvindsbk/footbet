
namespace Footbet.Models.DomainModels
{
    public class PlayoffGameDetails
    {
        public int Id { get; set; }
        public int? IsHomeTeamNextGame { get; set; }
        public int? NextPlayoffGame { get; set; }
        public int? NextPlayoffGameRunnerUp { get; set; }
        public int? IsHomeTeamInRunnerUpGame { get; set; }
        public string HomeTeamDisplayName { get; set; }
        public string AwayTeamDisplayName { get; set; }
        public int GameId { get; set; }
    }
}