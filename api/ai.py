from scipy.stats import gumbel_r, poisson
import pandas as pd
import data
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import numpy as np
from models import LogisticRegressionWithSingleClassHandling
from pygam import LinearGAM, PoissonGAM

models = {}


def get_models(player_id):
    if exists := models.get(player_id):
        return exists

    try:
        player = {
            "games": pd.read_csv(f"cache/player/{player_id}_games.csv"),
            "stats": pd.read_csv(f"cache/player/{player_id}_stats.csv"),
        }
        new = {
            "data": player,
            "gumbel": {
                column: gumbel_r.fit(X)
                for column, X in player["games"][
                    ["score", "assists", "rebounds"]
                ].items()
            },
            "linear": train_linear_regression(player["games"]),
            "logistic": train_logistic_regression(player["games"]),
            "gam": {
                "linear": train_linear_gam(player["games"]),
                "poisson": train_poisson_gam(player["games"]),
            },
        }

        models[player_id] = new

        return new
    except FileNotFoundError:
        data.save_player_data(player_id)
        return get_models(
            player_id,
        )


def preprocess(data, targets):
    columns = [
        "location",
        "minutes_played",
        "field_goals",
        "field_goals_attempted",
        "three_point_field_goals",
        "three_point_field_goals_attempted",
        "free_throws",
        "free_throws_attempted",
        "steals",
        "blocks",
        "turnovers",
        "fouls",
    ]
    X = data[columns]
    X_train, X_test = train_test_split(X, test_size=0.3)
    train_indices = X_train.index
    test_indices = X_test.index

    column_transformer = ColumnTransformer(
        [
            (
                "categories",
                Pipeline(
                    [
                        ("Imputer", SimpleImputer(strategy="most_frequent")),
                        ("Transformer", OneHotEncoder()),
                    ]
                ),
                ["location"],
            )
        ],
        remainder=Pipeline(
            [
                ("Imputer", SimpleImputer(strategy="mean")),
                ("Transformer", StandardScaler()),
            ]
        ),
    )

    return (
        {
            "transformer": column_transformer,
            "X_train": X_train,
            "X_test": X_test,
        }
        | {f"y_{column}_train": data[column][train_indices] for column in targets}
        | {f"y_{column}_test": data[column][test_indices] for column in targets}
    )


def train_regression(model, data, targets):
    data = preprocess(data, targets)
    models = {
        column: Pipeline(
            [
                ("Transformer", data["transformer"]),
                ("Regression", model()),
            ]
        ).fit(data["X_train"], data[f"y_{column}_train"])
        for column in targets
    }

    return {f"model_{column}": models[column] for column in targets} | data


def train_logistic_regression(data):
    data = data.assign(
        score_greater_than_mean=data["score"] > data["score"].mean(),
        score_greater_than_median=data["score"] > data["score"].median(),
        score_greater_than_mode=data["score"] > data["score"].mode()[0],
        score_greater_than_max=data["score"] > data["score"].max(),
        score_greater_than_min=data["score"] > data["score"].min(),
        assists_greater_than_mean=data["assists"] > data["assists"].mean(),
        assists_greater_than_median=data["assists"] > data["assists"].median(),
        assists_greater_than_mode=data["assists"] > data["assists"].mode()[0],
        assists_greater_than_max=data["assists"] > data["assists"].max(),
        assists_greater_than_min=data["assists"] > data["assists"].min(),
        rebounds_greater_than_mean=data["rebounds"] > data["rebounds"].mean(),
        rebounds_greater_than_median=data["rebounds"] > data["rebounds"].median(),
        rebounds_greater_than_mode=data["rebounds"] > data["rebounds"].mode()[0],
        rebounds_greater_than_max=data["rebounds"] > data["rebounds"].max(),
        rebounds_greater_than_min=data["rebounds"] > data["rebounds"].min(),
    ).drop(columns=["score", "rebounds", "assists"])
    targets = [
        "score_greater_than_mean",
        "score_greater_than_median",
        "score_greater_than_mode",
        "score_greater_than_max",
        "score_greater_than_min",
        "assists_greater_than_mean",
        "assists_greater_than_median",
        "assists_greater_than_mode",
        "assists_greater_than_max",
        "assists_greater_than_min",
        "rebounds_greater_than_mean",
        "rebounds_greater_than_median",
        "rebounds_greater_than_mode",
        "rebounds_greater_than_max",
        "rebounds_greater_than_min",
    ]
    return train_regression(LogisticRegressionWithSingleClassHandling, data, targets)


def train_linear_regression(data):
    targets = ["score", "assists", "rebounds"]
    return train_regression(LinearRegression, data, targets)


def train_linear_gam(data):
    targets = ["score", "assists", "rebounds"]
    return train_regression(LinearGAM, data, targets)


def train_poisson_gam(data):
    targets = ["score", "assists", "rebounds"]
    return train_regression(PoissonGAM, data, targets)


def linear_helper(y_pred, y_true, op):
    comparison = op(y_pred)
    cm = confusion_matrix(op(y_true), comparison)
    return {
        "y": comparison.mean(),
        "true_negative": cm[0][0],
        "false_positive": cm[0][1],
        "false_negative": cm[1][0],
        "true_positive": cm[1][1],
    }


def regression(model, player_id, column):
    y_pred = model[f"model_{column}"].predict(model["X_test"])
    y_true = model[f"y_{column}_test"]
    stats = get_models(player_id)["data"]["stats"][stats["season"] == "career"]
    return {
        "greater_than_mean": linear_helper(
            y_pred, y_true, lambda x: x > stats[f"mean_{column}"]
        ),
        "less_than_or_equal_to_mean": linear_helper(
            y_pred, y_true, lambda x: x <= stats[f"mean_{column}"]
        ),
        "greater_than_median": linear_helper(
            y_pred, y_true, lambda x: x > stats[f"median_{column}"]
        ),
        "less_than_or_equal_to_median": linear_helper(
            y_pred, y_true, lambda x: x <= stats[f"median_{column}"]
        ),
        "greater_than_mode": linear_helper(
            y_pred, y_true, lambda x: x > stats[f"mode_{column}"]
        ),
        "less_than_or_equal_to_mode": linear_helper(
            y_pred, y_true, lambda x: x <= stats[f"mode_{column}"]
        ),
        "greater_than_max": linear_helper(
            y_pred, y_true, lambda x: x > stats[f"max_{column}"]
        ),
        "less_than_or_equal_to_max": linear_helper(
            y_pred, y_true, lambda x: x <= stats[f"max_{column}"]
        ),
        "greater_than_min": linear_helper(
            y_pred, y_true, lambda x: x > stats[f"min_{column}"]
        ),
        "less_than_or_equal_to_min": linear_helper(
            y_pred, y_true, lambda x: x <= stats[f"min_{column}"]
        ),
    }


def gam_prob(model, column, x):
    y_pred = model[f"model_{column}"].predict(model["X_test"][-1])[0]
    return poisson.pmf(x, y_pred)


def logistic(player_id, column):
    X = get_models(player_id)["logistic"]["X_test"]
    log_models = get_models(player_id)["logistic"]
    result = {}
    for op in [
        "greater_than_mean",
        "greater_than_median",
        "greater_than_mode",
        "greater_than_max",
        "greater_than_min",
        "less_than_or_equal_to_mean",
        "less_than_or_equal_to_median",
        "less_than_or_equal_to_mode",
        "less_than_or_equal_to_max",
        "less_than_or_equal_to_min",
    ]:
        inner_op = (
            op if op[0] == "g" else op.replace("less_than_or_equal_to", "greater_than")
        )
        model = log_models[f"model_{column}_{inner_op}"]
        pred = model.predict(X)
        cm = [
            [x, y] if op[0] == "g" else [y, x]
            for x, y in confusion_matrix(
                log_models[f"y_{column}_{inner_op}_test"], pred
            )[:: (1 if op[0] == "g" else -1)]
        ]
        result[op] = {
            "true_negative": cm[0][0],
            "false_positive": cm[0][1],
            "false_negative": cm[1][0],
            "true_positive": cm[1][1],
            "y": (pred if op[0] == "g" else np.invert(pred)).mean(),
        }

    return result


def gumbel(loc, scale, X, op):
    match op:
        case "probGreaterThan":
            return 1 - gumbel_r.cdf(X, loc, scale)
        case "probGreaterThanOrEqualTo":
            return 1 - gumbel_r.cdf(X - 0.1, loc, scale)
        case "probLessThanOrEqualTo":
            return gumbel_r.cdf(X, loc, scale)
        case "probLessThan":
            return gumbel_r.cdf(X - 0.1, loc, scale)


def confusion_matrix(y_true, y_pred):
    tp = 0
    fp = 0
    tn = 0
    fn = 0
    for true, pred in zip(y_true, y_pred):
        if true and pred:
            tp += 1
        elif true and not pred:
            fn += 1
        elif not true and pred:
            fp += 1
        elif not true and not pred:
            tn += 1
    return [[tn, fp], [fn, tp]]
