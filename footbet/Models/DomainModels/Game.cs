using System;
using System.Collections.Generic;
namespace Footbet.Models.DomainModels
{
    public class Game
    {
        public Game()
        {
            Bets = new HashSet<Bet>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? HomeTeam { get; set; }
        public int? AwayTeam { get; set; }
        public DateTime StartTime { get; set; }
        public int GameType { get; set; }
        public int SportsEventId { get; set; }
        public int? GroupId { get; set; }

        public virtual ICollection<Bet> Bets { get; set; }
        public virtual ICollection<TeamGame> TeamGames { get; set; }
        public virtual ICollection<PlayoffGameDetails> PlayoffGameDetails { get; set; }
    }
}