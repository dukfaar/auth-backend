node {
    checkout scm
    
    docker.image('node:alpine').inside {
        sh 'npm set registry https://npm-registry.dukfaar.com'
        
        stage('Install') {
            sh 'npm install'
        }
        
        stage('Test') {
            sh 'npm test'
        }
        
        stage('Build') {
            sh 'npm run build'
        }
    }

    if(env.BRANCH_NAME == 'master') {
        stage('Docker Build') {
            docker.build('dukfaar/auth-backend')
        }

        stage('Update Service') {
            sh 'docker service update --force auth-backend_auth-backend'
        }
    }
}