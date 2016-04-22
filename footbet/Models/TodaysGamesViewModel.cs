using System.Collections.Generic;
using Footbet.Models.DomainModels;

namespace Footbet.Models
{
    public class TodaysGamesViewModel
    {
        public int NumberOfDaysFromToday { get; set; }
        public List<TodaysGamesSpecification> TodaysGamesSpecification { get; set; } 
    }
}