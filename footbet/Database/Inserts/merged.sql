INSERT INTO [dbo].[SportsEvents]
           ([Name]
           ,[StartDate]
           ,[EndDate])
     VALUES
           ('VM 2018' 
           ,'2018-06-14 17:00:00.000'
           ,'2018-07-17 23:00:00:000')
GO



INSERT INTO [dbo].[Groups] 
([Name],
 [SportsEventId],
 [WinnerGameId],
 [RunnerUpGameId])
     VALUES
           ('Gruppe A',1,50,51),('Gruppe B',1,51, 50),('Gruppe C',1,49,52),('Gruppe D',1,52,49),('Gruppe E',1,53,55),('Gruppe F',1,55,53),('Gruppe G',1,56,54),('Gruppe H',1,54,56)
GO

INSERT INTO [dbo].[Teams]
           ([Name]
           ,[GroupId]
           ,[SportsEventId],
		   [Flag])
     VALUES
           ('Russland',1,1,'flag-ru'),
		   ('Saudi-Arabia',1,1,'flag-sa'),
		   ('Egypt',1,1,'flag-eg'),
		   ('Uruguay',1,1,'flag-uy'),
		   ('Portugal',2,1,'flag-pt'),
		   ('Spania',2,1,'flag-es'),
		   ('Marokko',2,1,'flag-ma'),
		   ('Iran',2,1,'flag-ir'),
		   ('Frankrike',3,1,'flag-fr'),
		   ('Australia',3,1,'flag-au'),
		   ('Peru',3,1,'flag-pe'),
		   ('Danmark',3,1,'flag-dk'),
		   ('Argentina',4,1,'flag-ar'),
		   ('Island',4,1,'flag-is'),
		   ('Kroatia',4,1,'flag-hr'),
		   ('Nigeria',4,1,'flag-ng'),
		   ('Brasil',5,1,'flag-br'),
		   ('Sveits',5,1,'flag-ch'),
		   ('Costa Rica',5,1,'flag-cr'),
		   ('Serbia',5,1,'flag-rs'),
		   ('Tyskland',6,1,'flag-de'),
		   ('Mexico',6,1,'flag-mx'),
		   ('Sverige',6,1,'flag-se'),
		   ('Sør-Korea',6,1,'flag-kr'),
		   ('Belgia',7,1,'flag-be'),
		   ('Panama',7,1,'flag-pa'),
		   ('Tunisia',7,1,'flag-tn'),
		   ('England',7,1,'flag-gb'),
		   ('Polen',8,1,'flag-pl'),
		   ('Senegal',8,1,'flag-sn'),
		   ('Colombia',8,1,'flag-co'),
		   ('Japan',8,1,'flag-jp')
GO
INSERT INTO [dbo].[Games]
           ([Name]
           ,[HomeTeam]
           ,[AwayTeam]
           ,[StartTime]
           ,[GameType]
		   ,[GroupId]
		   ,[SportsEventId])
     VALUES
	 --group A
           ('Kamp 1',1,2,'2018-06-14 17:00:00.000',1,1,1),
		   ('Kamp 2',3,4,'2018-06-15 14:00:00.000',1,1,1),
		   ('Kamp 17',1,3,'2018-06-19 20:00:00.000',1,1,1),
		   ('Kamp 18',4,2,'2018-06-20 17:00:00.000',1,1,1),
		   ('Kamp 33',2,3,'2018-06-25 16:00:00.000',1,1,1),
		   ('Kamp 34',4,1,'2018-06-25 16:00:00.000',1,1,1),

		   --group B
		   ('Kamp 3',7,8,'2018-06-15 17:00:00.000',1,2,1),
		   ('Kamp 4',5,6,'2018-06-15 20:00:00.000',1,2,1),
		   ('Kamp 19',5,7,'2018-06-20 14:00:00.000',1,2,1),
		   ('Kamp 20',8,6,'2018-06-20 20:00:00.000',1,2,1), 
		   ('Kamp 35',8,5,'2018-06-25 20:00:00.000',1,2,1),
		   ('Kamp 36',6,7,'2018-06-25 20:00:00.000',1,2,1),

		   --group C
		   ('Kamp 5',9,10,'2018-06-16 12:00:00.000',1,3,1),
		   ('Kamp 6',11,12,'2018-06-16 18:00:00.000',1,3,1),
		   ('Kamp 21',12,10,'2018-06-21 14:00:00.000',1,3,1),
		   ('Kamp 22',9,11,'2018-06-21 17:00:00.000',1,3,1),
		   ('Kamp 37',12,9,'2018-06-26 16:00:00.000',1,3,1),
		   ('Kamp 38',10,11,'2018-06-26 16:00:00.000',1,3,1),

		   --group D
		   ('Kamp 7',13,14,'2018-06-16 15:00:00.000',1,4,1),
		   ('Kamp 8',15,16,'2018-06-16 21:00:00.000',1,4,1),
		   ('Kamp 23',13,15,'2018-06-21 20:00:00.000',1,4,1),
		   ('Kamp 24',16,14,'2018-06-22 17:00:00.000',1,4,1),
		   ('Kamp 39',16,13,'2018-06-26 20:00:00.000',1,4,1),
		   ('Kamp 40',14,15,'2018-06-26 20:00:00.000',1,4,1),

		   --group E
		   ('Kamp 9',19,20,'2018-06-17 14:00:00.000',1,5,1),
		   ('Kamp 10',17,18,'2018-06-17 20:00:00.000',1,5,1),
		   ('Kamp 25',17,19,'2018-06-22 14:00:00.000',1,5,1),
		   ('Kamp 26',20,18,'2018-06-22 20:00:00.000',1,5,1),
		   ('Kamp 41',18,19,'2018-06-27 20:00:00.000',1,5,1),
		   ('Kamp 42',20,17,'2018-06-27 20:00:00.000',1,5,1),
		   
		   ('Kamp 11',21,22,'2018-06-17 17:00:00.000',1,6,1),
		   ('Kamp 12',23,24,'2018-06-18 14:00:00.000',1,6,1),
		   ('Kamp 27',24,22,'2018-06-23 17:00:00.000',1,6,1),
		   ('Kamp 28',21,23,'2018-06-23 20:00:00.000',1,6,1),
		   ('Kamp 43',22,23,'2018-06-27 16:00:00.000',1,6,1),
		   ('Kamp 44',24,21,'2018-06-27 16:00:00.000',1,6,1),

		   ('Kamp 13',25,26,'2018-06-18 17:00:00.000',1,7,1),
		   ('Kamp 14',27,28,'2018-06-18 20:00:00.000',1,7,1),
		   ('Kamp 29',25,27,'2018-06-23 14:00:00.000',1,7,1),
		   ('Kamp 30',28,26,'2018-06-24 14:00:00.000',1,7,1),
		   ('Kamp 45',28,25,'2018-06-28 20:00:00.000',1,7,1),
		   ('Kamp 46',26,27,'2018-06-28 20:00:00.000',1,7,1),
		   
		   --group H
		   ('Kamp 15',31,32,'2018-06-19 14:00:00.000',1,8,1),
		   ('Kamp 16',29,30,'2018-06-19 17:00:00.000',1,8,1),
		   ('Kamp 31',32,30,'2018-06-24 17:00:00.000',1,8,1),
		   ('Kamp 32',29,31,'2018-06-24 20:00:00.000',1,8,1),
		   ('Kamp 47',30,31,'2018-06-28 16:00:00.000',1,8,1),
		   ('Kamp 48',32,29,'2018-06-28 16:00:00.000',1,8,1)
GO

INSERT INTO [dbo].[Games]
           ([Name]
           ,[StartTime]
           ,[GameType]
		   ,[SportsEventId]
		   )
     VALUES
           ('8-delsfinale 1','2018-06-30 16:00:00.000',2,1), --49
		   ('8-delsfinale 2','2018-06-30 20:00:00.000',2,1),--50
		   ('8-delsfinale 3','2018-07-01 16:00:00.000',2,1),--51
		   ('8-delsfinale 4','2018-07-01 20:00:00.000',2,1),--52
		   ('8-delsfinale 5','2018-07-02 16:00:00.000',2,1),--53
		   ('8-delsfinale 6','2018-07-02 20:00:00.000',2,1),--54
		   ('8-delsfinale 7','2018-07-03 16:00:00.000',2,1),--55
		   ('8-delsfinale 8','2018-07-03 20:00:00.000',2,1),--56
		   ('Kvartfinale 1','2018-07-06 16:00:00.000',3,1), --57
		   ('Kvartfinale 2','2018-07-06 20:00:00.000',3,1),--58
		   ('Kvartfinale 3','2018-07-07 16:00:00.000',3,1),--59
		   ('Kvartfinale 4','2018-07-07 20:00:00.000',3,1),--60
		   ('Semifinale 1','2018-07-10 20:00:00.000',4,1),
		   ('Semifinale 2','2018-07-11 20:00:00.000',4,1),
		   ('Bronsefinale','2018-07-14 16:00:00.000',5,1),
		   ('Finale','2018-07-15 17:00:00.000',6,1)
GO




INSERT INTO [dbo].[PlayOffGameDetails]
           ([NextPlayoffGame], [IsHomeTeamNextGame], [GameId],[HomeTeamDisplayName], [AwayTeamDisplayName])
     VALUES
           (57, 0, 49, 'C1', 'D2'), 
		   (57, 1, 50, 'A1', 'B2'), 
		   (60, 1, 51, 'B1', 'A2'), 
		   (60, 0, 52, 'D1', 'C2'),

		   (58, 1, 53, 'E1', 'F2'), 
		   (58, 0, 54, 'G1', 'H2'),

		   (59, 1, 55, 'F1', 'E2'), 
		   (59, 0, 56, 'H1', 'G2'), 
		   (61, 1, 57, 'Vinner A1/B2', 'Vinner C1/2D'), 
		   (61, 0, 58, 'Vinner E1/2F', 'Vinner G1/H2'), 
		   (62, 1, 59, 'Vinner F1/E2', 'Vinner H1/G2'), 
		   (62, 0, 60, 'Vinner B1/A2', 'Vinner D1/2C')
		   
GO 


INSERT INTO [dbo].[PlayOffGameDetails]
           ([NextPlayoffGame], [IsHomeTeamNextGame], [GameId],[HomeTeamDisplayName], [AwayTeamDisplayName],[NextPlayoffGameRunnerUp], [IsHomeTeamInRunnerUpGame])
     VALUES
           (64, 1, 61, 'Vinner KF 1', 'Vinner KF 2', 63, 1), 
		   (64, 0, 62, 'Vinner KF 3', 'Vinner KF 4', 63, 0),
		   (null, null, 63, 'Taper SF 1', 'Taper SF 2', null ,null), 
		   (null, null, 64, 'Vinner SF 1', 'Vinner SF 2', null,null)
GO INSERT INTO [dbo].[Leagues]
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


INSERT INTO [ScoreBasis]
           ([GameType]
           ,[SportsEventId]
           ,[GradeOfMatchType]
           ,[Points]
		   ,[IsRunnerUp])
     VALUES
           (1,1,1,10,0),
           (1,1,2,2,0),
           (1,1,3,7,0),
           (1,1,4,5,0),
           (1,1,5,0,0),
           (2,1,1,6,0),
           (3,1,1,10,0),
           (4,1,1,15,0),
           (5,1,1,0,1),
		   (5,1,1,15,0),
		   (6,1,1,20,1),
           (6,1,1,30,0)

GO