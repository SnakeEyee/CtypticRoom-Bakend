pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "crypticroom-v1"
        DOCKER_CONTAINER_NAME = "crypticroom-v1"
    }

    stages {
        stage("checkout"){
            steps{
                checkout scm
            }
        }
        stage('Create .env File') {
            steps {
                script {
                    def envContent = '''
                    PORT=3030
                    MONGO_URI=mongodb+srv://CrypticMDB:m1eKw3QeDJszg5P4@cluster0.qojgmyq.mongodb.net/CrypticTables
                    COST_fACTOR=10
                    AI_API_KEY=AIzaSyB9c4ADuL0ndLeU06GWghzCxRD56XHjEnE
                    SECRET_KEY=We$is_97.Pparazi756
                    '''
                    writeFile file: '.env', text: envContent
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${env.DOCKER_IMAGE} ."
            }
        }
        stage('Check and Remove Existing Container') {
            steps {
                script {
                    sh '''
                    #!/bin/bash

                    # Name of the Docker container
                    CONTAINER_NAME="crypticroom-v1"

                    # Check if the container exists
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
                    '''
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                sh "docker run -d -p 3030:3030 --name ${env.DOCKER_CONTAINER_NAME} ${env.DOCKER_IMAGE}"
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Optionally, you can add cleanup steps here
        }
    }
}
