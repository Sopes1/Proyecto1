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
RUN cargo build --release


FROM ubuntu:18.04

RUN apt-get update && apt-get install -y libmysqlclient-dev build-essential
RUN apt-get install -y libmariadb-dev

COPY --from=build-container /build/rocket-app/target/release/rocket-app .

USER 1000

EXPOSE 8000

CMD ["./rocket-app"]