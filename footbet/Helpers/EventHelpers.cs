using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Footbet.Helpers
{
    public class EventHelpers
    {
        public static DateTime EventStart = new DateTime(2018, 6, 14);
        public static DateTime EventEnd = new DateTime(2018, 07, 16);

        public static bool EventHasEnded() => DateTime.UtcNow > new DateTime(2018, 07, 15, 15, 0, 0);
        public static bool EventHasStarted() => DateTime.UtcNow > new DateTime(2018, 06, 14, 15, 0, 0);
    }
}