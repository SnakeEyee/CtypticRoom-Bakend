#!/bin/bash

# Variables
IMAGE_NAME="crypticroom-v1"
CONTAINER_NAME="crypticroom-v1"
PORT_MAPPING="3030:3030"

# Build the new image
docker build -t $IMAGE_NAME .

# Stop the existing container
docker stop $CONTAINER_NAME

# Remove the existing container
docker rm $CONTAINER_NAME

# Run a new container with the updated image
docker run -d -p $PORT_MAPPING --name $CONTAINER_NAME $IMAGE_NAME
