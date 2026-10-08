# ML Interview Prep Lab

A beginner-friendly project with a working **Python + Flask backend** and an interactive browser interface. The page sends study hours and `k` to Python; Python calculates the K-nearest-neighbors (KNN) prediction and returns it to the page.

## What you'll learn

- Python functions, lists, dictionaries, sorting, and a Flask API
- How browser JavaScript sends JSON to a backend and handles the response
- HTML page structure, CSS layout, and interactive controls
- KNN, labeled examples, majority voting, and model limitations
- How to publish a Python web app from a GitHub repository

## Run it on your computer

Install Python 3.10 or newer and VS Code. In VS Code, open this project folder, then open **Terminal → New Terminal** and enter:

```bash
python -m venv .venv
```

Activate the environment:

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt and run `.venv\Scripts\activate.bat`.

Install dependencies and start the app:

```bash
python -m pip install -r requirements.txt
python app.py
```

Open **http://127.0.0.1:5000** in your browser. Move the sliders. The prediction should come from the Python backend. Stop the local server with `Ctrl+C` in the terminal.

## Publish it in a working state

This app needs a Python web host. GitHub stores the source code; **Render** runs the Flask app. GitHub Pages only serves static website files, so it cannot run this Python backend. Render's Flask guide uses `pip install -r requirements.txt` as the build command and `gunicorn app:app` as the start command. [Render Flask deployment guide](https://render.com/docs/deploy-flask) · [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

### 1. Put the project on GitHub

1. Sign in to GitHub and create a repository named `ml-interview-prep-lab`.
2. In VS Code, open this project folder and choose **Terminal → New Terminal**.
3. Run these commands, replacing `YOUR-USERNAME` with your GitHub username:

   ```bash
   git init
   git add .
   git commit -m "Add Python ML interview prep lab"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ml-interview-prep-lab.git
   git push -u origin main
   ```

GitHub may ask you to sign in or authorize Git Credential Manager. If the repository already has a README created on GitHub and the push is rejected, share the exact message and I can guide you through syncing it.

### 2. Deploy the Python app on Render

1. Sign in to Render and choose **New → Web Service**.
2. Connect your GitHub account if asked, then select the `ml-interview-prep-lab` repository.
3. Set Runtime to **Python 3**, Build command to `pip install -r requirements.txt`, and Start command to `gunicorn app:app`.
4. Choose **Free** instance if offered for your account and region, then choose **Deploy Web Service**.
5. Wait for the build and deploy to finish, then open the `onrender.com` URL shown on the service page.

The repository includes `render.yaml`; Render may offer a Blueprint setup that reads settings from that file. Otherwise, enter the settings above in the regular Web Service form.

### 3. Check the deployed backend

Open the live site and move the hours slider. If the prediction changes, the browser is reaching the Python API. You can also open browser developer tools → **Network**, select a request to `/api/predict`, and inspect its JSON response.

On a free service, the first visit after inactivity may take a little while while the service starts. If deployment fails, check the Render service's Events or Logs; the most common cause is a typo in the build or start command.

## Suggested VS Code extensions

- **Python** (Microsoft) — Python language support and interpreter selection.
- **Pylance** — Python autocomplete and code navigation.
- **Live Server** — for static sites; use `python app.py` to run this Flask version.
- **Prettier - Code formatter** — formats HTML, CSS, and JavaScript.

## One-day build schedule

| Time | Task |
|---|---|
| 30 min | Open the project and run the Flask server locally |
| 60 min | Read `model.py`; trace how it sorts examples and takes the nearest k |
| 45 min | Read `app.py`; find the `/api/predict` route and input checks |
| 60 min | Follow the browser request in `app.js` from `fetch()` to the updated result |
| 45 min | Change the example data or add a quiz question |
| 30 min | Try edge cases and check the browser layout on a narrow screen |
| 60 min | Push to GitHub and deploy on Render |
| 30 min | Practice explaining the project out loud |

## Interview explanation

> “I built a small KNN learning demo with a Python Flask backend. The browser sends study hours and k as JSON to an API route. Python checks the input, sorts labeled training examples by distance, and predicts the majority label among the nearest k examples. The page visualizes the result and includes a quiz. It’s an educational demo, not a meaningful exam predictor, because study time alone is not enough to predict exam results.”

## Project files

- `app.py` — Flask website and JSON API routes.
- `model.py` — training examples and KNN prediction logic.
- `index.html`, `styles.css`, `app.js` — browser interface and interactions.
- `requirements.txt` — Python packages required to run the app.
- `render.yaml` — optional Render deployment settings.

## Important note

The sample data is made up for learning. The model demonstrates nearest-neighbor classification; its “confidence” is the winning neighbors' vote share, not a calibrated probability.
