# erstellt nach folgendem Beispiel: https://sourcery.ai/blog/python-docker/

FROM python:3.12-slim AS base

RUN python -m pip install --upgrade pip

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1


FROM base AS python-deps

# Install pipenv and compilation dependencies
RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc && apt-get install -y libcairo2-dev pkg-config python3-dev

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy


FROM base AS runtime

# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# set home dir
WORKDIR /home/appuser


# Install application into container
COPY . .

CMD ["python", "-u", "wsgi.py"]