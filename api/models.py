import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.linear_model import LogisticRegression


class LogisticRegressionWithSingleClassHandling(BaseEstimator, ClassifierMixin):
    def __init__(self):
        self.single_class_ = None
        self.model_ = None

    def fit(self, X, y):
        unique_classes = np.unique(y)
        if len(unique_classes) == 1:
            self.single_class_ = unique_classes[0]
        else:
            self.model_ = LogisticRegression()
            self.model_.fit(X, y)
        return self

    def predict(self, X):
        if self.single_class_ is not None:
            return np.full(len(X), self.single_class_)
        return self.model_.predict(X)

    def predict_proba(self, X):
        if self.single_class_ is not None:
            proba = np.zeros((len(X), 2))
            proba[:, int(self.single_class_)] = 1.0
            return proba
        return self.model_.predict_proba(X)
