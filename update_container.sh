#!/bin/bash

# Variables
IMAGE_NAME="crypticroom-testjenkins"
CONTAINER_NAME="crypticroom-testjenkins"

# Build the new image
# docker build -t $IMAGE_NAME .


if [ $(docker ps -a -q -f name=$CONTAINER_NAME) ]; then
    echo "Container $CONTAINER_NAME exists. Removing it..."
    # Stop the container if it is running
    if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
        docker stop $CONTAINER_NAME
    fi
    # Remove the container
    docker rm $CONTAINER_NAME
    echo "Container $CONTAINER_NAME removed."
else
    echo "Container $CONTAINER_NAME does not exist."
fi

# Stop the existing container
#docker stop $CONTAINER_NAME

# Remove the existing container
# docker rm $CONTAINER_NAME

# Run a new container with the updated image
# docker run -d -p $PORT_MAPPING --name $CONTAINER_NAME $IMAGE_NAME
