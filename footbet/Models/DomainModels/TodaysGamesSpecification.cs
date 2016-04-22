using System;
using System.Collections.Generic;

namespace Footbet.Models.DomainModels
{
    public class TodaysGamesSpecification
    {
        public int Id { get; set; }
        public DateTime TodaysDate { get; set; }
        public string StartTime { get; set; }
        public int? HomeGoals { get; set; }
        public int? AwayGoals { get; set; }
        public int? Result { get; set; }
        public int GameType { get; set; }
        public int SportsEventId { get; set; }
        public string Name { get; set; }
        public Team HomeTeam { get; set; }
        public Team AwayTeam { get; set; }
        public IList<PlayoffGameDetails> PlayoffGameDetails { get; set; }
        public Dictionary<string,List<string>> Bets { get; set; }
    }
}