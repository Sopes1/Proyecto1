FROM golang:latest

RUN mkdir /apiGolang

# COPY github_key .
# RUN eval $(ssh-agent) && \
#     ssh-add github_key && \
#     ssh-keyscan -H github.com >> /etc/ssh/ssh_known_hosts
#RUN git clone git@github.com:Sopes1/Proyecto1.git /apiGolang


RUN cd /apiGolang && git clone --branch juanpa https://JuanPa09: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@github.com/Sopes1/Proyecto1.git

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
RUN cd /apiGolang/Proyecto1/API_GO
COPY . . 
ENV GOOGLE_APPLICATION_CREDENTIALS="./key.json"
RUN go build

#Nombre del archivo que tiene compilado go
ENTRYPOINT [ "/apiGolang/Proyecto1/API_GO/quickstart" ]




#WORKDIR /apiGolang

#RUN export GO111MODULE=on
#RUN go get -u github.com/gorilla/mux
#RUN go mod init quickstart
#RUN go get go.mongodb.org/mongo-driver
#RUN go get git@github.com:Sopes1/Proyecto1/API_GO/main


#RUN cd /apiGolang/Proyecto1/API_GO && go build

#EXPOSE 3000

#ENTRYPOINT [ "/apiGolang/Proyecto1/API_GO" ]