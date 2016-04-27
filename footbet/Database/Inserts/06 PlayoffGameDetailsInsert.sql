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
           (58, 1, 49, 'A1', 'B2'), 
		   (58, 0, 50, 'C1', 'D2'), 
		   (60, 1, 51, 'B1', 'A2'), 
		   (60, 0, 52, 'D1', 'C2'),
		   (57, 1, 53, 'E1', 'F2'), 
		   (57, 0, 54, 'G1', 'H2'),
		   (59, 1, 55, 'F1', 'E2'), 
		   (59, 0, 56, 'H1', 'G2'), 
		   (61, 1, 57, 'Vinner 5', 'Vinner 6'), 
		   (61, 0, 58, 'Vinner 1', 'Vinner 2'), 
		   (62, 1, 59, 'Vinner 7', 'Vinner 8'), 
		   (62, 0, 60, 'Vinner 3', 'Vinner 4')
		   
GO 


INSERT INTO [dbo].[PlayOffGameDetails]
           ([NextPlayoffGame], [IsHomeTeamNextGame], [GameId],[HomeTeamDisplayName], [AwayTeamDisplayName],[NextPlayoffGameRunnerUp], [IsHomeTeamInRunnerUpGame])
     VALUES
           (64, 1, 61, 'Vinner 8', 'Vinner 10', 63, 1), 
		   (64, 0, 62, 'Vinner 11', 'Vinner 12', 63, 0),
		   (null, null, 63, 'Taper semi 1', 'Taper semi 2', null ,null), 
		   (null, null, 64, 'Vinner semi 1', 'Vinner semi 2', null,null)
GO 
