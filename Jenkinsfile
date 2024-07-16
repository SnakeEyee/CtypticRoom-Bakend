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
                    sh "docker run -p 3000:3000 --name ${env.DOCKER_CONTAINER_NAME} ${env.DOCKER_IMAGE}"
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
