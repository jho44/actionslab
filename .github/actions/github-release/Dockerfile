FROM golang:1.14-buster

RUN apt-get clean \
        && apt-get update \
        && apt-get install --yes --no-install-recommends hub

COPY hub-wrapper /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/hub-wrapper"]
