FROM golang:latest

RUN mkdir /apiGolang
WORKDIR /apiGolang

RUN export GO111MODULE=on
RUN go mod init quickstart
RUN go mod tidy
RUN go get -u github.com/gorilla/mux
RUN go get go.mongodb.org/mongo-driver
RUN go get -u github.com/go-sql-driver/mysql
RUN cd /apiGolang && git clone --branch juanpa https://JuanPa09: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@github.com/Sopes1/Proyecto1.git

EXPOSE 3000

RUN cd /apiGolang/Proyecto1/API_GO && go run main.go



##ENTRYPOINT [ "/apiGolang/Proyecto1/API_GO/main" ]