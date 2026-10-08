"""A tiny, transparent K-nearest-neighbors classifier for the demo."""

TRAINING_DATA = [
    {"hours": 0.7, "result": "retry"},
    {"hours": 1.3, "result": "retry"},
    {"hours": 2.1, "result": "retry"},
    {"hours": 2.8, "result": "pass"},
    {"hours": 3.4, "result": "retry"},
    {"hours": 4.1, "result": "pass"},
    {"hours": 4.8, "result": "pass"},
    {"hours": 5.3, "result": "retry"},
    {"hours": 6.0, "result": "pass"},
    {"hours": 6.7, "result": "pass"},
    {"hours": 7.5, "result": "pass"},
]


def predict_result(hours: float, k: int) -> dict:
    """Return the majority label among the k closest training examples."""
    nearest = sorted(
        TRAINING_DATA,
        key=lambda example: abs(example["hours"] - hours),
    )[:k]
    passed = sum(example["result"] == "pass" for example in nearest)
    label = "pass" if passed > k / 2 else "retry"
    vote_percent = round(max(passed, k - passed) / k * 100)

    return {
        "label": label,
        "confidence": vote_percent,
        "passed_neighbors": passed,
        "retry_neighbors": k - passed,
        "neighbors": [example["hours"] for example in nearest],
        "training_data": TRAINING_DATA,
    }
