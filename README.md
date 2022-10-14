# (R)ather (N)ice (D)ynamite Bot

Implements various strategies to counter multiple bot types and selects them stochastically based on confidence.

The primary goal is to be heavily predictive while appearing random, which is achieved through importance sampling both strategies and generic moves.

`/tests` contains a few basic bots to test against, which are mainly useful for detecting fatal flaws in edge case scenarios (I would not recommend tuning strategies on these).
