from ariadne import load_schema_from_path, ObjectType, make_executable_schema
from ariadne.asgi import GraphQL
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import data
import ai
import numpy as np
import uvicorn

data.save_data()

type_defs = load_schema_from_path("schema.graphql")

query = ObjectType("Query")
team = ObjectType("Team")
player = ObjectType("Player")
aitype = ObjectType("AI")
gumbel = ObjectType("Gumbel")
proportions = ObjectType("Proportions")
gamregression = ObjectType("GAMRegression")


@query.field("teams")
def resolve_teams(*_, ids=[], conference=None):
    teams = data.get_teams()

    if ids:
        teams = teams[teams["id"].isin(ids)]

    if conference:
        teams = teams[teams["conference"] == conference]

    return teams.to_dict(orient="records")


@team.field("stats")
def resolve_team_stats(team, *_, seasons):
    return data.get_team_stats(team["id"], seasons).to_dict(orient="records")


@team.field("games")
def resolve_team_games(team, *_, seasons, opponent_ids=None):
    games = data.get_team_games(team["id"], seasons)
    if opponent_ids:
        games = games[games["opponent"].apply(lambda x: x["id"] in opponent_ids)]
    return games.to_dict(orient="records")


@team.field("players")
def resolve_players(team, *_, ids=[], team_id=None):
    players = data.get_players(team["id"] if team else team_id)
    if ids:
        players = players[players["id"].isin(ids)]
    return players.to_dict(orient="records")


@player.field("games")
def resolve_player_games(player, *_, seasons, opponent_ids=None):
    games = data.get_player_games(player["id"], seasons)
    if opponent_ids:
        games = games[games["opponent"].apply(lambda x: x["id"] in opponent_ids)]
    return games.to_dict(orient="records")


@player.field("stats")
def resolve_player_stats(player, *_, seasons):
    return data.get_player_stats(player["id"], seasons).to_dict(orient="records")


@player.field("ai")
def resolve_ai(player, *_):
    return {"player_id": player["id"]}


@aitype.field("gumbel")
def resolve_gumbel(aiparent, *_, column, x=None, start=None, end=None):
    loc, scale = ai.get_models(aiparent["player_id"])["gumbel"][column]
    return {
        "loc": loc,
        "scale": scale,
        "X": np.array([x]) if x else np.linspace(start, end).round().astype(int),
    }


@aitype.field("proportions")
def resolve_proportions(aiparent, *_, column, x=None, start=None, end=None):
    return {
        "data": ai.get_models(aiparent["player_id"])["data"]["games"][column],
        "X": np.array([x]) if x else np.linspace(start, end),
    }


@aitype.field("linearRegression")
def resolve_linear_regression(aiparent, *_, column):
    return ai.regression(
        ai.get_models(aiparent["player_id"])["linear"],
        aiparent["player_id"],
        column,
    )


@aitype.field("linearGAM")
def resolve_linear_gam(aiparent, *_, column):
    model = ai.get_models(aiparent["player_id"])["gam"]["linear"]
    return ai.regression(
        model,
        aiparent["player_id"],
        column,
    ) | {"column": column, "model": model}


@aitype.field("poissonGAM")
def resolve_poisson_gam(aiparent, *_, column):
    model = ai.get_models(aiparent["player_id"])["gam"]["poisson"]
    return ai.regression(
        model,
        aiparent["player_id"],
        column,
    ) | {"column": column, "model": model}


@aitype.field("logisticRegression")
def resolve_logistic_regression(aiparent, *_, column):
    return ai.logistic(aiparent["player_id"], column)


@gumbel.field("probGreaterThan")
@gumbel.field("probGreaterThanOrEqualTo")
@gumbel.field("probLessThanOrEqualTo")
@gumbel.field("probLessThan")
def resolve_gumbel(gumbel, info):
    return [
        {"x": x, "y": y}
        for x, y in zip(
            gumbel["X"],
            ai.gumbel(gumbel["loc"], gumbel["scale"], gumbel["X"], info.field_name),
        )
    ]


@proportions.field("proportionGreaterThan")
@proportions.field("proportionGreaterThanOrEqualTo")
@proportions.field("proportionLessThanOrEqualTo")
@proportions.field("proportionLessThan")
def resolve_proportions(proportions, info):
    data = np.array(proportions["data"])
    X = proportions["X"]

    match info.field_name:
        case "proportionGreaterThan":
            comparisons = data[:, None] > X
        case "proportionGreaterThanOrEqualTo":
            comparisons = data[:, None] >= X
        case "proportionLessThanOrEqualTo":
            comparisons = data[:, None] <= X
        case "proportionLessThan":
            comparisons = data[:, None] < X

    return [
        {"x": x, "y": count / len(data)} for x, count in zip(X, comparisons.sum(axis=0))
    ]


@gamregression.field("probability")
def resolve_gam_probability(gam, *_, x=None):
    return ai.gam_prob(gam["model"], gam["column"], x)


schema = make_executable_schema(
    type_defs,
    query,
    team,
    player,
    aitype,
    gumbel,
    proportions,
    gamregression,
    convert_names_case=True,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/graphql", GraphQL(schema, debug=True))

if __name__ == "__main__":
    uvicorn.run("main:app")
