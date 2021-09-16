FROM golang:latest

RUN mkdir /apiGolang
WORKDIR /apiGolang

RUN export GO111MODULE=on
RUN go get -u github.com/gorilla/mux
RUN go mod init quickstart
RUN go get go.mongodb.org/mongo-driver
RUN cd /apiGolang && git clone --branch juanpa https://JuanPa09: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@github.com/Sopes1/Proyecto1.git

RUN cd /apiGolang/Proyecto1/API_GO/main && go build

EXPOSE 3000

ENTRYPOINT [ "/apiGolang/Proyecto1/API_GO/main/main" ]