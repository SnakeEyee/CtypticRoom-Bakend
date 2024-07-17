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
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${env.DOCKER_IMAGE} ."
            }
        }

        stage('Run Docker Container') {
            steps {
                sh """
                if [\$(docker ps -q -f name=${env.DOCKER_CONTAINER_NAME})]; then
                    docker stop ${env.DOCKER_CONTAINER_NAME}
                    docker rm ${env.DOCKER_CONTAINER_NAME}
                fi
                """
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
