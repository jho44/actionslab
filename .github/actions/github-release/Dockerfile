FROM golang:1.14-alpine

# There's an apk hub package in edge. Worth keeping an eye on
ENV HUB_VERSION 2.14.2
ENV HUB_URI https://github.com/github/hub/releases/download/v$HUB_VERSION
ENV HUB hub-linux-amd64-$HUB_VERSION

RUN apk add --no-cache bash curl xz zip basename && \
    sh -c "curl --silent -L ${HUB_URI}/${HUB}.tgz > ${HUB}.tgz" && \
    sh -c "tar xvzf ${HUB}.tgz" && \
    sh -c "mv ${HUB}/bin/hub /usr/local/bin/" && \
    sh -c "rm -rf ${HUB} ${HUB}.tgz"

COPY hub-wrapper /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/hub-wrapper"]
