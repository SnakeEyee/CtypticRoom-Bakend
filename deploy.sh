#!/bin/bash

# Variables
IMAGE_NAME="crypticroom-v1"
CONTAINER_NAME="crypticroom-v1"
PORT_MAPPING="3030:3030"
PASSWORD=SSHPaSSW0rd2024
SERVER="root@45.8.148.49"


# Use sshpass to handle the password and rsync to copy files
sshpass -p "$PASSWORD" rsync -avz --exclude-from='.gitignore' . $SERVER:/var/www/DevOops

REMOTE_COMMANDS=$(
    cat << EOF
    cd /var/www/DevOops

    docker build -t $IMAGE_NAME .


    docker stop $CONTAINER_NAME


    docker rm $CONTAINER_NAME

    docker run -d -p $PORT_MAPPING --name $CONTAINER_NAME $IMAGE_NAME
EOF
)

sshpass -p "$PASSWORD" ssh $SERVER "$REMOTE_COMMANDS"
