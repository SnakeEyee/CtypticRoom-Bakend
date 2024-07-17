pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "crypticroom-testJenkins"
        DOCKER_CONTAINER_NAME = "crypticroom-testJenkins"
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
                sh "docker run -p 3000:3000 --name ${env.DOCKER_CONTAINER_NAME} ${env.DOCKER_IMAGE}"
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
