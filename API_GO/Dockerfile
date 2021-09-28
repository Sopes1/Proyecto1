FROM golang:latest

RUN mkdir /apiGolang


##RUN cd /apiGolang && git clone --branch juanpa https://JuanPa09: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@github.com/Sopes1/Proyecto1.git

WORKDIR /apiGolang
#Para exportar modulos de go
RUN export GO111MODULE=on
RUN go get -u github.com/gorilla/mux
RUN go get go.mongodb.org/mongo-driver
RUN go get -u github.com/go-sql-driver/mysql
RUN go get cloud.google.com/go/pubsub
RUN go get github.com/joho/godotenv

#Expuesto en el puerto 3000
EXPOSE 3000

#Compilar go
##RUN cd /apiGolang/Proyecto1/API_GO
COPY . . 
ENV GOOGLE_APPLICATION_CREDENTIALS="./key.json"
RUN go build

#Nombre del archivo que tiene compilado go
#ENTRYPOINT [ "/apiGolang/Proyecto1/API_GO/quickstart" ]
ENTRYPOINT [ "/apiGolang/quickstart" ]