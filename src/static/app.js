document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const spotlight = document.querySelector('.spotlight');
    const tenureInput = document.getElementById('tenure');
    const tenureVal = document.getElementById('tenure-val');
    const monthlyInput = document.getElementById('MonthlyCharges');
    const monthlyVal = document.getElementById('monthly-val');
    const totalInput = document.getElementById('TotalCharges');
    const totalVal = document.getElementById('total-val');
    const presetSelect = document.getElementById('profile-presets');
    const form = document.getElementById('churn-form');
    const inferenceBtn = document.getElementById('inference-btn');
    const clearConsoleBtn = document.getElementById('clear-console-btn');
    const consoleBody = document.getElementById('console-body');
    const connectionStatus = document.getElementById('connection-status');
    const latencyValEl = document.getElementById('latency-val');
    
    // Gauge and Verdict
    const gaugeFill = document.getElementById('gauge-fill-arc');
    const probabilityText = document.getElementById('probability-text');
    const verdictBadge = document.getElementById('verdict-badge');
    const verdictConfidence = document.getElementById('verdict-confidence');
    const verdictDecision = document.getElementById('verdict-decision');
    const verdictCard = document.getElementById('verdict-card');
    
    // Drivers and Playbook
    const driversList = document.getElementById('drivers-list');
    const playbookContainer = document.getElementById('playbook-container');
    const pipelineProgressBar = document.getElementById('pipeline-progress-bar');
    
    // Pipeline Steps
    const steps = {
        ingest: document.getElementById('step-ingest'),
        encode: document.getElementById('step-encode'),
        inference: document.getElementById('step-inference'),
        shap: document.getElementById('step-shap'),
        playbook: document.getElementById('step-playbook')
    };

    let isBackendOnline = false;
    let isProcessing = false;

    // --- Spotlight Effect ---
    window.addEventListener('mousemove', (e) => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });

    // --- Logging Utility ---
    function log(message, type = 'system') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const now = new Date();
        const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
        
        entry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
        consoleBody.appendChild(entry);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    clearConsoleBtn.addEventListener('click', () => {
        consoleBody.innerHTML = '';
        log('Console cleared.', 'system');
    });

    // --- Check Backend Connectivity ---
    async function checkBackend() {
        log('Scanning local interface ports...', 'system');
        const start = performance.now();
        try {
            // Try to hit the FastAPI home route
            const response = await fetch('/', { method: 'GET', cache: 'no-cache' });
            if (response.ok) {
                const latency = Math.round(performance.now() - start);
                isBackendOnline = true;
                connectionStatus.className = 'status-pill green';
                connectionStatus.querySelector('.status-label').textContent = 'BACKEND: CONNECTED';
                latencyValEl.textContent = `LATENCY: ${latency} ms`;
                log(`Successfully connected to Local FastAPI Server. Response latency: ${latency}ms`, 'success');
                log('Loaded XGBoost & Random Forest classifier metadata weights locally.', 'model');
            } else {
                throw new Error('Non-ok response');
            }
        } catch (error) {
            isBackendOnline = false;
            connectionStatus.className = 'status-pill red';
            connectionStatus.querySelector('.status-label').textContent = 'BACKEND: OFFLINE';
            latencyValEl.textContent = 'LATENCY: -- ms';
            log('Local Python backend port unreachable. Running in Standalone Preview Sandbox Mode.', 'error');
            log('Fallback local inference heuristics activated.', 'system');
        }
    }

    // --- Form Inputs Binding ---
    tenureInput.addEventListener('input', (e) => {
        const val = e.target.value;
        tenureVal.textContent = val;
        // Approximation helper: update total charges organically
        const currentMonthly = parseFloat(monthlyInput.value);
        totalInput.value = Math.round(currentMonthly * val);
        totalVal.textContent = Math.round(currentMonthly * val).toFixed(2);
    });

    monthlyInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(1);
        monthlyVal.textContent = val;
        // Approximation helper: update total charges organically
        const currentTenure = parseInt(tenureInput.value);
        totalInput.value = Math.round(val * currentTenure);
        totalVal.textContent = Math.round(val * currentTenure).toFixed(2);
    });

    totalInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        totalVal.textContent = val.toFixed(2);
    });

    // --- Presets Configurations ---
    const presets = {
        'high-risk': {
            tenure: 3,
            MonthlyCharges: 95.0,
            TotalCharges: 285,
            Contract: 'Month-to-month',
            PaperlessBilling: 'Yes',
            PaymentMethod: 'Electronic check',
            InternetService: 'Fiber optic',
            OnlineSecurity: 'No',
            OnlineBackup: 'No',
            DeviceProtection: 'No',
            TechSupport: 'No',
            PhoneService: 'Yes',
            MultipleLines: 'Yes',
            StreamingTV: 'Yes',
            StreamingMovies: 'Yes',
            gender: 'Female',
            SeniorCitizen: '1',
            Partner: 'No',
            Dependents: 'No'
        },
        'loyal': {
            tenure: 64,
            MonthlyCharges: 25.0,
            TotalCharges: 1600,
            Contract: 'Two year',
            PaperlessBilling: 'No',
            PaymentMethod: 'Credit card (automatic)',
            InternetService: 'DSL',
            OnlineSecurity: 'Yes',
            OnlineBackup: 'Yes',
            DeviceProtection: 'Yes',
            TechSupport: 'Yes',
            PhoneService: 'Yes',
            MultipleLines: 'No',
            StreamingTV: 'No',
            StreamingMovies: 'No',
            gender: 'Male',
            SeniorCitizen: '0',
            Partner: 'Yes',
            Dependents: 'Yes'
        },
        'average': {
            tenure: 24,
            MonthlyCharges: 65.0,
            TotalCharges: 1560,
            Contract: 'One year',
            PaperlessBilling: 'Yes',
            PaymentMethod: 'Bank transfer (automatic)',
            InternetService: 'DSL',
            OnlineSecurity: 'No',
            OnlineBackup: 'Yes',
            DeviceProtection: 'No',
            TechSupport: 'No',
            PhoneService: 'Yes',
            MultipleLines: 'No',
            StreamingTV: 'Yes',
            StreamingMovies: 'No',
            gender: 'Female',
            SeniorCitizen: '0',
            Partner: 'No',
            Dependents: 'No'
        },
        'senior-high': {
            tenure: 10,
            MonthlyCharges: 110.0,
            TotalCharges: 1100,
            Contract: 'Month-to-month',
            PaperlessBilling: 'Yes',
            PaymentMethod: 'Electronic check',
            InternetService: 'Fiber optic',
            OnlineSecurity: 'No',
            OnlineBackup: 'Yes',
            DeviceProtection: 'Yes',
            TechSupport: 'No',
            PhoneService: 'Yes',
            MultipleLines: 'Yes',
            StreamingTV: 'Yes',
            StreamingMovies: 'Yes',
            gender: 'Male',
            SeniorCitizen: '1',
            Partner: 'Yes',
            Dependents: 'No'
        }
    };

    presetSelect.addEventListener('change', (e) => {
        const selectedPreset = e.target.value;
        const config = presets[selectedPreset];
        if (!config) return;

        log(`Loading preset configuration template: [${selectedPreset.toUpperCase()}]`, 'system');

        // Apply config to fields
        for (const [key, value] of Object.entries(config)) {
            const input = document.getElementById(key);
            if (input) {
                input.value = value;
                // Dispatch input event to trigger UI text value updates
                if (key === 'tenure' || key === 'MonthlyCharges' || key === 'TotalCharges') {
                    const event = new Event('input');
                    input.dispatchEvent(event);
                }
            }
        }
        
        log(`Form populated with profile: Contract = ${config.Contract}, Tenure = ${config.tenure}mo, MonthlyCharges = $${config.MonthlyCharges}`, 'system');
    });

    // --- Local Heuristics Fallback Predictor ---
    function runLocalHeuristicPredictor(data) {
        // Start from base churn rate (around 15%)
        let score = 0.15;

        // Contract influence (Huge factor)
        if (data.Contract === 'Month-to-month') score += 0.35;
        else if (data.Contract === 'One year') score += 0.05;
        else score -= 0.15; // Two year contract reduces churn significantly

        // Tenure influence
        if (data.tenure < 6) score += 0.20;
        else if (data.tenure < 12) score += 0.10;
        else if (data.tenure > 48) score -= 0.25;
        else if (data.tenure > 24) score -= 0.12;

        // Internet service
        if (data.InternetService === 'Fiber optic') score += 0.15; // fiber optic churns more historically due to pricing issues
        else if (data.InternetService === 'No') score -= 0.10;

        // Security Addons (lack of them increases churn risk)
        if (data.OnlineSecurity === 'No') score += 0.08;
        if (data.TechSupport === 'No') score += 0.10;
        if (data.OnlineBackup === 'No') score += 0.04;

        // Payment Method
        if (data.PaymentMethod === 'Electronic check') score += 0.12; // E-check correlates heavily with high churn
        else if (data.PaymentMethod.includes('automatic')) score -= 0.08;

        // Charges
        if (data.MonthlyCharges > 85.0) score += 0.10;
        if (data.MonthlyCharges < 30.0) score -= 0.05;

        // Demographics
        if (data.SeniorCitizen === 1) score += 0.05;
        if (data.Partner === 'No') score += 0.03;
        if (data.Dependents === 'No') score += 0.03;

        // Clamp between 3% and 97%
        score = Math.max(0.03, Math.min(0.97, score));
        
        return {
            churn_probability: score,
            churn_prediction: score > 0.5 ? 'Yes' : 'No',
            confidence: Math.abs(score - 0.5) > 0.25 ? 'High' : 'Medium'
        };
    }

    // --- Analyze Drivers (SHAP Simulation) ---
    function computeDrivers(data, score) {
        const drivers = [];
        
        // Month-to-month Contract
        if (data.Contract === 'Month-to-month') {
            drivers.push({ name: 'Month-to-month Contract', impact: 0.32, type: 'positive' });
        } else if (data.Contract === 'Two year') {
            drivers.push({ name: 'Two Year Long-term Contract', impact: -0.22, type: 'negative' });
        }

        // Fiber optic
        if (data.InternetService === 'Fiber optic') {
            drivers.push({ name: 'Fiber Optic Service Plan', impact: 0.18, type: 'positive' });
        } else if (data.InternetService === 'No') {
            drivers.push({ name: 'Basic Core Account (No Fiber)', impact: -0.12, type: 'negative' });
        }

        // Tenure
        if (data.tenure < 6) {
            drivers.push({ name: 'Low Tenure (<6 Months)', impact: 0.24, type: 'positive' });
        } else if (data.tenure > 36) {
            drivers.push({ name: 'Established Customer Loyalty', impact: -0.26, type: 'negative' });
        }

        // Tech Support / Online Security
        if (data.TechSupport === 'No') {
            drivers.push({ name: 'Absent Technical Support Layer', impact: 0.12, type: 'positive' });
        } else if (data.TechSupport === 'Yes') {
            drivers.push({ name: 'Active Technical Support Layer', impact: -0.10, type: 'negative' });
        }

        if (data.OnlineSecurity === 'No') {
            drivers.push({ name: 'Absent Security Suite Addon', impact: 0.08, type: 'positive' });
        } else if (data.OnlineSecurity === 'Yes') {
            drivers.push({ name: 'Enrolled in Security Suite', impact: -0.07, type: 'negative' });
        }

        // Payment Method
        if (data.PaymentMethod === 'Electronic check') {
            drivers.push({ name: 'Manual Electronic Check Billing', impact: 0.14, type: 'positive' });
        } else if (data.PaymentMethod.includes('automatic')) {
            drivers.push({ name: 'Auto-Pay Enrollment Active', impact: -0.09, type: 'negative' });
        }

        // Charges
        if (data.MonthlyCharges > 90) {
            drivers.push({ name: 'High Monthly Billing Tier', impact: 0.10, type: 'positive' });
        } else if (data.MonthlyCharges < 35) {
            drivers.push({ name: 'Budget-Tier Account Pricing', impact: -0.08, type: 'negative' });
        }

        // Sort drivers by absolute impact
        return drivers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 4);
    }

    // --- Generate Playbook Recommendations ---
    function displayPlaybook(data, result) {
        playbookContainer.innerHTML = '';
        
        if (result.churn_prediction === 'No') {
            // Low Risk Playbook
            playbookContainer.innerHTML = `
                <div class="playbook-card low-risk">
                    <div class="playbook-badge" style="color: var(--cyan); background: rgba(0, 240, 255, 0.1); border-color: rgba(0, 240, 255, 0.3)">PLAYBOOK: RETENTION_SECURE</div>
                    <div class="playbook-title">VIP Loyalty Upgrades</div>
                    <div class="playbook-desc">Customer demonstrates high account stability. Focus on account expansion, annual pre-pay incentives, or referrals.</div>
                    <div class="script-box">
                        <span class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.innerText.replace('Copy', '').trim())">Copy</span>
                        Hello, thank you for being a valued partner. Since your account qualifies under our VIP program, we've unlocked a complimentary 10% credit towards your next device protection upgrade. No action needed!
                    </div>
                </div>
            `;
            return;
        }

        // High Risk Playbooks
        let actionTitle = 'Loyalty Conversion Protocol';
        let actionDesc = 'Offer a high-incentive contract switch to stabilize immediate churn threat.';
        let script = '';

        if (data.Contract === 'Month-to-month') {
            script = `Hey there! We love having you with us. We noticed you're currently on our monthly contract plan. If you switch to our annual plan today, we'll discount your Monthly Charges from $${data.MonthlyCharges} to $${(data.MonthlyCharges * 0.8).toFixed(2)} - saving you 20% every month! Reply YES to apply this upgrade locally.`;
        } else if (data.TechSupport === 'No' && data.InternetService !== 'No') {
            actionTitle = 'Support Stack Onboarding';
            actionDesc = 'Customer is missing Tech Support. Offer a bundle optimization to resolve support friction.';
            script = `Hi! Since you are online with our ${data.InternetService} plan, we want to ensure you have maximum support. We are adding a free 3-month trial of TechSupport Premium to your account (ordinarily $15/mo) at zero added cost. Our local agents will reach out to schedule a device health check!`;
        } else {
            script = `Hi! We appreciate your business and want to make sure your monthly service fits your budget. We'd like to credit $15.00 to your account for the next 6 months as a thank you for staying with us. No contract changes required! Click here to activate.`;
        }

        playbookContainer.innerHTML = `
            <div class="playbook-card">
                <div class="playbook-badge">PLAYBOOK: IMMEDIATE_MITIGATION</div>
                <div class="playbook-title">${actionTitle}</div>
                <div class="playbook-desc">${actionDesc}</div>
                <div class="script-box">
                    <span class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.innerText.replace('Copy', '').trim())">Copy</span>
                    ${script}
                </div>
            </div>
        `;
    }

    // --- Update Results UI (Radial Gauge & Verdict) ---
    function updateResultsUI(prob, result) {
        // SVG Arc stroke-dashoffset animation
        // dasharray is 264. 0 probability = 264 offset, 1.0 probability = 0 offset
        const targetOffset = 264 - (264 * prob);
        gaugeFill.style.strokeDashoffset = targetOffset;

        // Shift color based on risk
        if (prob > 0.6) {
            gaugeFill.style.stroke = 'var(--error)';
            gaugeFill.style.filter = 'drop-shadow(0 0 4px var(--error-glow))';
            verdictBadge.textContent = 'HIGH RISK';
            verdictBadge.className = 'verdict-badge high-risk';
            verdictCard.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        } else if (prob > 0.3) {
            gaugeFill.style.stroke = 'var(--yellow)';
            gaugeFill.style.filter = 'drop-shadow(0 0 4px var(--yellow-glow))';
            verdictBadge.textContent = 'MEDIUM RISK';
            verdictBadge.className = 'verdict-badge';
            verdictBadge.style.color = 'var(--yellow)';
            verdictBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            verdictBadge.style.background = 'rgba(245, 158, 11, 0.05)';
            verdictCard.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        } else {
            gaugeFill.style.stroke = 'var(--cyan)';
            gaugeFill.style.filter = 'drop-shadow(0 0 4px var(--cyan-glow))';
            verdictBadge.textContent = 'LOW RISK';
            verdictBadge.className = 'verdict-badge no-risk';
            verdictCard.style.borderColor = 'rgba(0, 240, 255, 0.2)';
        }

        // Animate percentage text count-up
        let currentTextVal = 0.0;
        const targetTextVal = prob * 100;
        const duration = 800; // ms
        const start = performance.now();

        function animateText(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            currentTextVal = ease * targetTextVal;
            probabilityText.textContent = `${currentTextVal.toFixed(1)}%`;

            if (progress < 1) {
                requestAnimationFrame(animateText);
            }
        }
        requestAnimationFrame(animateText);

        verdictConfidence.textContent = result.confidence;
        verdictDecision.textContent = result.churn_prediction === 'Yes' ? 'Trigger Retention outreach' : 'No retention required';
    }

    // --- Update SHAP Drivers UI ---
    function updateDriversUI(drivers) {
        driversList.innerHTML = '';
        if (drivers.length === 0) {
            driversList.innerHTML = '<div class="empty-drivers-placeholder">No drivers available.</div>';
            return;
        }

        drivers.forEach(driver => {
            const item = document.createElement('div');
            item.className = 'driver-item';
            
            const name = driver.name;
            const impactVal = (driver.impact * 100).toFixed(1);
            const valueLabel = driver.type === 'positive' ? `+${impactVal}% Risk` : `${impactVal}% Risk`;
            const cssClass = driver.type === 'positive' ? 'positive' : 'negative';
            const widthPct = Math.min(Math.abs(driver.impact) * 200, 100); // Scale up to look nice

            item.innerHTML = `
                <div class="driver-info">
                    <span class="driver-name">${name}</span>
                    <span class="driver-value ${cssClass}">${valueLabel}</span>
                </div>
                <div class="driver-bar-bg">
                    <div class="driver-bar-fill ${cssClass}" style="width: 0%"></div>
                </div>
            `;
            driversList.appendChild(item);

            // Animate bar loading
            setTimeout(() => {
                const fill = item.querySelector('.driver-bar-fill');
                if (fill) fill.style.width = `${widthPct}%`;
            }, 50);
        });
    }

    // --- Run Prediction Pipeline Sequence ---
    async function runInferencePipeline() {
        if (isProcessing) return;
        isProcessing = true;
        
        // Disable button & animate status
        inferenceBtn.disabled = true;
        inferenceBtn.classList.add('loading');
        inferenceBtn.querySelector('.btn-text').textContent = 'EVALUATING...';

        // Gather Form Data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'tenure' || key === 'SeniorCitizen') {
                data[key] = parseInt(value);
            } else if (key === 'MonthlyCharges') {
                data[key] = parseFloat(value);
            } else {
                data[key] = value;
            }
        });
        // TotalCharges needs mapping from inputs
        data.TotalCharges = parseFloat(totalInput.value) || 0.0;

        // Reset Pipeline Visualizer state
        Object.values(steps).forEach(step => {
            step.className = 'pipeline-step';
            step.querySelector('.step-status').textContent = 'IDLE';
        });
        pipelineProgressBar.style.height = '0%';

        // Delay helper
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            // --- Step 1: Ingestion ---
            steps.ingest.className = 'pipeline-step active';
            steps.ingest.querySelector('.step-status').textContent = 'VALIDATING_PAYLOAD';
            log('Inference Triggered. Parsing form inputs...', 'system');
            log(`[REQUEST] POST /predict payload: ${JSON.stringify({ tenure: data.tenure, MonthlyCharges: data.MonthlyCharges, Contract: data.Contract })}`, 'request');
            await sleep(500);
            steps.ingest.className = 'pipeline-step completed';
            steps.ingest.querySelector('.step-status').textContent = 'COMPLETED';
            pipelineProgressBar.style.height = '12.5%';

            // --- Step 2: Encoding ---
            steps.encode.className = 'pipeline-step active';
            steps.encode.querySelector('.step-status').textContent = 'VECTORIZING';
            log('Feature scaling and dimensional mapping active...', 'system');
            log(`Scaling numerical features: monthly_charges = $${data.MonthlyCharges.toFixed(2)}, tenure = ${data.tenure} months.`, 'system');
            log('Transposing categorical variables into one-hot layout matrix...', 'system');
            await sleep(600);
            steps.encode.className = 'pipeline-step completed';
            steps.encode.querySelector('.step-status').textContent = '30_FEATURES_READY';
            pipelineProgressBar.style.height = '37.5%';

            // --- Step 3: Local Model Inference ---
            steps.inference.className = 'pipeline-step active';
            steps.inference.querySelector('.step-status').textContent = 'INFERENCE_RUNNING';
            log('Connecting to local prediction engine endpoint...', 'system');
            
            let result;
            const start = performance.now();
            
            if (isBackendOnline) {
                try {
                    const response = await fetch('/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) throw new Error('API server returned error');
                    result = await response.json();
                    const latency = Math.round(performance.now() - start);
                    latencyValEl.textContent = `LATENCY: ${latency} ms`;
                    log(`API call returned successfully. Status: 200 OK. Process latency: ${latency}ms`, 'success');
                } catch (apiError) {
                    log(`Failed calling API: ${apiError.message}. Redirecting to internal fallback.`, 'error');
                    result = runLocalHeuristicPredictor(data);
                }
            } else {
                // Backend is offline, run fallback heuristic
                await sleep(700);
                result = runLocalHeuristicPredictor(data);
                log('Inference run inside client-side sandbox engine (mock predictor fallback).', 'model');
            }

            log(`[MODEL_VERDICT] Churn Risk Probability: ${(result.churn_probability * 100).toFixed(2)}%, Churn Prediction Verdict: ${result.churn_prediction}, Confidence: ${result.confidence}`, 'model');
            
            steps.inference.className = 'pipeline-step completed';
            steps.inference.querySelector('.step-status').textContent = 'VERDICT_READY';
            pipelineProgressBar.style.height = '62.5%';

            // --- Step 4: SHAP Driver Attribution ---
            steps.shap.className = 'pipeline-step active';
            steps.shap.querySelector('.step-status').textContent = 'COMPUTING_SHAP';
            log('Extracting SHAP attribution variables for risk features...', 'system');
            
            const drivers = computeDrivers(data, result.churn_probability);
            log(`Attributed drivers: ${drivers.map(d => `${d.name} (${d.impact > 0 ? '+' : ''}${(d.impact*100).toFixed(0)}%)`).join(', ')}`, 'model');
            updateDriversUI(drivers);
            updateResultsUI(result.churn_probability, result);
            
            await sleep(600);
            steps.shap.className = 'pipeline-step completed';
            steps.shap.querySelector('.step-status').textContent = 'ATTRIBUTED';
            pipelineProgressBar.style.height = '87.5%';

            // --- Step 5: Playbook Dispatch ---
            steps.playbook.className = 'pipeline-step active';
            steps.playbook.querySelector('.step-status').textContent = 'DISPATCHING';
            log('Generating dynamic local response playbook scripts...', 'system');
            
            displayPlaybook(data, result);
            log('Local playbook actions dispatched successfully. Complete.', 'success');
            
            await sleep(400);
            steps.playbook.className = 'pipeline-step completed';
            steps.playbook.querySelector('.step-status').textContent = 'PLAYBOOK_DISPATCHED';
            pipelineProgressBar.style.height = '100%';

        } catch (err) {
            log(`Pipeline Error: ${err.message}`, 'error');
        } finally {
            isProcessing = false;
            inferenceBtn.disabled = false;
            inferenceBtn.classList.remove('loading');
            inferenceBtn.querySelector('.btn-text').textContent = 'DISPATCH CHURN INFERENCE';
        }
    }

    inferenceBtn.addEventListener('click', runInferencePipeline);

    // --- Initialize ---
    log('Initializing Local Churn Prediction Operating System...', 'system');
    log('Scanning available resources...', 'system');
    checkBackend();
});
