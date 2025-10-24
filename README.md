# Seeker Nexus AI

A combined backend (Python) and frontend (Vite/React + TypeScript) project to provide AI-powered career assistance and job matching.

## Repository layout

- `Backend/` - Python services, agents, parsers, and API. See `Backend/README.md` (if present) and `Backend/requirements.txt`.
- `Frontend/` - Vite + React + TypeScript UI. Uses Vite for development and Supabase integrations under `Frontend/supabase/`.

## Quick start

Prerequisites:

- Python 3.10+ (or compatible)
- Node.js 18+ (or the node version recommended by the project)
- Git

### Backend (local)

1. Open a terminal and change to the `Backend` folder:

```bash
cd Backend
```

2. Create a virtual environment and activate it (bash):

```bash
python -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the API or main module (project may provide `main.py` or test scripts):

```bash
python main.py
# or
python test_api.py
```

Notes:
- There are `setup.bat` and `setup.sh` scripts in `Backend/` to automate setup on Windows and Unix-like systems.
- If you use an IDE, ensure it uses the `.venv` or your chosen virtual environment.

### Frontend (local)

1. Change to the `Frontend` folder:

```bash
cd Frontend
```

2. Install dependencies (npm is shown here; you can use `pnpm`/`yarn` if preferred):

```bash
npm install
```

3. Start the dev server (Vite):

```bash
npm run dev
```

Open the app in a browser at the address shown by Vite (usually `http://localhost:5173`).

## Supabase

This project contains Supabase functions and migrations in `Frontend/supabase/`. Follow Supabase docs for deploying functions and applying migrations.

## Useful tips

- The repository `.gitignore` contains common patterns for Python, Node, IDEs, and environment files.
- Keep secrets out of the repo; use environment variables or your preferred secret store.

## Contributors & contribution notes

This is a closed departmental project. Contributor usernames will be added to this file by the project maintainers — no public contribution details are listed here.

## Contact

If you need help, open an issue describing the environment and steps to reproduce.
