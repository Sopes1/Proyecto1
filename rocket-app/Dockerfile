# Dockerfile
FROM rust:1.55 AS build-container

# needed for run a rocket app
RUN rustup update nightly
RUN rustup default nightly

# setup dummie project
WORKDIR /build
RUN USER=root cargo new rocket-app
WORKDIR /build/rocket-app

# copying and installing the dependencies
COPY Cargo.toml Cargo.lock ./
RUN cargo fetch
COPY ./.env .
COPY ./Rocket.toml .
# coping the app base code and build project
COPY src ./src


ENV ROCKET_ENV=production
ENV DATABASE_URL=mysql://root:1234@104.198.201.11/sopesP1
ENV ROCKET_DATABASES="{ rocket_app = { url = \"$DATABASE_URL\" } }"
RUN cargo build --release


FROM ubuntu:18.04

RUN apt-get update && apt-get install -y libmysqlclient-dev build-essential
RUN apt-get install -y libmariadb-dev
ENV DATABASE_URL=mysql://root:1234@104.198.201.11/sopesP1

COPY --from=build-container /build/rocket-app/target/release/rocket-app .

USER 1000

EXPOSE 8000

CMD ["./rocket-app"]