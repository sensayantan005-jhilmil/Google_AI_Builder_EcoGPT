# 🚀 EcoGPT — Google Cloud Run Deployment Guide

This comprehensive guide walks you through deploying the full-stack **EcoGPT** application (Vite React frontend + Express backend + Google Gemini AI integration) to **Google Cloud Run**.

---

## 📋 Table of Contents
1. [Why Google Cloud Run?](#1-why-google-cloud-run)
2. [Prerequisites & Initial Setup](#2-prerequisites--initial-setup)
3. [Method 1: One-Command Deployment (Recommended)](#3-method-1-one-command-deployment-recommended)
4. [Method 2: Using the Automated Script (`deploy-cloudrun.sh`)](#4-method-2-using-the-automated-script-deploy-cloudrunsh)
5. [Method 3: Cloud Build CI/CD Pipeline](#5-method-3-cloud-build-cicd-pipeline)
6. [Method 4: Google Cloud Console UI (No CLI required)](#6-method-4-google-cloud-console-ui-no-cli-required)
7. [Configuring Environment Variables & Secrets](#7-configuring-environment-variables--secrets)
8. [Custom Domain & SSL Setup](#8-custom-domain--ssl-setup)
9. [Scaling & Cost Optimization](#9-scaling--cost-optimization)
10. [Troubleshooting & Useful Commands](#10-troubleshooting--useful-commands)

---

## 1. Why Google Cloud Run?

Google Cloud Run is a managed serverless compute platform that automatically runs containerized applications:
- **Zero Idle Cost:** Scales down to `0` instances when there is no traffic. You pay $0 when the app is not being visited.
- **Generous Free Tier:** Every month, Google provides 2 million free requests, 360,000 GB-seconds of memory, and 180,000 vCPU-seconds free of charge.
- **Instant HTTPS & Global CDN:** Free managed SSL certificates and fast global edge termination.
- **Full-Stack Single Container:** Serves the compiled Vite React frontend and the Express Gemini advisory API under one seamless origin, avoiding CORS issues.

---

## 2. Prerequisites & Initial Setup

### A. Google Cloud Account & Project
1. Log in to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `ecogpt-prod`) or select an existing one.
3. Ensure billing is enabled for your Google Cloud project.

### B. Install & Authenticate the Google Cloud SDK (`gcloud`)
If not already installed, install the CLI from [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install).

Authenticate and configure your project:
```bash
# Log in to your Google Cloud account
gcloud auth login

# Set your active project ID
gcloud config set project YOUR_PROJECT_ID
```

### C. Enable Google Cloud APIs
Run the following command to enable Cloud Run and build services:
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

---

## 3. Method 1: One-Command Deployment (Recommended)

Google Cloud Run can build your container directly in the cloud using Google Cloud Build and deploy it in a single command.

In your project root directory, run:

```bash
gcloud run deploy ecogpt \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

> **Tip:** If you haven't set up `GEMINI_API_KEY` yet, you can omit `GEMINI_API_KEY=...` and add it later in the Cloud Run web console.

Once the command finishes, Google Cloud outputs the public HTTPS URL:
```text
Service [ecogpt] revision [ecogpt-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://ecogpt-xxxxxxxx-uc.a.run.app
```

---

## 4. Method 2: Using the Automated Script (`deploy-cloudrun.sh`)

We have included a pre-configured script that guides you step-by-step:

```bash
# Make script executable
chmod +x deploy-cloudrun.sh

# Run the deployment wizard
./deploy-cloudrun.sh
```

You can also pass environment variables directly:
```bash
PROJECT_ID="your-project-id" REGION="us-central1" GEMINI_API_KEY="your-key" ./deploy-cloudrun.sh
```

---

## 5. Method 3: Automated CI/CD Pipelines (Deploy on Git Push)

This repository includes two automated CI/CD deployment setups triggered on every `git push`:

### Option A: GitHub Actions Workflow (`.github/workflows/deploy-cloudrun.yml`)
The workflow is located in `.github/workflows/deploy-cloudrun.yml` and triggers whenever you push to `main`:

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ecogpt.git
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
   - `GCP_PROJECT_ID`: Your Google Cloud Project ID.
   - `GCP_SA_KEY`: Google Cloud Service Account JSON Key (with `Cloud Run Admin` and `Service Account User` roles).
   - `GEMINI_API_KEY`: Your Gemini API Key.
3. Every subsequent `git push` will now automatically build and release a new revision to Cloud Run.

### Option B: Cloud Build Native Triggers (`cloudbuild.yaml`)
If you prefer native Google Cloud triggers:
```bash
# Submit build to Cloud Build manually:
gcloud builds submit --config=cloudbuild.yaml
```
Or connect via Console:
1. Go to **Google Cloud Console** > **Cloud Build** > **Triggers**.
2. Click **Create Trigger**, connect your GitHub repository, and select `cloudbuild.yaml`.
3. Every push to `main` will build the container and deploy to Cloud Run automatically!

---

## 6. Method 4: Google Cloud Console UI (No CLI required)

If you prefer using the browser without terminal commands:

1. Push your repository to **GitHub** or **GitLab**.
2. Go to **Cloud Run** in the Google Cloud Console.
3. Click **Create Service**.
4. Choose **Continuously deploy from a repository** (Cloud Build).
5. Select your repository and branch.
6. Under **Build configuration**, select **Dockerfile** (`/Dockerfile`).
7. Set Service Name: `ecogpt`.
8. Region: `us-central1` (or your preferred region).
9. Authentication: Check **Allow unauthenticated invocations**.
10. Under **Container, Networking, Security**:
    - Container port: `8080`
    - Memory: `512 MiB`
    - CPU: `1`
    - Environment variables:
      - `NODE_ENV` = `production`
      - `GEMINI_API_KEY` = `your_gemini_api_key`
11. Click **Create** and wait 2–3 minutes for the build to finish.

---

## 7. Configuring Environment Variables & Secrets

### Option A: Standard Environment Variables
You can update variables anytime without rebuilding:
```bash
gcloud run services update ecogpt \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY="your-api-key-here"
```

### Option B: Secret Manager (Recommended for Production)
To keep your API key secure without exposing it in plaintext:

```bash
# 1. Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# 2. Create the secret
echo -n "YOUR_API_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-

# 3. Grant Cloud Run access to the secret
PROJECT_NUM=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUM}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 4. Attach secret to Cloud Run
gcloud run services update ecogpt \
  --region us-central1 \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

---

## 8. Custom Domain & SSL Setup

Google Cloud Run provides automatic free SSL certificates for custom domains.

1. Go to **Cloud Run** > **Manage custom domains** in GCP Console.
2. Click **Add mapping**.
3. Select service: `ecogpt`.
4. Enter your custom domain (e.g., `ecogpt.yourdomain.com`).
5. Add the provided DNS `CNAME` or `A` records to your DNS registrar (Cloudflare, GoDaddy, Namecheap, Google Domains).
6. SSL certificate provisioning takes 5–15 minutes and renews automatically.

---

## 9. Scaling & Cost Optimization

EcoGPT is configured with optimal cost-saving parameters:
- **Min instances: `0`** — The container spins down to zero instances when no one is using the site, resulting in **$0 cost** during idle periods.
- **Max instances: `10`** — Protects against sudden traffic spikes or runaway charges.
- **Memory: `512MiB`** & **CPU: `1`** — Lightweight footprint that comfortably accommodates Vite static assets and the Express/Gemini gateway.

To adjust scaling:
```bash
gcloud run services update ecogpt \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 5
```

---

## 10. Troubleshooting & Useful Commands

### Check Service Health
```bash
curl https://YOUR_SERVICE_URL/api/health
```
Expected output:
```json
{"status":"ok","geminiConfigured":true,"timestamp":"..."}
```

### View Live Logs
```bash
gcloud run logs read ecogpt --region us-central1 --limit 50
# Or stream logs continuously:
gcloud run logs tail ecogpt --region us-central1
```

### Roll Back to Previous Revision
```bash
# List revisions
gcloud run revisions list --service ecogpt --region us-central1

# Route 100% traffic to previous revision
gcloud run services update-traffic ecogpt \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```
