using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Footbet.Models.DomainModels
{
    public class TeamWithPlayers
    {
        public string Team { get; set; }
        public List<Player> Players { get; set; }
    }

    public class Player
    {
        public string Name { get; set; }
    }
}