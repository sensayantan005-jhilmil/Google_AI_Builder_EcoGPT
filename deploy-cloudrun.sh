#!/usr/bin/env bash
# ==============================================================================
# EcoGPT — Google Cloud Run Automated Deployment Script
# ==============================================================================

set -e

# Terminal colors
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "=========================================================="
echo "    🌿 EcoGPT — Google Cloud Run Automated Deployment     "
echo "=========================================================="
echo -e "${NC}"

# 1. Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}[ERROR] Google Cloud SDK (gcloud) is not installed.${NC}"
    echo "Please install gcloud from https://cloud.google.com/sdk/docs/install and try again."
    exit 1
fi

echo -e "${GREEN}✓ Google Cloud SDK (gcloud) detected.${NC}"

# 2. Determine Google Cloud Project ID
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || true)
if [ -n "$PROJECT_ID" ]; then
    GCP_PROJECT="$PROJECT_ID"
elif [ -n "$CURRENT_PROJECT" ]; then
    GCP_PROJECT="$CURRENT_PROJECT"
else
    echo -e "${YELLOW}Enter your Google Cloud Project ID:${NC} "
    read -r GCP_PROJECT
fi

if [ -z "$GCP_PROJECT" ]; then
    echo -e "${RED}[ERROR] Project ID cannot be empty.${NC}"
    exit 1
fi

echo -e "Using GCP Project: ${BOLD}${CYAN}${GCP_PROJECT}${NC}"
gcloud config set project "$GCP_PROJECT" --quiet

# 3. Configure Region & Service Name
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-ecogpt}"

echo -e "Target Region: ${BOLD}${CYAN}${REGION}${NC}"
echo -e "Service Name:  ${BOLD}${CYAN}${SERVICE_NAME}${NC}"

# 4. Enable Required Google Cloud APIs
echo -e "\n${YELLOW}Step 1/4: Enabling required Google Cloud APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    --project "$GCP_PROJECT" --quiet

echo -e "${GREEN}✓ Google Cloud APIs enabled successfully.${NC}"

# 5. Gemini API Key Configuration
ENV_VARS="NODE_ENV=production"
if [ -n "$GEMINI_API_KEY" ]; then
    ENV_VARS="${ENV_VARS},GEMINI_API_KEY=${GEMINI_API_KEY}"
    echo -e "${GREEN}✓ GEMINI_API_KEY detected in current environment.${NC}"
else
    echo -e "\n${YELLOW}Step 2/4: Optional Gemini API Key setup:${NC}"
    echo "Enter your GEMINI_API_KEY (press Enter to skip or configure later in Cloud Run console):"
    read -r USER_KEY
    if [ -n "$USER_KEY" ]; then
        ENV_VARS="${ENV_VARS},GEMINI_API_KEY=${USER_KEY}"
        echo -e "${GREEN}✓ GEMINI_API_KEY added to deployment config.${NC}"
    else
        echo -e "${CYAN}ℹ Skipping API Key for now. You can set it in GCP Console > Cloud Run > Variables.${NC}"
    fi
fi

# 6. Deploy to Cloud Run using Cloud Build source build
echo -e "\n${YELLOW}Step 3/4: Building and deploying container to Cloud Run...${NC}"
echo "Building directly from source via Google Cloud Build..."

gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "$ENV_VARS" \
    --project "$GCP_PROJECT" \
    --quiet

# 7. Verification & URL Output
echo -e "\n${YELLOW}Step 4/4: Retrieving deployment details...${NC}"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --project "$GCP_PROJECT" --format 'value(status.url)' 2>/dev/null || true)

echo -e "\n${GREEN}${BOLD}=========================================================="
echo "    🎉 EcoGPT successfully deployed to Google Cloud Run!    "
echo "==========================================================${NC}"
if [ -n "$SERVICE_URL" ]; then
    echo -e "Live URL: ${BOLD}${CYAN}${SERVICE_URL}${NC}"
    echo -e "Health check: ${CYAN}${SERVICE_URL}/api/health${NC}"
else
    echo -e "Check your deployment at: ${CYAN}https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}${NC}"
fi
echo -e "\nTo view real-time logs, run:"
echo -e "  ${BOLD}gcloud run logs read ${SERVICE_NAME} --region ${REGION}${NC}\n"
