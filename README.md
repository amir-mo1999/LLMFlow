

## Setup
The project is divided into three services:
- `server`: fastapi backend
- `promptfoo-server`: express.js backend which runs `promptfoo`
- `client`: next.js frontend


### Docker Setup

User the Docker setup if you want to simply run the application without much effort. For local development refer to the [Local Setup](#local-setup).

Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Registering a project in the [Google Cloud Platform](https://console.cloud.google.com). Refer to this guide: [guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?hl=en)


How to setup:

1. Setup env files

For the `server` and `client` create a `.env.docker` file in their respective root folders by copying and renaming the `.env.docker.template` file. For the `promptfoo-server` create a `.env` file from the `.env.template` file. Replace the secrets in the templates with your own. Most of the values may remain the same.

2. Start project:

In the root folder run these two commands:
```
docker compose build
docker compose up -d
```

3. Access application:
- `client`: http://localhost:3000/
- `backend`: http://localhost:4000/docs

### Local Setup
Prerequisites:
- [Python 3.12](https://www.python.org/downloads/release/python-3120/)
- [Pipenv](https://pipenv.pypa.io/en/latest/)
- [Node 22](https://nodejs.org/en/blog/announcements/v22-release-announce)

You may also use a different node version. However, I only tested the setup using Node 22.


How to setup:

1. Setup env files

For all three services create a `.env` file in their respective root folders by copying and renaming the `.env.template` file. Replace the secrets in the templates with your own. Most of the values may remain the same. For the env variables `GOOGLE_CLIENT_SECRET` and `GOOGLE_CLIENT_ID` in the `client` you must register a project in the Google Cloud Console [Google Cloud Platform](https://console.cloud.google.com). For that, refer to this [guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?hl=en).

2. Start `backend`

To run the `backend` you can use the VS Code debugger to start it up or run the following in the `backend` folder:
```
pipenv install
pipenv run python3.12 wsgi.py
```

3. Start `promptfoo-server`

In the `promptfoo-server` folder run:
```
npm install
npm run start
```

4. Start `client`:

In the `client` folder run:
```
npm install
npm run dev
```

5. Access application:
- `client`: http://localhost:3000/
- `backend`: http://localhost:4000/docs


## Development
If you want to develop the project make sure to first run through the [Local Setup](#local-setup).

Prerequisites:
- [pre-commit](https://pre-commit.com/)
- [pyright](https://microsoft.github.io/pyright/#/installation)
- [openapi-codegen](https://github.com/fabien0102/openapi-codegen)

Here are some useful commands to use during development:

1. Run pre-commit:

```
pre-commit run --all-files
```

2. Generate client bindings (do this after changing routes or models in the backend):
```
sh generate_client_bindings.sh
```

3. Run ESLint and Prettier:

In the `client` folder run:

```
npm run lint
npm run pretty
```
