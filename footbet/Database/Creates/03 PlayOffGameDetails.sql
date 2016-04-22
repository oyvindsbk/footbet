SET ANSI_NULLS OFF

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[PlayoffGameDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NextPlayoffGame] [int] NULL,
	[NextPlayoffGameRunnerUp] [int] NULL,
	[IsHomeTeamInRunnerUpGame] [int] NULL,
	[IsHomeTeamNextGame] [int] NULL,
	[HomeTeamDisplayName] varchar (55) NULL,
	[AwayTeamDisplayName] varchar (55) NULL,
	[GameId] [int] NOT NULL FOREIGN KEY REFERENCES Games(Id)
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

SET ANSI_PADDING OFF
GO

