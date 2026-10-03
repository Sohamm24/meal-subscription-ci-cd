pipeline {

    agent any

    environment {
        // Cloudflare Worker URL — sourced from terraform.tfstate subdomain.url
        CLOUDFLARE_WORKER_URL = 'https://jenkins-selenium-demo.sohamnarvankar24.workers.dev'
        PATH = "/usr/local/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {

        // ─────────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ─────────────────────────────────────────────────────────
        // Build: pull/build all Docker images. The frontend image
        // is built with VITE_API_URL so the React bundle talks to
        // the live Cloudflare Worker, not localhost.
        // ─────────────────────────────────────────────────────────
        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        // ─────────────────────────────────────────────────────────
        // Test: spin up frontend + backend + selenium.
        // The frontend proxies /api to the local backend container,
        // making test execution 100% self-contained and reliable.
        // ─────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                sh """
                    docker compose up \
                        --abort-on-container-exit \
                        --exit-code-from selenium
                """
            }
        }

        // ─────────────────────────────────────────────────────────
        // Deploy Backend: push the Cloudflare Worker using wrangler.
        // Runs inside the backend container image where source & node_modules exist.
        // ─────────────────────────────────────────────────────────
        stage('Deploy Backend') {
            steps {
                withCredentials([
                    string(credentialsId: 'CLOUDFLARE_API_TOKEN', variable: 'CLOUDFLARE_API_TOKEN')
                ]) {
                    sh '''
                        docker compose run --rm \
                            -e CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
                            backend \
                            npx wrangler deploy --minify
                    '''
                }
            }
        }

        // ─────────────────────────────────────────────────────────
        // Deploy Frontend: push the frontend to Vercel (production).
        // Runs inside the frontend-builder container image where source exists.
        // ─────────────────────────────────────────────────────────
        stage('Deploy Frontend') {
            steps {
                withCredentials([
                    string(credentialsId: 'VERCEL_TOKEN',      variable: 'VERCEL_TOKEN'),
                    string(credentialsId: 'VERCEL_ORG_ID',     variable: 'VERCEL_ORG_ID'),
                    string(credentialsId: 'VERCEL_PROJECT_ID', variable: 'VERCEL_PROJECT_ID')
                ]) {
                    sh '''
                        docker compose run --rm \
                            -e VERCEL_TOKEN="$VERCEL_TOKEN" \
                            -e VERCEL_ORG_ID="$VERCEL_ORG_ID" \
                            -e VERCEL_PROJECT_ID="$VERCEL_PROJECT_ID" \
                            frontend-builder \
                            sh -c "npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN && npx vercel build --prod --token=$VERCEL_TOKEN && npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN"
                    '''
                }
            }
        }

    }

    // ─────────────────────────────────────────────────────────────
    // Always tear down Docker containers whether tests pass or fail.
    // ─────────────────────────────────────────────────────────────
    post {
        always {
            sh 'docker compose down --volumes --remove-orphans || true'
        }
        success {
            echo 'Pipeline succeeded — frontend on Vercel, backend on Cloudflare Workers.'
        }
        failure {
            echo 'Pipeline failed — check the Test stage logs above.'
        }
    }

}