using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Footbet.Extentions
{
    public static class DateTimeExtention
    {
        public static string ToFormattedString(this DateTime dateTime)
        {
            return dateTime.ToString("dd.MM.yyyy HH:mm:ss", CultureInfo.InvariantCulture);
        }
    }
}