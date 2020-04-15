FROM golang:1.14-alpine

ENV HUB_VERSION 2.14.2
ENV HUB_URI https://github.com/github/hub/releases/download/v$HUB_VERSION
ENV HUB hub-linux-amd64-$HUB_VERSION

RUN apk add --no-cache \
        bash \
        coreutils \
        curl \
        git \
        xz && \
    curl --silent -L ${HUB_URI}/${HUB}.tgz > ${HUB}.tgz && \
    tar xvzf ${HUB}.tgz && \
    mv ${HUB}/bin/hub /usr/local/bin/ && \
    ls -l /usr/local/bin/hub && \
    rm -rf ${HUB} ${HUB}.tgz

COPY hub-wrapper /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/hub-wrapper"]
