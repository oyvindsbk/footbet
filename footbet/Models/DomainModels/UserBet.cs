using System;
using System.Collections.Generic;

namespace Footbet.Models.DomainModels
{
    public class UserBet
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int SportsEventId { get; set; }
        public bool IsResultBet { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string TopScorerName { get; set; }
        public int? TopScorerTeam { get; set; }
        public virtual ICollection<Bet> Bets { get; set; }
        public virtual ICollection<PlayoffBet> PlayoffBets { get; set; }
    }
}