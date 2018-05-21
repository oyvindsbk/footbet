INSERT INTO [dbo].[Leagues]
           ([Name]
           ,[SportsEventId]
           ,[Guid])
     VALUES
           ('Alle spillere'
           ,1
           ,'DefaultLeague')
GO

INSERT INTO [dbo].[LeagueUsers]
           ([LeagueId]
           ,[UserId])
     VALUES
           (1
           ,'5c277427-40f4-4b66-92a7-99468a63d2fd')
GO


