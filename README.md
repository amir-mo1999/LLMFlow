## About the Project
LLM Flow is a tool designed to facilitate the process of AI development, starting at defining isolated AI use cases or functions, implementing prompts, assessing and improving prompt quality, and generating APIs to integrate AI functionality into your own applications.

See the [Features](#features) section for more detail.

## Built With
- FastAPI
- Next.js
- Express.js
- MongoDB

## Getting Started
The project is divided into three services which all have to be set up individually:
- `server`: FastAPI backend
- `promptfoo-server`: Express.js backend which runs `promptfoo`
- `client`: Next.js frontend


### Docker Setup

Use the Docker setup if you want to simply run the application without much effort. For local development refer to the [Local Setup](#local-setup).

Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Registering a project in the [Google Cloud Platform](https://console.cloud.google.com). Refer to this guide: [guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?hl=en)


How to setup:

1. Setup env files

For the `server` and `client` create a `.env.docker` file in their respective root folders by copying and renaming the `.env.docker.template` file. For the `promptfoo-server` create a `.env` file from the `.env.template` file. Replace the secrets from the templates with your own.

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

For all three services create a `.env` file in their respective root folders by copying and renaming the `.env.template` file. Replace the secrets in the templates with your own.

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

4. Execute endpoints from Swagger docs

For testing out the backend from the Swagger docs you need to first authenticate using the user and password set in the `ADMIN_USER` and `ADMIN_PASSWORD` env variables. 


## Features

### Defining AI Functions
AI Functions represent contracts between your own business logic and an LLM provider. You pass a set of parameters to them and they return a structured output.

In the web interface you can define an AI Function. You define its name, give it a description, define the parameters it accepts and select the providers that it may use:


You also define if the function returns a simple unstructured string response or a structured json response. For the latter you can define complex json objects using a json schema editor.

For the sake of evaluating the quality of an AI Function's prompts you may define Assertions and Test Cases. Assertions are used to compare against expected values or conditions. This feature uses [promptfoo](https://github.com/promptfoo/promptfoo) under the hood. There are various Assertion types to choose from, ranging from simple comparisons, to complex regex patterns, and even ones that use self defined Python or JavaScript code, which can define custom and potentially complex assertion logics. 

Test Cases refer to example data for the parameters of an AI Function. They play an integral role in asserting prompt quality. After defining a prompt, it is evaluated against these test cases using the Assertions defined within the AI Function. You may also define Assertions which are only applied to a single Test Case. You can also use AI to generate Test Cases based on the previously defined Test Cases, as well as the name and description of the AI Function.

For a start you can simply create an AI Function from one of the provided examples:


which are made robust through a set of assertions on the LLM output across example data. They allow to directly define the parameters of an AI use case and the expected output.