FROM rust:1.55
# needed for run a rocket app
RUN rustup update nightly
RUN rustup default nightly
WORKDIR /usr/src/api-rust
COPY . .
RUN cargo install --path .
CMD ["api-rust"]
