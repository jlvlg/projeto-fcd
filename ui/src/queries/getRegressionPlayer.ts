import { gql } from "__generated__";

export const GET_REGRESSION_PLAYER = gql(`
  query GetRegressionPlayer($teamId: Int!, $playerId: Int!, $isLinear: Boolean!, $isLogistic: Boolean!, $isGAMLinear: Boolean!, $isGAMPoisson: Boolean!, $column: String!, $x: Int!) {
    teams(ids: [$teamId]) {
      full_name
      players(ids: [$playerId]) {
        name
        stats(seasons: ["2023-24", "2024-25"]) {
          meanScore
          medianScore
          modeScore
          maxScore
          minScore
          meanAssists
          medianAssists
          modeAssists
          maxAssists
          minAssists
          meanRebounds
          medianRebounds
          modeRebounds
          maxRebounds
          minRebounds
        }
        ai {
          linearRegression(column: $column)@include(if: $isLinear) {
            greaterThanMean {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMean {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMedian {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMedian {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMode {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMode {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMax {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMax {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMin {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMin {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
          }
          logisticRegression(column: $column)@include(if: $isLogistic) {
            greaterThanMean {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMean {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMedian {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMedian {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMode {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMode {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMax {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMax {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            greaterThanMin {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
            lessThanOrEqualToMin {
              y
              truePositive
              trueNegative
              falsePositive
              falseNegative
            }
          }
          linearGAM(column: $column)@include(if: $isGAMLinear) {
            regression {
              greaterThanMean {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMean {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMedian {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMedian {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMode {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMode {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMax {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMax {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMin {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMin {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
            }
            probability(x: $x)
          }
          poissonGAM(column: $column)@include(if: $isGAMPoisson) {
            regression {
              greaterThanMean {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMean {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMedian {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMedian {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMode {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMode {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMax {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMax {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              greaterThanMin {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
              lessThanOrEqualToMin {
                y
                truePositive
                trueNegative
                falsePositive
                falseNegative
              }
            }
            probability(x: $x)
          }
        }
      }
    }
  }
`);
