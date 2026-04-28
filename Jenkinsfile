pipeline {
    agent any

    stages {
        stage('Checkout Project') {
            steps {
                echo 'Pulling Race Nutrition Tracker from GitHub...'
                checkout scm
            }
        }

        stage('Verify Project Files') {
            steps {
                echo 'Checking that the main project files exist...'

                sh '''
                test -f package.json
                test -d app
                test -d components
                test -d lib
                test -d types
                '''
            }
        }

        stage('Project Summary') {
            steps {
                echo 'Race Nutrition Tracker project structure looks valid.'
                echo 'Jenkins confirmed the project folders exist.'
            }
        }
    }

    post {
        success {
            echo 'Project health check passed.'
        }

        failure {
            echo 'Project health check failed.'
        }
    }
}