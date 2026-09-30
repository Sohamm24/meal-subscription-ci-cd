pipeline {

    agent any

    environment {
        // Cloudflare Worker URL — sourced from terraform.tfstate subdomain.url
        CLOUDFLARE_WORKER_URL = 'https://jenkins-selenium-demo.sohamnarvankar24.workers.dev'
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
                sh """
                    docker compose build \
                        --build-arg VITE_API_URL=${CLOUDFLARE_WORKER_URL}
                """
            }
        }

        // ─────────────────────────────────────────────────────────
        // Test: spin up frontend + selenium. The selenium container
        // runs pytest and exits. --exit-code-from selenium makes
        // docker compose return selenium's exit code so Jenkins
        // marks the build FAILED if any test fails.
        // ─────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                sh """
                    VITE_API_URL=${CLOUDFLARE_WORKER_URL} \
                    docker compose up \
                        --abort-on-container-exit \
                        --exit-code-from selenium
                """
            }
        }

        // ─────────────────────────────────────────────────────────
        // Deploy Backend: push the Cloudflare Worker using wrangler.
        // Requires CLOUDFLARE_API_TOKEN Jenkins credential.
        // ─────────────────────────────────────────────────────────
        stage('Deploy Backend') {
            steps {
                withCredentials([
                    string(credentialsId: 'CLOUDFLARE_API_TOKEN', variable: 'CLOUDFLARE_API_TOKEN')
                ]) {
                    dir('backend') {
                        sh 'npm ci'
                        sh 'npx wrangler deploy --minify'
                    }
                }
            }
        }

        // ─────────────────────────────────────────────────────────
        // Deploy Frontend: push the frontend to Vercel (production).
        // Requires VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
        // Jenkins credentials.
        // ─────────────────────────────────────────────────────────
        stage('Deploy Frontend') {
            steps {
                withCredentials([
                    string(credentialsId: 'VERCEL_TOKEN',      variable: 'VERCEL_TOKEN'),
                    string(credentialsId: 'VERCEL_ORG_ID',     variable: 'VERCEL_ORG_ID'),
                    string(credentialsId: 'VERCEL_PROJECT_ID', variable: 'VERCEL_PROJECT_ID')
                ]) {
                    dir('frontend') {
                        sh """
                            npx vercel pull --yes \
                                --environment=production \
                                --token=${VERCEL_TOKEN}

                            npx vercel build --prod \
                                --token=${VERCEL_TOKEN}

                            npx vercel deploy --prebuilt --prod \
                                --token=${VERCEL_TOKEN}
                        """
                    }
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