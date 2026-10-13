/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EcoGPT — Interactive Google Cloud Run Deployment Center
 */

import React, { useState } from 'react';
import {
  X,
  Cloud,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
  Layers,
  FileCode,
  Activity,
  CheckCircle2,
  DollarSign,
  Globe,
  GitBranch
} from 'lucide-react';

interface GcpDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGIONS = [
  { id: 'us-central1', name: 'Iowa (us-central1) - Low Carbon' },
  { id: 'us-east1', name: 'South Carolina (us-east1)' },
  { id: 'europe-west1', name: 'Belgium (europe-west1) - Low Carbon' },
  { id: 'europe-west4', name: 'Netherlands (europe-west4) - Low Carbon' },
  { id: 'asia-southeast1', name: 'Singapore (asia-southeast1)' },
  { id: 'asia-east1', name: 'Taiwan (asia-east1)' },
  { id: 'asia-south1', name: 'Mumbai (asia-south1)' },
];

export const GcpDeploymentModal: React.FC<GcpDeploymentModalProps> = ({
  isOpen,
  onClose
}) => {
  const [projectId, setProjectId] = useState('ecogpt-production');
  const [region, setRegion] = useState('us-central1');
  const [serviceName, setServiceName] = useState('ecogpt');
  const [apiKey, setApiKey] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cli' | 'cicd' | 'console' | 'script' | 'arch'>('cli');

  // Health check test state
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthResult, setHealthResult] = useState<{
    status: number;
    data: any;
    durationMs: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const runHealthCheck = async () => {
    setHealthLoading(true);
    setHealthResult(null);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const durationMs = Math.round(performance.now() - start);
      setHealthResult({
        status: res.status,
        data,
        durationMs
      });
    } catch (err: any) {
      setHealthResult({
        status: 500,
        data: { error: err.message || 'Connection failed' },
        durationMs: 0
      });
    } finally {
      setHealthLoading(false);
    }
  };

  // Generate dynamic CLI commands based on user input
  const oneCommandDeploy = `gcloud run deploy ${serviceName} \\
  --source . \\
  --region ${region} \\
  --platform managed \\
  --allow-unauthenticated \\
  --port 8080 \\
  --memory 512Mi \\
  --cpu 1 \\
  --min-instances 0 \\
  --max-instances 10 \\
  --set-env-vars NODE_ENV=production${apiKey.trim() ? `,GEMINI_API_KEY=${apiKey.trim()}` : ''} \\
  --project ${projectId || 'YOUR_PROJECT_ID'}`;

  const scriptCommand = `chmod +x deploy-cloudrun.sh
PROJECT_ID="${projectId || 'YOUR_PROJECT_ID'}" REGION="${region}" ./deploy-cloudrun.sh`;

  const cloudBuildCommand = `gcloud builds submit --config=cloudbuild.yaml --project=${projectId || 'YOUR_PROJECT_ID'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cloud className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Deploy EcoGPT to Google Cloud Run
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Containerized Serverless
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Scales to zero ($0 idle cost), free SSL certificates, and high-performance global container serving.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Idle Cost</span>
              </div>
              <span className="text-base font-bold text-white mt-1">$0.00 / month</span>
              <span className="text-[11px] text-slate-400">Scale to 0 instances</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                <Zap className="w-3.5 h-3.5" />
                <span>Free Tier</span>
              </div>
              <span className="text-base font-bold text-white mt-1">2M Req/mo</span>
              <span className="text-[11px] text-slate-400">Google Cloud Free Tier</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                <Globe className="w-3.5 h-3.5" />
                <span>SSL Security</span>
              </div>
              <span className="text-base font-bold text-white mt-1">Free HTTPS</span>
              <span className="text-[11px] text-slate-400">Auto-managed certs</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
                <Server className="w-3.5 h-3.5" />
                <span>Memory / CPU</span>
              </div>
              <span className="text-base font-bold text-white mt-1">512MB / 1 vCPU</span>
              <span className="text-[11px] text-slate-400">Node 22 Express container</span>
            </div>
          </div>

          {/* Interactive Parameters Configuration */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                1. Configure Your Deployment Parameters
              </h4>
              <span className="text-[11px] text-slate-400">Updates deployment commands dynamically</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GCP Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="e.g. my-gcp-project-123"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Cloud Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cloud Run Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="ecogpt"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                <span>Google Gemini API Key (Optional in command, can be set in GCP Secret Manager)</span>
                <span className="text-[10px] text-slate-500 font-normal">Never stored locally</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (leave empty to configure via GCP Secret Manager or Console)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Deployment Method Tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('cli')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'cli'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Direct CLI Deploy
              </button>

              <button
                onClick={() => setActiveTab('cicd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'cicd'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                Automated CI/CD (Git Push)
              </button>

              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'console'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Cloud Console UI Steps
              </button>

              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'script'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                deploy-cloudrun.sh Script
              </button>

              <button
                onClick={() => setActiveTab('arch')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'arch'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Architecture
              </button>
            </div>

            {/* TAB CONTENT: CLI */}
            {activeTab === 'cli' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-slate-200">
                    Step-by-step Google Cloud CLI commands:
                  </span>
                  <a
                    href="https://shell.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 transition-colors"
                  >
                    Open Google Cloud Shell in Browser <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Step 1 */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Step 1: Set Project & Enable Cloud APIs</span>
                    <button
                      onClick={() => handleCopy(`gcloud config set project ${projectId || 'YOUR_PROJECT_ID'} && gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`, 'step1')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedKey === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'step1' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-cyan-300 overflow-x-auto select-all">
{`gcloud config set project ${projectId || 'YOUR_PROJECT_ID'}
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`}
                  </pre>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Step 2: Deploy Container to Cloud Run</span>
                    <button
                      onClick={() => handleCopy(oneCommandDeploy, 'cli')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedKey === 'cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cli' ? 'Copied!' : 'Copy Deploy Command'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                    {oneCommandDeploy}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3 text-xs text-slate-400 space-y-1">
                  <p className="font-medium text-slate-300">How it runs:</p>
                  <p className="text-[11px]">
                    Google Cloud automatically builds your <code className="text-emerald-300">Dockerfile</code>, generates production assets, provisions the container on port 8080, and issues an instant public HTTPS domain.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CI/CD (Git Push) */}
            {activeTab === 'cicd' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Automated Continuous Deployment Workflow Ready
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Your project is pre-configured with <code className="text-emerald-300">.github/workflows/deploy-cloudrun.yml</code> and <code className="text-emerald-300">cloudbuild.yaml</code>. Every commit pushed to your repository automatically triggers a deployment.
                  </p>
                </div>

                {/* Git Push Steps */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">1. Initialize Git & Push to GitHub</span>
                    <button
                      onClick={() => handleCopy(`git init
git add .
git commit -m "Initial EcoGPT release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecogpt.git
git push -u origin main`, 'git-push')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedKey === 'git-push' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'git-push' ? 'Copied!' : 'Copy Git Commands'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-emerald-300 overflow-x-auto select-all">
{`git init
git add .
git commit -m "Initial EcoGPT release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecogpt.git
git push -u origin main`}
                  </pre>
                </div>

                {/* GitHub Secrets */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <span className="text-xs font-bold text-slate-200">2. Configure GitHub Repository Secrets</span>
                  <p className="text-[11px] text-slate-400">
                    Go to your GitHub repo &gt; <b>Settings</b> &gt; <b>Secrets and variables</b> &gt; <b>Actions</b> &gt; <b>New repository secret</b>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    <li><code className="text-cyan-300 font-mono">GCP_PROJECT_ID</code>: Set to <code className="text-white">{projectId || 'YOUR_PROJECT_ID'}</code></li>
                    <li><code className="text-cyan-300 font-mono">GCP_SA_KEY</code>: Google Cloud Service Account JSON Key with Cloud Run Admin &amp; Storage Admin roles</li>
                    <li><code className="text-cyan-300 font-mono">GEMINI_API_KEY</code>: Your Gemini API Key</li>
                  </ul>
                </div>

                {/* Cloud Build Alternative */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Alternative: Cloud Build Trigger via gcloud</span>
                    <button
                      onClick={() => handleCopy(`gcloud builds submit --config=cloudbuild.yaml --project=${projectId || 'YOUR_PROJECT_ID'}`, 'cb-manual')}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedKey === 'cb-manual' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cb-manual' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-blue-300 overflow-x-auto select-all">
{`gcloud builds submit --config=cloudbuild.yaml --project=${projectId || 'YOUR_PROJECT_ID'}`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Cloud Console GUI */}
            {activeTab === 'console' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-slate-200">
                    Deploy through Google Cloud Console Web Browser:
                  </span>
                  <a
                    href="https://console.cloud.google.com/run"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/60 transition-colors"
                  >
                    Open Cloud Run Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400">Step 1: Open Cloud Run &amp; Create Service</span>
                    <p className="text-slate-300 mt-1 text-[11px]">
                      Visit <code className="text-cyan-300">console.cloud.google.com/run</code> and click the top <b>&quot;Create Service&quot;</b> button.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400">Step 2: Source Code Selection</span>
                    <p className="text-slate-300 mt-1 text-[11px]">
                      Select <b>&quot;Continuously deploy from a repository&quot;</b> and click <b>&quot;Set up with Cloud Build&quot;</b>. Select your GitHub repository and branch (<code className="text-emerald-300">main</code>). The build type will auto-detect the root <code className="text-emerald-300">Dockerfile</code>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400">Step 3: Service Name &amp; Region</span>
                    <p className="text-slate-300 mt-1 text-[11px]">
                      Name: <code className="text-white font-mono">{serviceName}</code> &bull; Region: <code className="text-white font-mono">{region}</code>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400">Step 4: Authentication &amp; Port</span>
                    <p className="text-slate-300 mt-1 text-[11px]">
                      Under Authentication, select <b>&quot;Allow unauthenticated invocations&quot;</b> (for public access). Under Container settings, ensure Container Port is set to <code className="text-emerald-300 font-mono">8080</code>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400">Step 5: Environment Variables</span>
                    <p className="text-slate-300 mt-1 text-[11px]">
                      Under <b>Variables &amp; Secrets</b>, add:
                      <br />&bull; <code className="text-cyan-300">NODE_ENV</code> = <code className="text-white">production</code>
                      <br />&bull; <code className="text-cyan-300">GEMINI_API_KEY</code> = <code className="text-white">your-key</code>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-emerald-400">Step 6: Click &quot;Create&quot;</span>
                    <p className="text-slate-300 mt-1 text-[11px]">
                      Cloud Run will build and launch your container. In ~2 minutes, your service URL will appear at the top of the page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Script */}
            {activeTab === 'script' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-slate-200">
                    Interactive CLI Wizard (checks gcloud, enables APIs, deploys):
                  </span>
                  <button
                    onClick={() => handleCopy(scriptCommand, 'script')}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/60 transition-colors"
                  >
                    {copiedKey === 'script' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script Command</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                  {scriptCommand}
                </div>

                <p className="text-xs text-slate-400">
                  The script <code className="text-slate-300">deploy-cloudrun.sh</code> automatically verifies your gcloud credentials, enables <code className="text-slate-300">run.googleapis.com</code>, <code className="text-slate-300">cloudbuild.googleapis.com</code>, and displays your live service URL upon completion.
                </p>
              </div>
            )}

            {/* TAB CONTENT: Architecture */}
            {activeTab === 'arch' && (
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    EcoGPT Container Architecture on Cloud Run
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase">1. Frontend Layer</span>
                      <p className="text-slate-300 mt-1 font-medium">Vite + React 19 SPA</p>
                      <p className="text-slate-400 mt-1 text-[11px]">Compiled to static assets in <code className="text-emerald-300">dist/</code> during Docker multi-stage build. Served with high-efficiency gzip/brotli caching.</p>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase">2. API Gateway</span>
                      <p className="text-slate-300 mt-1 font-medium">Express.js on Node 22</p>
                      <p className="text-slate-400 mt-1 text-[11px]">Listens on <code className="text-cyan-300">$PORT</code> (8080). Handles <code className="text-cyan-300">/api/health</code>, <code className="text-cyan-300">/api/advisor</code>, and wildcards fallback to SPA index.html.</p>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-[11px] font-bold text-purple-400 uppercase">3. AI Intelligence</span>
                      <p className="text-slate-300 mt-1 font-medium">@google/genai SDK</p>
                      <p className="text-slate-400 mt-1 text-[11px]">Synthesizes environmental masterplans using Gemini 3.8 Flash &amp; 3.1 Flash Lite. Protected with deterministic regional fallback.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Health Check Card */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Test Health Check Endpoint (/api/health)
                </h5>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cloud Run uses this endpoint for container startup probes and zero-downtime routing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runHealthCheck}
                disabled={healthLoading}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {healthLoading ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Pinging...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>Ping Endpoint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {healthResult && (
            <div className="bg-slate-950 border border-emerald-800/60 rounded-xl p-3 text-xs font-mono space-y-1 animate-fade-in">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Status {healthResult.status} OK ({healthResult.durationMs}ms)
                </span>
                <span className="text-[11px] text-slate-400">Response payload:</span>
              </div>
              <pre className="text-slate-300 text-[11px] overflow-x-auto bg-slate-900/80 p-2 rounded border border-slate-800">
                {JSON.stringify(healthResult.data, null, 2)}
              </pre>
            </div>
          )}

          {/* Useful GCP Console Quick Links */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Helpful Google Cloud Console Links:</span>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://console.cloud.google.com/run"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Cloud Run Services <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://console.cloud.google.com/security/secret-manager"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Secret Manager <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Get Gemini API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            All files (<code className="text-slate-300">Dockerfile</code>, <code className="text-slate-300">.dockerignore</code>, <code className="text-slate-300">deploy-cloudrun.sh</code>, <code className="text-slate-300">DEPLOYMENT_GUIDE.md</code>) are ready in the repo.
          </p>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
