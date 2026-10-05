FROM rust:1.94-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY signal ./signal
COPY stun ./stun
COPY turn ./turn
RUN cargo build --release --locked

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends coturn ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/target/release/gamelink-server /usr/local/bin/gamelink-server
ENV GAMELINK_RUNTIME_DIR=/run/gamelink GAMELINK_BIND=0.0.0.0:8080
EXPOSE 8080 3478/tcp 3478/udp 3479/tcp 3479/udp
ENTRYPOINT ["/usr/local/bin/gamelink-server"]
