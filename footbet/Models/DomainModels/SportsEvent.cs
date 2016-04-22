using System;
using System.Collections.Generic;

namespace Footbet.Models.DomainModels
{
    public class SportsEvent
    {
        public SportsEvent()
        {
            Groups = new List<Group>();
//            this.UserBets = new HashSet<UserBet>();
//            this.UserScore = new HashSet<UserScore>();
        }

        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Id { get; set; }

        public virtual ICollection<Group> Groups { get; set; }
//        public virtual ICollection<UserBet> UserBets { get; set; }
//        public virtual ICollection<UserScore> UserScore { get; set; }
    }
}