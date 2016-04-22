using Footbet.Models.DomainModels;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Footbet.Data
{
    public class FootBetDbContext : IdentityDbContext<ApplicationUser>
    {
        public FootBetDbContext() 
            : base("name=FootbetConnection")
        {
            Database.SetInitializer<FootBetDbContext>(null);
        }
        
        public DbSet<Bet> Bets { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Results> Results { get; set; }
        public DbSet<SportsEvent> SportsEvents { get; set; }
        public DbSet<TeamGame> TeamGames { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<UserBet> UserBets { get; set; }
        public DbSet<UserScore> UserScore { get; set; }
        public DbSet<ScoreBasis> ScoreBasis { get; set; }
        public DbSet<League> Leagues { get; set; }
        public DbSet<PlayoffBet> PlayoffBets { get; set; }
        public DbSet<LeagueUser> LeagueUsers { get; set; }
    }
    
}