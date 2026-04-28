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

                bat '''
                if not exist package.json exit /b 1
                if not exist app exit /b 1
                if not exist components exit /b 1
                if not exist lib exit /b 1
                if not exist types exit /b 1
                '''
            }
        }

        stage('Show Project Summary') {
            steps {
                echo 'Race Nutrition Tracker project structure looks valid.'
                echo 'This pipeline confirms that the GitHub project contains the required Expo app folders and files.'
            }
        }
    }
}