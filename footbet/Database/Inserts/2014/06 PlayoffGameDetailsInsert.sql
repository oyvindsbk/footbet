INSERT INTO [dbo].[PlayOffGameDetails]
           ([NextPlayoffGame], [IsHomeTeamNextGame], [GameId],[HomeTeamDisplayName], [AwayTeamDisplayName])
     VALUES
           (109, 1, 101, 'A2', 'C2'), 
		   (110, 1, 102, 'B1', '3rd A/C/D'), 
		   (109, 0, 103, 'D1', '3rd B/E/F'), 
		   (112, 1, 104, 'A1', '3rd C/D/E'),
		   (111, 1, 105, 'C1', '3rd A/B/F'), 
		   (110, 0, 106, 'F1', 'E2'),
		   (111, 0, 107, 'E1', 'D2'), 
		   (112, 0, 108, 'B21', 'F2'), 
		   (113, 1, 109, 'Vinner 1', 'Vinner 3'), 
		   (113, 0, 110, 'Vinner 2', 'Vinner 6'), 
		   (114, 1, 111, 'Vinner 5', 'Vinner 7'), 
		   (114, 0, 112, 'Vinner 4', 'Vinner 8')
		   
GO 


INSERT INTO [dbo].[PlayOffGameDetails]
           ([NextPlayoffGame], [IsHomeTeamNextGame], [GameId],[HomeTeamDisplayName], [AwayTeamDisplayName])
     VALUES
           (115, 1, 113, 'Vinner kvart 1', 'Vinner kvart 2'), 
		   (115, 0, 114, 'Vinner kvart 3', 'Vinner kvart 4'),
		   (null, null, 115, 'Vinner semi 1', 'Vinner semi 2')
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
GO 
