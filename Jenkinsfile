pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "crypticroom-testJenkins"
        DOCKER_CONTAINER_NAME = "crypticroom-testJenkins"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${env.DOCKER_IMAGE}")
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Stop and remove any existing container
                    sh """
                    if [ \$(docker ps -q -f name=${env.DOCKER_CONTAINER_NAME}) ]; then
                        docker stop ${env.DOCKER_CONTAINER_NAME}
                        docker rm ${env.DOCKER_CONTAINER_NAME}
                    fi
                    """
                    // Run the new container
                    docker.image("${env.DOCKER_IMAGE}").run('-p 3000:3000 --name ${env.DOCKER_CONTAINER_NAME}')
                }
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
