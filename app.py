"""Small Flask API and website server for the ML Interview Prep Lab."""

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from model import predict_result

ROOT = Path(__file__).resolve().parent
app = Flask(__name__)


@app.get("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.get("/styles.css")
def styles():
    return send_from_directory(ROOT, "styles.css")


@app.get("/app.js")
def javascript():
    return send_from_directory(ROOT, "app.js")


@app.post("/api/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    try:
        hours = float(payload["hours"])
        k = int(payload["k"])
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Please provide a number of hours and a whole-number k."}), 400

    if not 0 <= hours <= 8:
        return jsonify({"error": "Study hours must be between 0 and 8."}), 400
    if not 1 <= k <= 7 or k % 2 == 0:
        return jsonify({"error": "k must be an odd number from 1 to 7."}), 400

    return jsonify(predict_result(hours, k))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
