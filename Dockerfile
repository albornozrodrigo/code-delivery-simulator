FROM --platform=linux/arm64 golang:latest

WORKDIR /go/src

ENV PATH="/go/bin:${PATH}"

RUN apt-get update && apt-get install -y \
    build-essential \
    librdkafka-dev \
    pkg-config \
    gcc \
    libc6-dev -y

ENV CGO_ENABLED=1

CMD ["tail", "-f", "/dev/null"]
