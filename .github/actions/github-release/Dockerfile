FROM golang:1.14-alpine

ENV HUB_VERSION 2.14.2
ENV HUB_INSTALLER https://github.com/github/hub/raw/master/script/get

RUN apk add --no-cache \
        bash \
        coreutils \
        curl \
        git \
        tar \
        xz && \
    curl -fsSL ${HUB_INSTALLER} | bash -s ${HUB_VERSION}

COPY hub-wrapper /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/hub-wrapper"]
