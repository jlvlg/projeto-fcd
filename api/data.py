from bs4 import BeautifulSoup
import nba_api.stats.endpoints as endpoints
import nba_api.stats.static.teams as static_teams
import pandas as pd
from functools import reduce
import requests
from pathlib import Path
from unidecode import unidecode
from time import sleep


def get_teams():
    return (
        endpoints.LeagueStandingsV3()
        .get_data_frames()[0]
        .join(pd.DataFrame(static_teams.get_teams()).set_index("id"), on="TeamID")
        .rename(
            columns={
                "Conference": "conference",
                "TeamID": "id",
                "PlayoffRank": "rank",
            },
        )[["id", "rank", "conference", "full_name", "abbreviation"]]
    )


def get_team_stats(team_id, seasons):
    seasons = {
        x: endpoints.TeamDashboardByGeneralSplits(team_id, season=x).get_data_frames()[
            :2
        ]
        for x in seasons
    }
    [x[1].set_index("TEAM_GAME_LOCATION", inplace=True) for x in seasons.values()]
    seasons["total"] = [
        reduce(lambda x, y: x.add(y), (x[i] for x in seasons.values()))
        for i in range(len(next(iter(seasons.values()))))
    ]
    for x in seasons.values():
        x[0] = x[0].to_dict(orient="records")[0]
    return pd.DataFrame(
        [
            {
                "season": x,
                "wins": y[1].loc["Home", "W"] + y[1].loc["Road", "W"],
                "wins_home": y[1].loc["Home", "W"],
                "wins_road": y[1].loc["Road", "W"],
                "losses": y[1].loc["Home", "L"] + y[1].loc["Road", "L"],
                "losses_home": y[1].loc["Home", "L"],
                "losses_road": y[1].loc["Road", "L"],
                "score_per_game": y[0]["PTS"] / y[0]["GP"],
                "assists_per_game": y[0]["AST"] / y[0]["GP"],
                "rebounds_per_game": y[0]["REB"] / y[0]["GP"],
                "three_point_field_goals": y[0]["FG3M"],
                "rebounds": y[0]["REB"],
                "offensive_rebounds": y[0]["OREB"],
                "defensive_rebounds": y[0]["DREB"],
                "score": y[0]["PTS"],
                "two_point_field_goals": y[0]["FGM"] - y[0]["FG3M"],
                "free_throws": y[0]["FTM"],
                "steals": y[0]["STL"],
                "blocks_per_game": y[0]["BLK"] / y[0]["GP"],
                "turnovers_per_game": y[0]["TOV"] / y[0]["GP"],
                "fouls_per_game": y[0]["PF"] / y[0]["GP"],
                "score_per_game_road": y[1].loc["Road", "PTS"] / y[1].loc["Road", "GP"],
                "score_per_game_home": y[1].loc["Home", "PTS"] / y[1].loc["Home", "GP"],
                "opponent_score_per_game_road": (
                    y[1].loc["Road", "PTS"] - y[1].loc["Road", "PLUS_MINUS"]
                )
                / y[1].loc["Road", "GP"],
                "opponent_score_per_game_home": (
                    y[1].loc["Home", "PTS"] - y[1].loc["Home", "PLUS_MINUS"]
                )
                / y[1].loc["Home", "GP"],
            }
            for x, y in seasons.items()
        ]
    )


def get_games(seasons, team_id=None, player_id=None, opponent_object=True):
    if team_id:
        data = pd.concat(
            endpoints.TeamGameLogs(
                team_id_nullable=team_id, season_nullable=x
            ).get_data_frames()[0]
            for x in seasons
        )
    else:
        data = pd.concat(
            endpoints.PlayerGameLogs(
                player_id_nullable=player_id, season_nullable=x
            ).get_data_frames()[0]
            for x in seasons
        )

    return (
        data.assign(
            location=data["MATCHUP"].apply(
                lambda x: "road" if x.split()[1] == "@" else "home"
            ),
            opponent=data["MATCHUP"].apply(
                lambda x: (
                    static_teams.find_team_by_abbreviation(x.split()[2])
                    if opponent_object
                    else static_teams.find_team_by_abbreviation(x.split()[2])["id"]
                ),
            ),
        )
        .rename(
            columns={
                "GAME_ID": "id",
                "SEASON_YEAR": "season",
                "GAME_DATE": "date",
                "WL": "result",
                "MIN": "minutes_played",
                "PTS": "score",
                "FGM": "field_goals",
                "FGA": "field_goals_attempted",
                "FG_PCT": "field_goals_percentage",
                "FG3M": "three_point_field_goals",
                "FG3A": "three_point_field_goals_attempted",
                "FG3_PCT": "three_point_field_goals_percentage",
                "FTM": "free_throws",
                "FTA": "free_throws_attempted",
                "FT_PCT": "free_throws_percentage",
                "OREB": "offensive_rebounds",
                "DREB": "defensive_rebounds",
                "REB": "rebounds",
                "AST": "assists",
                "STL": "steals",
                "BLK": "blocks",
                "TOV": "turnovers",
                "PF": "fouls",
                "PLUS_MINUS": "plus_minus",
            }
        )
        .sort_values("date")[
            [
                "id",
                "season",
                "date",
                "result",
                "location",
                "opponent",
                "minutes_played",
                "score",
                "field_goals",
                "field_goals_attempted",
                "field_goals_percentage",
                "three_point_field_goals",
                "three_point_field_goals_attempted",
                "three_point_field_goals_percentage",
                "free_throws",
                "free_throws_attempted",
                "free_throws_percentage",
                "offensive_rebounds",
                "defensive_rebounds",
                "rebounds",
                "assists",
                "steals",
                "blocks",
                "turnovers",
                "fouls",
                "plus_minus",
            ]
        ]
    )


def get_team_games(team_id, seasons, opponent_object=True):
    games = get_games(seasons, team_id=team_id, opponent_object=opponent_object)
    return games.assign(
        team_score=games["score"],
        opponent_score=games["score"] - games["plus_minus"],
    )


def get_players(team_id):
    team = static_teams.find_team_name_by_id(team_id)
    nba = endpoints.CommonTeamRoster(team_id).get_data_frames()[0]
    pos = {
        "PG": "Point Guard",
        "F": "Forward",
        "SF": "Small Forward",
        "SG": "Shooting Guard",
        "C": "Center",
        "PF": "Power Forward",
        "G": "Guard",
    }
    espn = pd.DataFrame(
        [
            {
                "name": unidecode(x.contents[1].div.a.string),
                "position": pos.get(x.contents[2].div.string, x.contents[2].div.string),
                "age": x.contents[3].div.string,
                "college": (
                    x.contents[6].div.string
                    if x.contents[6].div.string != "--"
                    else None
                ),
                "salary": (
                    x.contents[7].div.string[1:].replace(",", "")
                    if x.contents[7].div.string != "--"
                    else None
                ),
            }
            for x in BeautifulSoup(
                requests.get(
                    f"https://www.espn.com/nba/team/roster/_/name/{team['abbreviation'].lower()}/{'-'.join(team['full_name'].lower().split())}",
                    headers={"User-Agent": "Mozilla/5.0"},
                ).text,
                "html.parser",
            ).table.tbody.children
        ]
    )
    return (
        nba.assign(
            name=nba["PLAYER"].apply(unidecode),
            weight=nba["WEIGHT"].astype("float") * 0.453592,
            height=nba["HEIGHT"].apply(
                lambda x: (height := [float(y) for y in x.split("-")])[0] * 0.3048
                + height[-1] * 0.0254
            ),
            experience=nba["EXP"].replace("R", 0),
        )
        .rename(columns={"PLAYER_ID": "id", "TeamID": "team_id"})
        .merge(espn, on="name")[
            [
                "id",
                "name",
                "weight",
                "height",
                "experience",
                "position",
                "age",
                "college",
                "salary",
                "team_id",
            ]
        ]
    )


def get_player_games(player_id, team_id, seasons, opponent_object=True):
    games = get_games(seasons, player_id=player_id, opponent_object=opponent_object)
    sleep(1)
    team_games = get_team_games(team_id, seasons, opponent_object=False)
    games = games.merge(team_games, on="id", suffixes=("", "_DROP"))
    return games.loc[:, ~games.columns.str.contains("_DROP")]


def get_player_stats(player_id, seasons):
    data = pd.concat(
        endpoints.PlayerCareerStats(player_id=player_id).get_data_frames()[:2]
    )
    data = pd.DataFrame(
        [
            {
                "season": x["SEASON_ID"] if pd.notna(x["SEASON_ID"]) else "career",
                "games_played": x["GP"],
                "score": x["PTS"],
                "mean_score": x["PTS"] / x["GP"],
                "assists": x["AST"],
                "mean_assists": x["AST"] / x["GP"],
                "rebounds": x["REB"],
                "mean_rebounds": x["REB"] / x["GP"],
                "minutes_played": x["MIN"],
            }
            for _, x in data.iterrows()
        ]
    )
    return data[data["season"].isin(seasons + ["career"])]


def save_player_data(player_id):
    games = get_player_games(
        player_id, 1610612741, ["2023-24", "2024-25"], opponent_object=False
    )
    games.to_csv(f"cache/player/{player_id}_games.csv", index=False)

    stats = get_player_stats(player_id, ["2023-24", "2024-25"])

    new_columns = [
        "median_score",
        "mode_score",
        "mode_frequency_score",
        "dev_score",
        "max_score",
        "min_score",
        "median_assists",
        "mode_assists",
        "mode_frequency_assists",
        "dev_assists",
        "max_assists",
        "min_assists",
        "median_rebounds",
        "mode_rebounds",
        "mode_frequency_rebounds",
        "dev_rebounds",
        "max_rebounds",
        "min_rebounds",
    ]
    for col in new_columns:
        stats[col] = None

    for season, group in games.groupby("season"):
        season_index = stats[stats["season"] == season].index
        if not season_index.empty:
            stats.loc[season_index, new_columns] = [
                group["score"].median(),
                (mode_points := group["score"].mode()[0]),
                group["score"].value_counts()[mode_points],
                group["score"].std(),
                group["score"].max(),
                group["score"].min(),
                group["assists"].median(),
                (mode_assists := group["assists"].mode()[0]),
                group["assists"].value_counts()[mode_assists],
                group["assists"].std(),
                group["assists"].max(),
                group["assists"].min(),
                group["rebounds"].median(),
                (mode_rebounds := group["rebounds"].mode()[0]),
                group["rebounds"].value_counts()[mode_rebounds],
                group["rebounds"].std(),
                group["rebounds"].max(),
                group["rebounds"].min(),
            ]
    stats.loc[stats[stats["season"] == "career"].index, new_columns] = [
        games["score"].median(),
        (mode_points := games["score"].mode()[0]),
        games["score"].value_counts()[mode_points],
        games["score"].std(),
        games["score"].max(),
        games["score"].min(),
        games["assists"].median(),
        (mode_assists := games["assists"].mode()[0]),
        games["assists"].value_counts()[mode_assists],
        games["assists"].std(),
        games["assists"].max(),
        games["assists"].min(),
        games["rebounds"].median(),
        (mode_rebounds := games["rebounds"].mode()[0]),
        games["rebounds"].value_counts()[mode_rebounds],
        games["rebounds"].std(),
        games["rebounds"].max(),
        games["rebounds"].min(),
    ]

    stats.to_csv(f"cache/player/{player_id}_stats.csv", index=False)
    return games, stats


def save_data():
    # shutil.rmtree("cache")
    Path("cache/team").mkdir(parents=True, exist_ok=True)
    Path("cache/player").mkdir(parents=True, exist_ok=True)
    get_teams().to_csv("cache/teams.csv", index=False)
    sleep(1)
    get_team_stats(1610612741, ["2023-24", "2024-25"]).to_csv(
        "cache/team/stats.csv", index=False
    )
    sleep(1)
    get_team_games(1610612741, ["2023-24", "2024-25"], opponent_object=False).to_csv(
        "cache/team/games.csv", index=False
    )
    sleep(1)
    get_players(1610612741).to_csv("cache/team/players.csv", index=False)
