pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "crypticroom-testjenkins"
        DOCKER_CONTAINER_NAME = "crypticroom-testjenkins"
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
                    def envContent = """
                    NODE_ENV=production
                    PORT=3030
                    DB_HOST=your-db-host
                    DB_USER=your-db-user
                    DB_PASS=your-db-pass
                    """
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
                    CONTAINER_NAME="crypticroom-testjenkins"

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
                sh "docker run -d -p 3000:3000 --name ${env.DOCKER_CONTAINER_NAME} ${env.DOCKER_IMAGE}"
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
