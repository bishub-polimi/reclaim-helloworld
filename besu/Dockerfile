FROM hyperledger/besu:latest

USER root

RUN apt-get update && apt-get install -y curl

COPY ./besu /data

ENTRYPOINT [ "besu" ]
CMD ["--config-file=/data/config.toml"]

EXPOSE 8545