pipeline {
    agent any

    tools {
        nodejs 'Node 20'
    }

    environment {
        CI = 'true'
        EXPO_NO_TELEMETRY = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling project code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Expo project dependencies...'
                bat 'npm install'
            }
        }

        stage('Check Expo Project') {
            steps {
                echo 'Checking that Expo dependencies match the SDK...'
                bat 'npx expo install --check'
            }
        }

        stage('TypeScript Check') {
            steps {
                echo 'Checking TypeScript for app errors...'
                bat 'npx tsc --noEmit'
            }
        }

        stage('Project Summary') {
            steps {
                echo 'Race Nutrition Tracker build completed successfully.'
                echo 'This confirms the Expo app installs and passes TypeScript validation.'
            }
        }
    }

    post {
        success {
            echo 'Build passed.'
        }

        failure {
            echo 'Build failed. Check the console output above for dependency or TypeScript errors.'
        }
    }
}