SET ANSI_NULLS OFF
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Groups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](55) NOT NULL,
	[WinnerTeamCode] [varchar](55) NULL,
	[RunnerUpTeamCode] [varchar](55) NULL,
	[ThirdPlaceTeamCode] [varchar](55) NULL,
	[WinnerGameCode] [varchar](55) NULL,
	[RunnerUpGameCode] [varchar](55) NULL,
	[SportsEventId] [int] NOT NULL FOREIGN KEY REFERENCES SportsEvents(Id)
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

SET ANSI_PADDING OFF
GO


