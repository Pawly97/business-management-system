// BUSINESS MANAGEMENT SYSTEM - BANKING GRADE
// Complete loan and real estate management with professional banking features

class BankingGradeBusinessManager {
    constructor() {
        console.log('BankingGradeBusinessManager initialized');
        
        this.currentUser = null;
        this.currentMode = 'loan';
        this.currentView = 'dashboard';
        this.currentFilter = 'upcoming';
        
        // System settings
        this.primeRate = parseFloat(localStorage.getItem('primeRate')) || 5.50;
        this.primeRateHistory = JSON.parse(localStorage.getItem('primeRateHistory')) || [];
        
        // Initialize data
        this.loans = this.loadData('loans') || this.getDefaultLoans();
        this.properties = this.loadData('properties') || this.getDefaultProperties();
        this.tenants = this.loadData('tenants') || this.getDefaultTenants();
        this.payments = this.loadData('payments') || [];
        this.rentPayments = this.loadData('rentPayments') || [];
        
        // Generate schedules if empty
        if (this.payments.length === 0) {
            this.generatePaymentSchedules();
        }
        
        if (this.rentPayments.length === 0) {
            this.generateRentSchedules();
        }
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updatePrimeRateDisplay();
    }
    
    // EVENT LISTENERS
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // LOGIN FORM
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // MAIN APP EVENTS
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        const appModeSelector = document.getElementById('appModeSelector');
        if (appModeSelector) {
            appModeSelector.addEventListener('change', (e) => {
                this.switchMode(e.target.value);
            });
        }
        
        // Prime rate display click
        const primeRateDisplay = document.getElementById('primeRateDisplay');
        if (primeRateDisplay) {
            primeRateDisplay.addEventListener('click', () => {
                this.showUpdatePrimeRateModal();
            });
        }
        
        // Global click handler
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });
        
        // Filter changes
        const loanFilter = document.getElementById('loanFilter');
        if (loanFilter) {
            loanFilter.addEventListener('change', () => {
                this.renderPaymentSchedule();
            });
        }
    }
    
    handleGlobalClick(e) {
        // Navigation links
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const view = e.target.getAttribute('data-view');
            this.showView(view);
        }
        
        // Time filter buttons
        if (e.target.classList.contains('time-filter-btn')) {
            const filter = e.target.getAttribute('data-filter');
            this.currentFilter = filter;
            
            document.querySelectorAll('.time-filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            this.renderPaymentSchedule();
        }
        
        // Payment action buttons
        if (e.target.classList.contains('btn-pay')) {
            const paymentId = e.target.getAttribute('data-payment-id');
            this.recordPayment(paymentId);
        }
        
        if (e.target.classList.contains('btn-miss')) {
            const paymentId = e.target.getAttribute('data-payment-id');
            this.recordMissedPayment(paymentId);
        }
        
        if (e.target.classList.contains('btn-undo')) {
            const paymentId = e.target.getAttribute('data-payment-id');
            this.undoPaymentStatus(paymentId);
        }
        
        // Add buttons
        if (e.target.id === 'addLoanBtn' || e.target.id === 'quickAddLoanBtn') {
            this.showAddLoanModal();
        }
        
        if (e.target.id === 'addPropertyBtn') {
            this.showAddPropertyModal();
        }
        
        if (e.target.id === 'addTenantBtn') {
            this.showAddTenantModal();
        }
        
        // Edit buttons
        if (e.target.classList.contains('btn-edit-loan')) {
            const loanId = parseInt(e.target.getAttribute('data-loan-id'));
            this.showEditLoanModal(loanId);
        }
        
        if (e.target.classList.contains('btn-edit-tenant')) {
            const tenantId = parseInt(e.target.getAttribute('data-tenant-id'));
            this.showEditTenantModal(tenantId);
        }
        
        // Delete buttons
        if (e.target.classList.contains('btn-delete-loan')) {
            const loanId = parseInt(e.target.getAttribute('data-loan-id'));
            this.deleteLoan(loanId);
        }
        
        if (e.target.classList.contains('btn-delete-property')) {
            const propertyId = parseInt(e.target.getAttribute('data-property-id'));
            this.deleteProperty(propertyId);
        }
        
        if (e.target.classList.contains('btn-delete-tenant')) {
            const tenantId = parseInt(e.target.getAttribute('data-tenant-id'));
            this.deleteTenant(tenantId);
        }
        
        // Modal close
        if (e.target.classList.contains('modal-close')) {
            this.closeModal();
        }
        
        // Tranche buttons
        if (e.target.classList.contains('btn-add-tranche')) {
            const loanId = parseInt(e.target.getAttribute('data-loan-id'));
            this.showAddTrancheModal(loanId);
        }
    }
    
    // LOGIN LOGIC
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username: 'admin', name: 'Administrator' };
            
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
            
            this.showMainApp();
        } else {
            if (errorDiv) {
                errorDiv.style.display = 'block';
            }
        }
    }
    
    showMainApp() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen && mainApp) {
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            
            this.initializeMainApp();
        }
    }
    
    initializeMainApp() {
        this.updateNavigation();
        this.populateFilters();
        this.renderDashboard();
    }
    
    handleLogout() {
        this.currentUser = null;
        
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen && mainApp) {
            mainApp.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            
            document.getElementById('username').value = 'admin';
            document.getElementById('password').value = 'admin123';
        }
    }
    
    // NAVIGATION
    updateNavigation() {
        const sidebarNav = document.getElementById('sidebarNav');
        if (!sidebarNav) return;
        
        let navItems = [];
        
        if (this.currentMode === 'loan') {
            navItems = [
                { view: 'dashboard', label: 'Dashboard', icon: '📊' },
                { view: 'loans', label: 'All Loans', icon: '💰' },
                { view: 'new-loan', label: 'New Loan', icon: '➕' },
                { view: 'payment-schedule', label: 'Payment Schedule', icon: '📅' },
                { view: 'reports', label: 'Reports', icon: '📈' },
                { view: 'settings', label: 'Settings', icon: '⚙️' }
            ];
        } else {
            navItems = [
                { view: 'dashboard', label: 'Dashboard', icon: '📊' },
                { view: 'properties', label: 'Properties', icon: '🏢' },
                { view: 'tenants', label: 'Tenants', icon: '👥' },
                { view: 'rent-schedule', label: 'Rent Schedule', icon: '📅' },
                { view: 'reports', label: 'Reports', icon: '📈' },
                { view: 'settings', label: 'Settings', icon: '⚙️' }
            ];
        }
        
        sidebarNav.innerHTML = navItems.map(item => `
            <li>
                <a href="#" class="nav-link ${this.currentView === item.view ? 'active' : ''}" 
                   data-view="${item.view}">
                    <span class="nav-icon">${item.icon}</span>
                    <span class="nav-text">${item.label}</span>
                </a>
            </li>
        `).join('');
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        
        const appTitle = document.getElementById('appTitle');
        if (appTitle) {
            appTitle.textContent = mode === 'loan' ? '💰 Loan Management' : '🏢 Real Estate Management';
        }
        
        this.updateNavigation();
        this.showView('dashboard');
    }
    
    showView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
            }
        });
        
        this.currentView = viewName;
        
        switch (viewName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'loans':
                this.renderLoansView();
                break;
            case 'payment-schedule':
                this.renderPaymentSchedule();
                break;
            case 'properties':
                this.renderPropertiesView();
                break;
            case 'tenants':
                this.renderTenantsView();
                break;
            case 'rent-schedule':
                this.renderRentScheduleView();
                break;
        }
    }
    
    // PRIME RATE MANAGEMENT
    updatePrimeRateDisplay() {
        const primeRateValue = document.getElementById('primeRateValue');
        if (primeRateValue) {
            primeRateValue.textContent = this.primeRate.toFixed(2);
        }
        
        const settingsPrimeRate = document.getElementById('settingsPrimeRate');
        if (settingsPrimeRate) {
            settingsPrimeRate.value = this.primeRate.toFixed(2);
        }
    }
    
    showUpdatePrimeRateModal() {
        const modalContainer = document.getElementById('modalContainer');
        if (!modalContainer) return;
        
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Update Prime Rate</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="updatePrimeRateForm">
                        <div class="form-group">
                            <label class="form-label">New Prime Rate (%)</label>
                            <input type="number" id="newPrimeRate" class="form-control" 
                                   step="0.01" value="${this.primeRate.toFixed(2)}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Effective Date</label>
                            <input type="date" id="effectiveDate" class="form-control" 
                                   value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Update Prime Rate</button>
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const form = document.getElementById('updatePrimeRateForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePrimeRate();
            });
        }
    }
    
    updatePrimeRate() {
        const newRate = parseFloat(document.getElementById('newPrimeRate').value);
        const effectiveDate = document.getElementById('effectiveDate').value;
        
        if (!newRate || !effectiveDate) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const oldRate = this.primeRate;
        this.primeRate = newRate;
        
        // Save to history
        this.primeRateHistory.push({
            rate: newRate,
            effectiveDate: effectiveDate,
            previousRate: oldRate,
            updatedAt: new Date().toISOString()
        });
        
        // Update all variable rate loans
        this.updateVariableRateLoans(effectiveDate, oldRate, newRate);
        
        // Save data
        localStorage.setItem('primeRate', newRate.toString());
        localStorage.setItem('primeRateHistory', JSON.stringify(this.primeRateHistory));
        this.saveData('loans', this.loans);
        
        this.updatePrimeRateDisplay();
        this.closeModal();
        
        this.showNotification(`Prime rate updated to ${newRate.toFixed(2)}%. All variable rate loans recalculated.`, 'success');
        
        // Refresh displays
        this.renderDashboard();
        this.renderLoansView();
        this.renderPaymentSchedule();
    }
    
    updateVariableRateLoans(effectiveDate, oldRate, newRate) {
        const effectiveDateObj = new Date(effectiveDate);
        
        this.loans.forEach(loan => {
            if (loan.rateType === 'variable') {
                // Calculate new rate
                const newLoanRate = newRate + (loan.spread || 0);
                loan.interestRate = newLoanRate;
                
                // Recalculate payment schedule from effective date
                this.recalculateLoanFromDate(loan, effectiveDate, oldRate, newRate);
            }
        });
    }
    
    recalculateLoanFromDate(loan, effectiveDate, oldPrimeRate, newPrimeRate) {
        const effectiveDateObj = new Date(effectiveDate);
        const loanPayments = this.payments.filter(p => p.loanId === loan.id);
        
        // Find payments affected by rate change
        const affectedPayments = loanPayments.filter(p => {
            const paymentDate = new Date(p.dueDate);
            return paymentDate >= effectiveDateObj && (p.status === 'upcoming' || p.status === 'overdue');
        });
        
        if (affectedPayments.length > 0) {
            // Recalculate monthly payment
            const remainingBalance = loan.currentBalance;
            const remainingTerms = affectedPayments.length;
            const newMonthlyRate = loan.interestRate / 100 / 12;
            
            if (loan.paymentType === 'blended') {
                const newPayment = remainingBalance * 
                    (newMonthlyRate * Math.pow(1 + newMonthlyRate, remainingTerms)) / 
                    (Math.pow(1 + newMonthlyRate, remainingTerms) - 1);
                
                loan.monthlyPayment = newPayment;
                
                // Update payment schedule
                let balance = remainingBalance;
                affectedPayments.forEach(payment => {
                    const interest = balance * newMonthlyRate;
                    const principal = newPayment - interest;
                    
                    payment.amount = newPayment;
                    payment.interest = interest;
                    payment.principal = principal;
                    payment.balance = Math.max(0, balance - principal);
                    
                    balance -= principal;
                });
            } else if (loan.paymentType === 'interest_only') {
                const newInterestPayment = remainingBalance * newMonthlyRate;
                loan.monthlyPayment = newInterestPayment;
                
                affectedPayments.forEach(payment => {
                    payment.amount = newInterestPayment;
                    payment.interest = newInterestPayment;
                    payment.principal = 0;
                    payment.balance = remainingBalance;
                });
            }
        }
    }
    
    // DASHBOARD RENDERING
    renderDashboard() {
        const metricsContainer = document.getElementById('dashboardMetrics');
        if (!metricsContainer) return;
        
        if (this.currentMode === 'loan') {
            const totalLoans = this.loans.length;
            const totalBalance = this.loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
            const monthlyPayments = this.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
            const nextPayment = this.getNextPaymentDate();
            
            metricsContainer.innerHTML = `
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Total Loans</div>
                        <div class="metric-icon">📊</div>
                    </div>
                    <div class="metric-value">${totalLoans}</div>
                    <div class="metric-subtitle">Active loan accounts</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Outstanding Balance</div>
                        <div class="metric-icon">💰</div>
                    </div>
                    <div class="metric-value">$${this.formatCurrency(totalBalance)}</div>
                    <div class="metric-subtitle">Total principal owed</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Monthly Income</div>
                        <div class="metric-icon">📈</div>
                    </div>
                    <div class="metric-value">$${this.formatCurrency(monthlyPayments)}</div>
                    <div class="metric-subtitle">Expected monthly revenue</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Next Payment</div>
                        <div class="metric-icon">📅</div>
                    </div>
                    <div class="metric-value">${nextPayment ? this.formatDate(nextPayment) : 'None'}</div>
                    <div class="metric-subtitle">Upcoming payment due</div>
                </div>
            `;
        } else {
            const totalProperties = this.properties.length;
            const totalValue = this.properties.reduce((sum, prop) => sum + (prop.value || 0), 0);
            const monthlyRent = this.properties.reduce((sum, prop) => sum + (prop.monthlyRent || 0), 0);
            const totalTenants = this.tenants.length;
            
            metricsContainer.innerHTML = `
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Properties</div>
                        <div class="metric-icon">🏢</div>
                    </div>
                    <div class="metric-value">${totalProperties}</div>
                    <div class="metric-subtitle">Total properties managed</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Portfolio Value</div>
                        <div class="metric-icon">💰</div>
                    </div>
                    <div class="metric-value">$${this.formatCurrency(totalValue)}</div>
                    <div class="metric-subtitle">Total property value</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Monthly Rent</div>
                        <div class="metric-icon">📈</div>
                    </div>
                    <div class="metric-value">$${this.formatCurrency(monthlyRent)}</div>
                    <div class="metric-subtitle">Expected rental income</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Active Tenants</div>
                        <div class="metric-icon">👥</div>
                    </div>
                    <div class="metric-value">${totalTenants}</div>
                    <div class="metric-subtitle">Current tenant count</div>
                </div>
            `;
        }
    }
    
    // LOANS VIEW
    renderLoansView() {
        const loansTable = document.getElementById('loansTable');
        if (!loansTable) return;
        
        if (this.loans.length === 0) {
            loansTable.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No loans found. Click "Add New Loan" to get started.</div>';
            return;
        }
        
        loansTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Borrower</th>
                        <th>Original Amount</th>
                        <th>Current Balance</th>
                        <th>Rate Type</th>
                        <th>Rate</th>
                        <th>Term</th>
                        <th>Monthly Payment</th>
                        <th>Next Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.loans.map(loan => {
                        const rateDisplay = loan.rateType === 'variable' ? 
                            `${loan.interestRate.toFixed(2)}% (P+${(loan.spread || 0).toFixed(2)})` : 
                            `${loan.interestRate.toFixed(2)}%`;
                        
                        return `
                            <tr>
                                <td>
                                    <strong>${loan.borrowerName}</strong><br>
                                    <small>${loan.borrowerEmail || 'No email'}</small>
                                </td>
                                <td>$${this.formatCurrency(loan.originalAmount)}</td>
                                <td>$${this.formatCurrency(loan.currentBalance)}</td>
                                <td>
                                    <span class="status-badge status-${loan.rateType || 'fixed'}">${(loan.rateType || 'fixed').toUpperCase()}</span>
                                </td>
                                <td>${rateDisplay}</td>
                                <td>${loan.termMonths} months</td>
                                <td>$${this.formatCurrency(loan.monthlyPayment)}</td>
                                <td>${this.getNextPaymentForLoan(loan.id)}</td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-sm btn-primary btn-edit-loan" data-loan-id="${loan.id}">Edit</button>
                                        <button class="btn btn-sm btn-warning btn-add-tranche" data-loan-id="${loan.id}">Tranche</button>
                                        <button class="btn btn-sm btn-danger btn-delete-loan" data-loan-id="${loan.id}">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    // ADD/EDIT LOAN MODAL - ENHANCED WITH BANKING FEATURES
    showAddLoanModal(loan = null) {
        const modalContainer = document.getElementById('modalContainer');
        if (!modalContainer) return;
        
        const isEdit = loan !== null;
        const modalTitle = isEdit ? 'Edit Loan' : 'Add New Loan';
        
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${modalTitle}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="${isEdit ? 'editLoanForm' : 'addLoanForm'}">
                        <div class="form-section">
                            <h4>Borrower Information</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="borrowerName">Borrower Name *</label>
                                    <input type="text" id="borrowerName" class="form-control" value="${loan?.borrowerName || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="borrowerEmail">Email Address</label>
                                    <input type="email" id="borrowerEmail" class="form-control" value="${loan?.borrowerEmail || ''}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Loan Details</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="loanAmount">Loan Amount *</label>
                                    <input type="number" id="loanAmount" class="form-control" step="0.01" value="${loan?.originalAmount || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="termMonths">Term (Months) *</label>
                                    <input type="number" id="termMonths" class="form-control" min="1" value="${loan?.termMonths || ''}" required>
                                </div>
                            </div>
                            
                            <div class="rate-type-selector">
                                <h4>Interest Rate Configuration</h4>
                                <div class="rate-options">
                                    <div class="rate-option">
                                        <input type="radio" id="rateFixed" name="rateType" value="fixed" ${!loan || loan.rateType === 'fixed' ? 'checked' : ''}>
                                        <label for="rateFixed">Fixed Rate</label>
                                    </div>
                                    <div class="rate-option">
                                        <input type="radio" id="rateVariable" name="rateType" value="variable" ${loan?.rateType === 'variable' ? 'checked' : ''}>
                                        <label for="rateVariable">Variable Rate (Prime + Spread)</label>
                                    </div>
                                </div>
                                
                                <div id="fixedRateDetails" class="rate-details ${!loan || loan.rateType === 'fixed' ? 'active' : ''}">
                                    <div class="form-group">
                                        <label class="form-label" for="fixedRate">Fixed Annual Rate (%)</label>
                                        <input type="number" id="fixedRate" class="form-control" step="0.01" value="${loan?.rateType === 'fixed' ? loan.interestRate : '6.50'}">
                                    </div>
                                </div>
                                
                                <div id="variableRateDetails" class="rate-details ${loan?.rateType === 'variable' ? 'active' : ''}">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Current Prime Rate</label>
                                            <input type="text" class="form-control" value="${this.primeRate.toFixed(2)}%" disabled>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label" for="spread">Spread (+/-) %</label>
                                            <input type="number" id="spread" class="form-control" step="0.01" value="${loan?.spread || '1.00'}">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Effective Rate</label>
                                            <input type="text" id="effectiveRate" class="form-control" value="${loan?.rateType === 'variable' ? loan.interestRate.toFixed(2) + '%' : (this.primeRate + 1.00).toFixed(2) + '%'}" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="paymentType">Payment Type *</label>
                                    <select id="paymentType" class="form-control" required>
                                        <option value="">Select Payment Type</option>
                                        <option value="blended" ${loan?.paymentType === 'blended' ? 'selected' : ''}>Blended (Principal + Interest)</option>
                                        <option value="interest_only" ${loan?.paymentType === 'interest_only' ? 'selected' : ''}>Interest Only</option>
                                        <option value="accruing" ${loan?.paymentType === 'accruing' ? 'selected' : ''}>Accruing Interest</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="calculationMethod">Calculation Method</label>
                                    <select id="calculationMethod" class="form-control">
                                        <option value="fixed_monthly" ${loan?.calculationMethod === 'fixed_monthly' ? 'selected' : ''}>Fixed Monthly (1/12 yearly)</option>
                                        <option value="actual_days" ${loan?.calculationMethod === 'actual_days' ? 'selected' : ''}>Actual Days</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="startDate">Start Date *</label>
                                    <input type="date" id="startDate" class="form-control" value="${loan?.startDate || new Date().toISOString().split('T')[0]}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="paymentDay">Payment Day of Month</label>
                                    <select id="paymentDay" class="form-control">
                                        <option value="1" ${loan?.paymentDay === 1 ? 'selected' : ''}>1st</option>
                                        <option value="15" ${loan?.paymentDay === 15 ? 'selected' : ''}>15th</option>
                                        <option value="30" ${loan?.paymentDay === 30 ? 'selected' : ''}>Last Day</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="originationFee">Origination Fee ($)</label>
                                    <input type="number" id="originationFee" class="form-control" step="0.01" value="${loan?.originationFee || '0'}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="renewalFee">Renewal Fee ($)</label>
                                    <input type="number" id="renewalFee" class="form-control" step="0.01" value="${loan?.renewalFee || '0'}">
                                </div>
                            </div>
                        </div>
                        
                        ${isEdit ? `
                        <div class="form-section">
                            <h4>Loan Modifications</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="currentBalance">Current Balance</label>
                                    <input type="number" id="currentBalance" class="form-control" step="0.01" value="${loan.currentBalance}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="additionalRenewalFee">Additional Renewal Fee ($)</label>
                                    <input type="number" id="additionalRenewalFee" class="form-control" step="0.01" value="0">
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Loan' : 'Create Loan'}</button>
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Setup rate type switching
        const rateTypeRadios = document.querySelectorAll('input[name="rateType"]');
        const fixedDetails = document.getElementById('fixedRateDetails');
        const variableDetails = document.getElementById('variableRateDetails');
        const spreadInput = document.getElementById('spread');
        const effectiveRateInput = document.getElementById('effectiveRate');
        
        rateTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'fixed') {
                    fixedDetails.classList.add('active');
                    variableDetails.classList.remove('active');
                } else {
                    fixedDetails.classList.remove('active');
                    variableDetails.classList.add('active');
                }
            });
        });
        
        // Update effective rate calculation
        if (spreadInput) {
            spreadInput.addEventListener('input', () => {
                const spread = parseFloat(spreadInput.value) || 0;
                const effectiveRate = this.primeRate + spread;
                effectiveRateInput.value = effectiveRate.toFixed(2) + '%';
            });
        }
        
        // Handle form submission
        const form = document.getElementById(isEdit ? 'editLoanForm' : 'addLoanForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (isEdit) {
                    this.updateLoan(loan.id);
                } else {
                    this.createLoan();
                }
            });
        }
    }
    
    showEditLoanModal(loanId) {
        const loan = this.loans.find(l => l.id === loanId);
        if (loan) {
            this.showAddLoanModal(loan);
        }
    }
    
    // CREATE/UPDATE LOAN
    createLoan() {
        const formData = this.collectLoanFormData();
        if (!formData) return;
        
        const newLoan = {
            id: this.getNextId('loan'),
            ...formData,
            status: 'active',
            createdDate: new Date().toISOString(),
            tranches: [{
                amount: formData.originalAmount,
                date: formData.startDate,
                type: 'original',
                balance: formData.originalAmount
            }]
        };
        
        this.loans.push(newLoan);
        this.generatePaymentScheduleForLoan(newLoan);
        
        this.saveData('loans', this.loans);
        this.saveData('payments', this.payments);
        
        this.closeModal();
        this.populateFilters();
        this.renderLoansView();
        this.renderDashboard();
        
        this.showNotification(`Loan for ${formData.borrowerName} created successfully!`, 'success');
    }
    
    updateLoan(loanId) {
        const formData = this.collectLoanFormData();
        if (!formData) return;
        
        const loanIndex = this.loans.findIndex(l => l.id === loanId);
        if (loanIndex === -1) {
            this.showNotification('Loan not found', 'error');
            return;
        }
        
        const loan = this.loans[loanIndex];
        
        // Update loan data
        Object.assign(loan, formData);
        
        // Handle additional renewal fee
        const additionalRenewalFee = parseFloat(document.getElementById('additionalRenewalFee').value) || 0;
        if (additionalRenewalFee > 0) {
            loan.renewalFee = (loan.renewalFee || 0) + additionalRenewalFee;
            loan.currentBalance += additionalRenewalFee;
        }
        
        loan.updatedDate = new Date().toISOString();
        
        // Regenerate payment schedule
        this.payments = this.payments.filter(p => p.loanId !== loanId);
        this.generatePaymentScheduleForLoan(loan);
        
        this.saveData('loans', this.loans);
        this.saveData('payments', this.payments);
        
        this.closeModal();
        this.populateFilters();
        this.renderLoansView();
        this.renderDashboard();
        
        this.showNotification(`Loan for ${formData.borrowerName} updated successfully!`, 'success');
    }
    
    collectLoanFormData() {
        const borrowerName = document.getElementById('borrowerName').value.trim();
        const borrowerEmail = document.getElementById('borrowerEmail').value.trim();
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const termMonths = parseInt(document.getElementById('termMonths').value);
        const paymentType = document.getElementById('paymentType').value;
        const startDate = document.getElementById('startDate').value;
        const paymentDay = parseInt(document.getElementById('paymentDay').value);
        const originationFee = parseFloat(document.getElementById('originationFee').value) || 0;
        const renewalFee = parseFloat(document.getElementById('renewalFee').value) || 0;
        const calculationMethod = document.getElementById('calculationMethod').value || 'fixed_monthly';
        const rateType = document.querySelector('input[name="rateType"]:checked').value;
        
        if (!borrowerName || !loanAmount || !termMonths || !paymentType || !startDate) {
            this.showNotification('Please fill in all required fields', 'error');
            return null;
        }
        
        let interestRate, spread = 0;
        
        if (rateType === 'fixed') {
            interestRate = parseFloat(document.getElementById('fixedRate').value);
        } else {
            spread = parseFloat(document.getElementById('spread').value) || 0;
            interestRate = this.primeRate + spread;
        }
        
        // Calculate monthly payment
        const monthlyRate = interestRate / 100 / 12;
        let monthlyPayment = 0;
        
        if (paymentType === 'blended') {
            monthlyPayment = loanAmount * 
                (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                (Math.pow(1 + monthlyRate, termMonths) - 1);
        } else if (paymentType === 'interest_only') {
            monthlyPayment = loanAmount * monthlyRate;
        } else if (paymentType === 'accruing') {
            monthlyPayment = 0;
        }
        
        return {
            borrowerName,
            borrowerEmail,
            originalAmount: loanAmount,
            currentBalance: parseFloat(document.getElementById('currentBalance')?.value) || loanAmount,
            interestRate,
            termMonths,
            paymentType,
            monthlyPayment,
            startDate,
            paymentDay,
            originationFee,
            renewalFee,
            calculationMethod,
            rateType,
            spread: rateType === 'variable' ? spread : 0
        };
    }
    
    // TRANCHE MANAGEMENT
    showAddTrancheModal(loanId) {
        const loan = this.loans.find(l => l.id === loanId);
        if (!loan) return;
        
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add Tranche - ${loan.borrowerName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="addTrancheForm">
                        <div class="form-section">
                            <h4>Tranche Details</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="trancheType">Type</label>
                                    <select id="trancheType" class="form-control" required>
                                        <option value="">Select Type</option>
                                        <option value="advance">Additional Advance</option>
                                        <option value="payment">Extra Payment</option>
                                        <option value="fee">Fee Addition</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="trancheAmount">Amount</label>
                                    <input type="number" id="trancheAmount" class="form-control" step="0.01" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="trancheDate">Date</label>
                                <input type="date" id="trancheDate" class="form-control" 
                                       value="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="trancheDescription">Description</label>
                                <textarea id="trancheDescription" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Tranche</button>
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const form = document.getElementById('addTrancheForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTranche(loanId);
        });
    }
    
    addTranche(loanId) {
        const loan = this.loans.find(l => l.id === loanId);
        if (!loan) return;
        
        const type = document.getElementById('trancheType').value;
        const amount = parseFloat(document.getElementById('trancheAmount').value);
        const date = document.getElementById('trancheDate').value;
        const description = document.getElementById('trancheDescription').value;
        
        if (!type || !amount || !date) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Initialize tranches array if it doesn't exist
        if (!loan.tranches) {
            loan.tranches = [{
                amount: loan.originalAmount,
                date: loan.startDate,
                type: 'original',
                balance: loan.originalAmount
            }];
        }
        
        const tranche = {
            id: Date.now(),
            type,
            amount,
            date,
            description,
            createdAt: new Date().toISOString()
        };
        
        // Apply tranche to loan balance
        if (type === 'advance' || type === 'fee') {
            loan.currentBalance += amount;
            tranche.balance = loan.currentBalance;
        } else if (type === 'payment') {
            loan.currentBalance = Math.max(0, loan.currentBalance - amount);
            tranche.balance = loan.currentBalance;
        }
        
        loan.tranches.push(tranche);
        
        // Regenerate payment schedule
        this.payments = this.payments.filter(p => p.loanId !== loanId);
        this.generatePaymentScheduleForLoan(loan);
        
        this.saveData('loans', this.loans);
        this.saveData('payments', this.payments);
        
        this.closeModal();
        this.renderLoansView();
        this.renderDashboard();
        
        this.showNotification(`Tranche added successfully to ${loan.borrowerName}'s loan`, 'success');
    }
    
    // PAYMENT SCHEDULE - ENHANCED
    renderPaymentSchedule() {
        const paymentRows = document.getElementById('paymentRows');
        if (!paymentRows) return;
        
        let payments = [...this.payments];
        
        // Filter by loan
        const loanFilter = document.getElementById('loanFilter');
        const selectedLoanId = loanFilter ? loanFilter.value : 'all';
        
        if (selectedLoanId !== 'all') {
            payments = payments.filter(p => p.loanId == selectedLoanId);
        }
        
        // Filter by time period
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (this.currentFilter === 'upcoming') {
            payments = payments.filter(p => {
                const dueDate = new Date(p.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate >= today && p.status === 'upcoming';
            });
        } else if (this.currentFilter === 'overdue') {
            payments = payments.filter(p => {
                const dueDate = new Date(p.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate < today && (p.status === 'upcoming' || p.status === 'overdue');
            });
        } else if (this.currentFilter === 'paid') {
            payments = payments.filter(p => p.status === 'paid');
        } else if (this.currentFilter === 'missed') {
            payments = payments.filter(p => p.status === 'missed');
        }
        
        // Sort payments
        if (this.currentFilter === 'upcoming' || this.currentFilter === 'overdue') {
            payments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else {
            payments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        }
        
        if (payments.length === 0) {
            paymentRows.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No payments found for selected filters.</div>';
            return;
        }
        
        // Find next payment
        const nextPayment = this.payments.find(p => {
            const dueDate = new Date(p.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate >= today && p.status === 'upcoming';
        });
        
        paymentRows.innerHTML = payments.map(payment => {
            const isNextPayment = nextPayment && payment.id === nextPayment.id;
            const dueDate = new Date(payment.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            let actualStatus = payment.status;
            if (payment.status === 'upcoming' && dueDate < today) {
                actualStatus = 'overdue';
            }
            
            return `
                <div class="table-row ${actualStatus} ${isNextPayment ? 'next-payment' : ''}">
                    <div>${this.formatDate(payment.dueDate)}</div>
                    <div>${payment.borrowerName}</div>
                    <div>$${this.formatCurrency(payment.amount)}</div>
                    <div>$${this.formatCurrency(payment.principal)}</div>
                    <div>$${this.formatCurrency(payment.interest)}</div>
                    <div>$${this.formatCurrency(payment.balance)}</div>
                    <div>
                        <span class="status-badge status-${actualStatus}">${actualStatus}</span>
                        ${isNextPayment ? ' <strong>(NEXT)</strong>' : ''}
                    </div>
                    <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                        ${actualStatus === 'upcoming' || actualStatus === 'overdue' ? `
                            <button class="btn btn-sm btn-success btn-pay" data-payment-id="${payment.id}">Pay</button>
                            <button class="btn btn-sm btn-danger btn-miss" data-payment-id="${payment.id}">Miss</button>
                        ` : actualStatus === 'paid' || actualStatus === 'missed' ? `
                            <button class="btn btn-sm btn-warning btn-undo" data-payment-id="${payment.id}">Undo</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // PAYMENT ACTIONS - FIXED FOR BANKING-GRADE ACCURACY
    recordPayment(paymentId) {
        console.log(`Recording payment: ${paymentId}`);
        
        const payment = this.findPaymentById(paymentId);
        if (!payment) return;
        
        const loan = this.loans.find(l => l.id === payment.loanId);
        if (!loan) return;
        
        payment.status = 'paid';
        payment.paidDate = new Date().toISOString().split('T')[0];
        
        // CRITICAL FIX: Only reduce balance by principal portion
        if (loan.paymentType === 'blended') {
            loan.currentBalance = Math.max(0, loan.currentBalance - payment.principal);
        }
        // For interest_only payments, balance should NOT be reduced
        
        this.saveData('loans', this.loans);
        this.saveData('payments', this.payments);
        this.renderPaymentSchedule();
        this.renderDashboard();
        this.renderLoansView();
        
        this.showNotification('Payment recorded successfully!', 'success');
    }
    
    recordMissedPayment(paymentId) {
        console.log(`Recording missed payment: ${paymentId}`);
        
        const payment = this.findPaymentById(paymentId);
        if (!payment) return;
        
        const loan = this.loans.find(l => l.id === payment.loanId);
        if (!loan) return;
        
        payment.status = 'missed';
        payment.missedDate = new Date().toISOString().split('T')[0];
        
        // CRITICAL FIX: Add missed interest to principal and recalculate properly
        const missedInterest = payment.interest;
        const oldBalance = loan.currentBalance;
        loan.currentBalance += missedInterest;
        
        console.log(`Added $${missedInterest} missed interest. Old balance: $${oldBalance}, New balance: $${loan.currentBalance}`);
        
        // Recalculate ALL future payments with new balance
        this.recalculateAllFuturePayments(loan);
        
        this.saveData('loans', this.loans);
        this.saveData('payments', this.payments);
        
        this.renderPaymentSchedule();
        this.renderDashboard();
        this.renderLoansView();
        
        this.showNotification(
            `Payment missed! Interest of $${this.formatCurrency(missedInterest)} added to principal. New balance: $${this.formatCurrency(loan.currentBalance)}`,
            'warning'
        );
    }
    
    recalculateAllFuturePayments(loan) {
        console.log(`Recalculating future payments for loan ${loan.id}`);
        
        const futurePayments = this.payments.filter(p => 
            p.loanId === loan.id && 
            (p.status === 'upcoming' || p.status === 'overdue')
        ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        if (futurePayments.length === 0) return;
        
        const monthlyRate = loan.interestRate / 100 / 12;
        let remainingBalance = loan.currentBalance;
        
        if (loan.paymentType === 'blended') {
            // Recalculate payment amount for remaining term
            const remainingPayments = futurePayments.length;
            const newPaymentAmount = remainingBalance * 
                (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments)) / 
                (Math.pow(1 + monthlyRate, remainingPayments) - 1);
            
            loan.monthlyPayment = newPaymentAmount;
            
            // Update each future payment
            futurePayments.forEach(payment => {
                const interestPortion = remainingBalance * monthlyRate;
                const principalPortion = newPaymentAmount - interestPortion;
                
                payment.amount = newPaymentAmount;
                payment.interest = interestPortion;
                payment.principal = principalPortion;
                payment.balance = Math.max(0, remainingBalance - principalPortion);
                
                remainingBalance -= principalPortion;
            });
            
            console.log(`Updated to new payment amount: $${newPaymentAmount}`);
        } else if (loan.paymentType === 'interest_only') {
            // Update interest-only payments with new balance
            const newInterestPayment = remainingBalance * monthlyRate;
            loan.monthlyPayment = newInterestPayment;
            
            futurePayments.forEach(payment => {
                payment.amount = newInterestPayment;
                payment.interest = newInterestPayment;
                payment.principal = 0;
                payment.balance = remainingBalance;
            });
            
            console.log(`Updated interest-only payment to: $${newInterestPayment}`);
        }
    }
    
    undoPaymentStatus(paymentId) {
        const payment = this.findPaymentById(paymentId);
        if (!payment) return;
        
        const loan = this.loans.find(l => l.id === payment.loanId);
        if (!loan) return;
        
        // Restore balance if payment was previously recorded
        if (payment.status === 'paid' && loan.paymentType === 'blended') {
            loan.currentBalance += payment.principal;
        } else if (payment.status === 'missed') {
            loan.currentBalance -= payment.interest;
            this.recalculateAllFuturePayments(loan);
        }
        
        const today = new Date();
        const dueDate = new Date(payment.dueDate);
        
        if (dueDate > today) {
            payment.status = 'upcoming';
        } else {
            payment.status = 'overdue';
        }
        
        payment.paidDate = null;
        payment.missedDate = null;
        
        this.saveData('loans', this.loans);
        this.saveData('payments', this.payments);
        this.renderPaymentSchedule();
        this.renderDashboard();
        this.renderLoansView();
        
        this.showNotification('Payment status reset', 'success');
    }
    
    // TENANT MANAGEMENT - ENHANCED WITH PROPER DATE HANDLING
    showAddTenantModal(tenant = null) {
        const modalContainer = document.getElementById('modalContainer');
        if (!modalContainer) return;
        
        const isEdit = tenant !== null;
        const modalTitle = isEdit ? 'Edit Tenant' : 'Add New Tenant';
        
        // Calculate proper lease end date (1 year from start)
        const defaultStartDate = new Date();
        defaultStartDate.setDate(1); // Start on 1st of month
        const defaultEndDate = new Date(defaultStartDate);
        defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
        defaultEndDate.setDate(defaultEndDate.getDate() - 1); // End on last day of month before anniversary
        
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${modalTitle}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="${isEdit ? 'editTenantForm' : 'addTenantForm'}">
                        <div class="form-section">
                            <h4>Tenant Information</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="tenantName">Tenant Name *</label>
                                    <input type="text" id="tenantName" class="form-control" value="${tenant?.name || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="tenantEmail">Email Address</label>
                                    <input type="email" id="tenantEmail" class="form-control" value="${tenant?.email || ''}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Property & Unit Details</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="tenantProperty">Property *</label>
                                    <select id="tenantProperty" class="form-control" required>
                                        <option value="">Select Property</option>
                                        ${this.properties.map(prop => `
                                            <option value="${prop.id}" ${tenant?.propertyId === prop.id ? 'selected' : ''}>${prop.name}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="tenantUnit">Unit Number</label>
                                    <input type="text" id="tenantUnit" class="form-control" value="${tenant?.unitNumber || ''}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Lease Terms</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="leaseStart">Lease Start Date *</label>
                                    <input type="date" id="leaseStart" class="form-control" 
                                           value="${tenant?.leaseStart || defaultStartDate.toISOString().split('T')[0]}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="leaseEnd">Lease End Date *</label>
                                    <input type="date" id="leaseEnd" class="form-control" 
                                           value="${tenant?.leaseEnd || defaultEndDate.toISOString().split('T')[0]}" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="monthlyRent">Monthly Rent *</label>
                                    <input type="number" id="monthlyRent" class="form-control" step="0.01" 
                                           value="${tenant?.monthlyRent || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="rentDueDay">Rent Due Day</label>
                                    <select id="rentDueDay" class="form-control">
                                        <option value="1" ${tenant?.rentDueDay === 1 ? 'selected' : ''}>1st of each month</option>
                                        <option value="15" ${tenant?.rentDueDay === 15 ? 'selected' : ''}>15th of each month</option>
                                        <option value="30" ${tenant?.rentDueDay === 30 ? 'selected' : ''}>Last day of each month</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="securityDeposit">Security Deposit</label>
                                    <input type="number" id="securityDeposit" class="form-control" step="0.01" 
                                           value="${tenant?.securityDeposit || '0'}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="leaseType">Lease Type</label>
                                    <select id="leaseType" class="form-control">
                                        <option value="fixed" ${tenant?.leaseType === 'fixed' ? 'selected' : ''}>Fixed Rate</option>
                                        <option value="escalating" ${tenant?.leaseType === 'escalating' ? 'selected' : ''}>Escalating</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div id="escalatingRentDetails" class="form-section" style="display: ${tenant?.leaseType === 'escalating' ? 'block' : 'none'};">
                                <h4>Rent Escalation</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label" for="escalationRate">Annual Increase (%)</label>
                                        <input type="number" id="escalationRate" class="form-control" step="0.1" 
                                               value="${tenant?.escalationRate || '3.0'}">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="escalationDate">Escalation Date</label>
                                        <select id="escalationDate" class="form-control">
                                            <option value="anniversary" ${tenant?.escalationDate === 'anniversary' ? 'selected' : ''}>Lease Anniversary</option>
                                            <option value="january" ${tenant?.escalationDate === 'january' ? 'selected' : ''}>January 1st</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Tenant' : 'Add Tenant'}</button>
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Setup lease type switching
        const leaseTypeSelect = document.getElementById('leaseType');
        const escalatingDetails = document.getElementById('escalatingRentDetails');
        
        leaseTypeSelect.addEventListener('change', () => {
            if (leaseTypeSelect.value === 'escalating') {
                escalatingDetails.style.display = 'block';
            } else {
                escalatingDetails.style.display = 'none';
            }
        });
        
        // Auto-calculate lease end date
        const leaseStartInput = document.getElementById('leaseStart');
        const leaseEndInput = document.getElementById('leaseEnd');
        
        leaseStartInput.addEventListener('change', () => {
            const startDate = new Date(leaseStartInput.value);
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            endDate.setDate(endDate.getDate() - 1);
            leaseEndInput.value = endDate.toISOString().split('T')[0];
        });
        
        // Handle form submission
        const form = document.getElementById(isEdit ? 'editTenantForm' : 'addTenantForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (isEdit) {
                    this.updateTenant(tenant.id);
                } else {
                    this.createTenant();
                }
            });
        }
    }
    
    showEditTenantModal(tenantId) {
        const tenant = this.tenants.find(t => t.id === tenantId);
        if (tenant) {
            this.showAddTenantModal(tenant);
        }
    }
    
    createTenant() {
        const tenantData = this.collectTenantFormData();
        if (!tenantData) return;
        
        const newTenant = {
            id: this.getNextId('tenant'),
            ...tenantData,
            status: 'active',
            createdDate: new Date().toISOString()
        };
        
        this.tenants.push(newTenant);
        
        // Generate rent payment schedule
        this.generateRentScheduleForTenant(newTenant);
        
        this.saveData('tenants', this.tenants);
        this.saveData('rentPayments', this.rentPayments);
        
        this.closeModal();
        this.renderTenantsView();
        this.renderRentScheduleView();
        this.renderDashboard();
        
        this.showNotification(`Tenant "${tenantData.name}" added successfully!`, 'success');
    }
    
    updateTenant(tenantId) {
        const tenantData = this.collectTenantFormData();
        if (!tenantData) return;
        
        const tenantIndex = this.tenants.findIndex(t => t.id === tenantId);
        if (tenantIndex === -1) {
            this.showNotification('Tenant not found', 'error');
            return;
        }
        
        const tenant = this.tenants[tenantIndex];
        Object.assign(tenant, tenantData);
        tenant.updatedDate = new Date().toISOString();
        
        // Regenerate rent schedule
        this.rentPayments = this.rentPayments.filter(rp => rp.tenantId !== tenantId);
        this.generateRentScheduleForTenant(tenant);
        
        this.saveData('tenants', this.tenants);
        this.saveData('rentPayments', this.rentPayments);
        
        this.closeModal();
        this.renderTenantsView();
        this.renderRentScheduleView();
        this.renderDashboard();
        
        this.showNotification(`Tenant "${tenantData.name}" updated successfully!`, 'success');
    }
    
    collectTenantFormData() {
        const name = document.getElementById('tenantName').value.trim();
        const email = document.getElementById('tenantEmail').value.trim();
        const propertyId = parseInt(document.getElementById('tenantProperty').value);
        const unitNumber = document.getElementById('tenantUnit').value.trim();
        const leaseStart = document.getElementById('leaseStart').value;
        const leaseEnd = document.getElementById('leaseEnd').value;
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
        const rentDueDay = parseInt(document.getElementById('rentDueDay').value);
        const securityDeposit = parseFloat(document.getElementById('securityDeposit').value) || 0;
        const leaseType = document.getElementById('leaseType').value;
        const escalationRate = parseFloat(document.getElementById('escalationRate').value) || 0;
        const escalationDate = document.getElementById('escalationDate').value;
        
        if (!name || !propertyId || !leaseStart || !leaseEnd || !monthlyRent) {
            this.showNotification('Please fill in all required fields', 'error');
            return null;
        }
        
        return {
            name,
            email,
            propertyId,
            unitNumber,
            leaseStart,
            leaseEnd,
            monthlyRent,
            rentDueDay,
            securityDeposit,
            leaseType,
            escalationRate,
            escalationDate
        };
    }
    
    // RENT SCHEDULE GENERATION - FIXED TO START FROM LEASE START DATE FORWARD
    generateRentScheduleForTenant(tenant) {
        const startDate = new Date(tenant.leaseStart);
        const endDate = new Date(tenant.leaseEnd);
        const rentDueDay = tenant.rentDueDay || 1;
        
        let currentDate = new Date(startDate);
        
        // Set to the first payment date (rent due day)
        currentDate.setDate(rentDueDay);
        
        // If the due day has already passed in the start month, move to next month
        if (currentDate < startDate) {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        let paymentNumber = 1;
        let currentRent = tenant.monthlyRent;
        
        while (currentDate <= endDate) {
            const property = this.properties.find(p => p.id === tenant.propertyId);
            
            // Calculate rent escalation if applicable
            if (tenant.leaseType === 'escalating' && paymentNumber > 12) {
                if (tenant.escalationDate === 'anniversary' && paymentNumber === 13) {
                    currentRent = tenant.monthlyRent * (1 + (tenant.escalationRate || 3) / 100);
                } else if (tenant.escalationDate === 'january' && currentDate.getMonth() === 0 && paymentNumber > 12) {
                    currentRent = currentRent * (1 + (tenant.escalationRate || 3) / 100);
                }
            }
            
            this.rentPayments.push({
                id: `${tenant.id}_${paymentNumber}`,
                tenantId: tenant.id,
                propertyId: tenant.propertyId,
                unitNumber: tenant.unitNumber,
                dueDate: currentDate.toISOString().split('T')[0],
                amount: currentRent,
                status: 'upcoming'
            });
            
            // Move to next month
            currentDate.setMonth(currentDate.getMonth() + 1);
            paymentNumber++;
        }
    }
    
    // RENDER VIEWS
    renderTenantsView() {
        const tenantsTable = document.getElementById('tenantsTable');
        if (!tenantsTable) return;
        
        if (this.tenants.length === 0) {
            tenantsTable.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No tenants found. Click "Add Tenant" to get started.</div>';
            return;
        }
        
        tenantsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Tenant Name</th>
                        <th>Property</th>
                        <th>Unit</th>
                        <th>Monthly Rent</th>
                        <th>Lease Start</th>
                        <th>Lease End</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.tenants.map(tenant => {
                        const property = this.properties.find(p => p.id === tenant.propertyId);
                        return `
                            <tr>
                                <td>
                                    <strong>${tenant.name}</strong><br>
                                    <small>${tenant.email || 'No email'}</small>
                                </td>
                                <td>${property ? property.name : 'Unknown Property'}</td>
                                <td>${tenant.unitNumber || 'N/A'}</td>
                                <td>$${this.formatCurrency(tenant.monthlyRent)}</td>
                                <td>${this.formatDate(tenant.leaseStart)}</td>
                                <td>${this.formatDate(tenant.leaseEnd)}</td>
                                <td><span class="status-badge status-${tenant.status || 'active'}">${(tenant.status || 'active').toUpperCase()}</span></td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-sm btn-primary btn-edit-tenant" data-tenant-id="${tenant.id}">Edit</button>
                                        <button class="btn btn-sm btn-danger btn-delete-tenant" data-tenant-id="${tenant.id}">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    renderRentScheduleView() {
        const rentScheduleTable = document.getElementById('rentScheduleTable');
        if (!rentScheduleTable) return;
        
        if (this.rentPayments.length === 0) {
            rentScheduleTable.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No rent payments scheduled.</div>';
            return;
        }
        
        const sortedPayments = [...this.rentPayments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        rentScheduleTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Due Date</th>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Unit</th>
                        <th>Rent Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedPayments.map(payment => {
                        const tenant = this.tenants.find(t => t.id === payment.tenantId);
                        const property = this.properties.find(p => p.id === payment.propertyId);
                        return `
                            <tr>
                                <td>${this.formatDate(payment.dueDate)}</td>
                                <td>${tenant ? tenant.name : 'Unknown Tenant'}</td>
                                <td>${property ? property.name : 'Unknown Property'}</td>
                                <td>${payment.unitNumber || 'N/A'}</td>
                                <td>$${this.formatCurrency(payment.amount)}</td>
                                <td><span class="status-badge status-${payment.status}">${payment.status.toUpperCase()}</span></td>
                                <td>
                                    ${payment.status === 'upcoming' ? `
                                        <button class="btn btn-sm btn-success" onclick="businessManager.markRentPaid('${payment.id}')">Mark Paid</button>
                                    ` : ''}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    renderPropertiesView() {
        const propertiesGrid = document.getElementById('propertiesGrid');
        if (!propertiesGrid) return;
        
        if (this.properties.length === 0) {
            propertiesGrid.innerHTML = '<div style="padding: 3rem; text-align: center; color: #64748b;"><h3>No properties found</h3><p>Click "Add Property" to get started</p></div>';
            return;
        }
        
        propertiesGrid.innerHTML = this.properties.map(property => `
            <div class="property-card">
                <div class="property-actions">
                    <button class="btn btn-sm btn-danger btn-delete-property" data-property-id="${property.id}">Delete</button>
                </div>
                <h3>${property.name}</h3>
                <p style="color: #64748b; margin-bottom: 1rem;">${property.address}</p>
                <div class="property-details">
                    <div><strong>Type:</strong> <span>${property.type}</span></div>
                    <div><strong>Units:</strong> <span>${property.units || 'N/A'}</span></div>
                    <div><strong>Value:</strong> <span>$${this.formatCurrency(property.value || 0)}</span></div>
                    <div><strong>Monthly Rent:</strong> <span>$${this.formatCurrency(property.monthlyRent || 0)}</span></div>
                    <div><strong>Status:</strong> <span>${property.status || 'Active'}</span></div>
                </div>
            </div>
        `).join('');
    }
    
    // ADD PROPERTY MODAL
    showAddPropertyModal() {
        const modalContainer = document.getElementById('modalContainer');
        if (!modalContainer) return;
        
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add New Property</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="addPropertyForm">
                        <div class="form-group">
                            <label class="form-label" for="propertyName">Property Name *</label>
                            <input type="text" id="propertyName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="propertyAddress">Address *</label>
                            <input type="text" id="propertyAddress" class="form-control" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="propertyType">Type *</label>
                                <select id="propertyType" class="form-control" required>
                                    <option value="">Select Type</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Industrial">Industrial</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Mixed Use">Mixed Use</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="propertyUnits">Units</label>
                                <input type="number" id="propertyUnits" class="form-control" min="1" value="1">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="propertyValue">Property Value</label>
                                <input type="number" id="propertyValue" class="form-control" step="1000">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="monthlyRent">Expected Monthly Rent</label>
                                <input type="number" id="monthlyRent" class="form-control" step="100">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Property</button>
                            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const form = document.getElementById('addPropertyForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createProperty();
            });
        }
    }
    
    createProperty() {
        const name = document.getElementById('propertyName').value.trim();
        const address = document.getElementById('propertyAddress').value.trim();
        const type = document.getElementById('propertyType').value;
        const units = parseInt(document.getElementById('propertyUnits').value) || 1;
        const value = parseFloat(document.getElementById('propertyValue').value) || 0;
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
        
        if (!name || !address || !type) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const newProperty = {
            id: this.getNextId('property'),
            name,
            address,
            type,
            units,
            value,
            monthlyRent,
            status: 'active',
            createdDate: new Date().toISOString()
        };
        
        this.properties.push(newProperty);
        this.saveData('properties', this.properties);
        
        this.closeModal();
        this.renderPropertiesView();
        this.renderDashboard();
        
        this.showNotification(`Property "${name}" added successfully!`, 'success');
    }
    
    // DELETE FUNCTIONS
    deleteLoan(loanId) {
        if (confirm('Are you sure you want to delete this loan? This will also remove all associated payments.')) {
            const loanIndex = this.loans.findIndex(l => l.id === loanId);
            if (loanIndex !== -1) {
                const loanName = this.loans[loanIndex].borrowerName;
                this.loans.splice(loanIndex, 1);
                this.payments = this.payments.filter(p => p.loanId !== loanId);
                
                this.saveData('loans', this.loans);
                this.saveData('payments', this.payments);
                
                this.renderLoansView();
                this.renderDashboard();
                this.populateFilters();
                
                this.showNotification(`Loan for ${loanName} deleted successfully`, 'success');
            }
        }
    }
    
    deleteProperty(propertyId) {
        if (confirm('Are you sure you want to delete this property? This will also remove associated tenants.')) {
            const propertyIndex = this.properties.findIndex(p => p.id === propertyId);
            if (propertyIndex !== -1) {
                const propertyName = this.properties[propertyIndex].name;
                this.properties.splice(propertyIndex, 1);
                
                this.tenants = this.tenants.filter(t => t.propertyId !== propertyId);
                this.rentPayments = this.rentPayments.filter(rp => rp.propertyId !== propertyId);
                
                this.saveData('properties', this.properties);
                this.saveData('tenants', this.tenants);
                this.saveData('rentPayments', this.rentPayments);
                
                this.renderPropertiesView();
                this.renderTenantsView();
                this.renderDashboard();
                
                this.showNotification(`Property "${propertyName}" deleted successfully`, 'success');
            }
        }
    }
    
    deleteTenant(tenantId) {
        if (confirm('Are you sure you want to delete this tenant?')) {
            const tenantIndex = this.tenants.findIndex(t => t.id === tenantId);
            if (tenantIndex !== -1) {
                const tenantName = this.tenants[tenantIndex].name;
                this.tenants.splice(tenantIndex, 1);
                
                this.rentPayments = this.rentPayments.filter(rp => rp.tenantId !== tenantId);
                
                this.saveData('tenants', this.tenants);
                this.saveData('rentPayments', this.rentPayments);
                
                this.renderTenantsView();
                this.renderRentScheduleView();
                this.renderDashboard();
                
                this.showNotification(`Tenant "${tenantName}" deleted successfully`, 'success');
            }
        }
    }
    
    // UTILITY FUNCTIONS
    populateFilters() {
        const loanFilter = document.getElementById('loanFilter');
        if (loanFilter && this.loans.length > 0) {
            loanFilter.innerHTML = `
                <option value="all">All Loans</option>
                ${this.loans.map(loan => `
                    <option value="${loan.id}">${loan.borrowerName} - $${this.formatCurrency(loan.currentBalance)}</option>
                `).join('')}
            `;
        }
    }
    
    closeModal() {
        const modalContainer = document.getElementById('modalContainer');
        if (modalContainer) {
            modalContainer.innerHTML = '';
        }
    }
    
    generatePaymentSchedules() {
        this.payments = [];
        this.loans.forEach(loan => {
            this.generatePaymentScheduleForLoan(loan);
        });
        this.saveData('payments', this.payments);
    }
    
    generateRentSchedules() {
        this.rentPayments = [];
        this.tenants.forEach(tenant => {
            this.generateRentScheduleForTenant(tenant);
        });
        this.saveData('rentPayments', this.rentPayments);
    }
    
    generatePaymentScheduleForLoan(loan) {
        const monthlyRate = loan.interestRate / 100 / 12;
        let remainingBalance = loan.currentBalance;
        const startDate = new Date(loan.startDate);
        
        for (let month = 1; month <= loan.termMonths; month++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + month - 1);
            
            if (loan.paymentDay && loan.paymentDay <= 28) {
                dueDate.setDate(loan.paymentDay);
            }
            
            const interestPortion = remainingBalance * monthlyRate;
            let principalPortion = 0;
            
            if (loan.paymentType === 'blended') {
                principalPortion = loan.monthlyPayment - interestPortion;
                remainingBalance = Math.max(0, remainingBalance - principalPortion);
            } else if (loan.paymentType === 'interest_only') {
                remainingBalance = loan.currentBalance;
            }
            
            const today = new Date();
            let status = 'upcoming';
            if (dueDate < today) {
                status = Math.random() > 0.7 ? 'paid' : 'overdue';
            }
            
            this.payments.push({
                id: `${loan.id}_${month}`,
                loanId: loan.id,
                borrowerName: loan.borrowerName,
                dueDate: dueDate.toISOString().split('T')[0],
                amount: loan.monthlyPayment,
                principal: principalPortion,
                interest: interestPortion,
                balance: remainingBalance,
                status: status,
                paymentNumber: month
            });
        }
    }
    
    findPaymentById(paymentId) {
        return this.payments.find(p => p.id === paymentId);
    }
    
    getNextPaymentDate() {
        const upcomingPayments = this.payments
            .filter(p => p.status === 'upcoming')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        return upcomingPayments.length > 0 ? upcomingPayments[0].dueDate : null;
    }
    
    getNextPaymentForLoan(loanId) {
        const nextPayment = this.payments
            .filter(p => p.loanId === loanId && p.status === 'upcoming')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
        
        return nextPayment ? this.formatDate(nextPayment.dueDate) : 'No upcoming payments';
    }
    
    getNextId(type) {
        if (type === 'loan') {
            return this.loans.length > 0 ? Math.max(...this.loans.map(l => l.id)) + 1 : 1;
        } else if (type === 'property') {
            return this.properties.length > 0 ? Math.max(...this.properties.map(p => p.id)) + 1 : 1;
        } else if (type === 'tenant') {
            return this.tenants.length > 0 ? Math.max(...this.tenants.map(t => t.id)) + 1 : 1;
        }
        return 1;
    }
    
    markRentPaid(paymentId) {
        const payment = this.rentPayments.find(rp => rp.id === paymentId);
        if (payment) {
            payment.status = 'paid';
            payment.paidDate = new Date().toISOString().split('T')[0];
            
            this.saveData('rentPayments', this.rentPayments);
            this.renderRentScheduleView();
            this.showNotification('Rent payment marked as paid', 'success');
        }
    }
    
    // DEFAULT DATA
    getDefaultLoans() {
        return [
            {
                id: 1,
                borrowerName: "John Smith Construction",
                borrowerEmail: "john@smithconstruction.com",
                originalAmount: 100000,
                currentBalance: 95000,
                interestRate: 6.5,
                termMonths: 60,
                paymentType: "blended",
                monthlyPayment: 1956.25,
                startDate: "2024-01-15",
                paymentDay: 15,
                originationFee: 1000,
                renewalFee: 0,
                status: 'active',
                rateType: 'fixed',
                calculationMethod: 'fixed_monthly'
            },
            {
                id: 2,
                borrowerName: "Sarah Johnson Personal",
                borrowerEmail: "sarah@email.com",
                originalAmount: 50000,
                currentBalance: 48000,
                interestRate: 7.5,
                termMonths: 36,
                paymentType: "interest_only",
                monthlyPayment: 312.50,
                startDate: "2024-03-01",
                paymentDay: 1,
                originationFee: 500,
                renewalFee: 250,
                status: 'active',
                rateType: 'variable',
                spread: 2.0,
                calculationMethod: 'fixed_monthly'
            }
        ];
    }
    
    getDefaultProperties() {
        return [
            {
                id: 1,
                name: "Downtown Office Building",
                address: "123 Main Street, Downtown",
                type: "Commercial",
                units: 10,
                value: 1200000,
                monthlyRent: 12000,
                status: 'active'
            },
            {
                id: 2,
                name: "Riverside Apartments",
                address: "456 River View Drive",
                type: "Residential",
                units: 24,
                value: 800000,
                monthlyRent: 18000,
                status: 'active'
            }
        ];
    }
    
    getDefaultTenants() {
        return [
            {
                id: 1,
                name: "Tech Solutions Inc",
                email: "contact@techsolutions.com",
                propertyId: 1,
                unitNumber: "Suite 301",
                monthlyRent: 4500,
                rentDueDay: 1,
                securityDeposit: 9000,
                leaseStart: "2024-09-01",
                leaseEnd: "2025-08-31",
                status: 'active',
                leaseType: 'fixed'
            },
            {
                id: 2,
                name: "Johnson Family",
                email: "johnson.family@email.com",
                propertyId: 2,
                unitNumber: "Apt 5B",
                monthlyRent: 1850,
                rentDueDay: 1,
                securityDeposit: 3700,
                leaseStart: "2024-02-01",
                leaseEnd: "2025-01-31",
                status: 'active',
                leaseType: 'escalating',
                escalationRate: 3.0,
                escalationDate: 'anniversary'
            }
        ];
    }
    
    // DATA PERSISTENCE
    loadData(key) {
        try {
            const data = localStorage.getItem(`businessSystem_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }
    
    saveData(key, data) {
        try {
            localStorage.setItem(`businessSystem_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    }
    
    // FORMATTING FUNCTIONS
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    }
    
    formatDate(date) {
        if (!date) return 'N/A';
        if (typeof date === 'string') date = new Date(date);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div>${message}</div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing Banking Grade Business Manager');
    window.businessManager = new BankingGradeBusinessManager();
});

if (document.readyState === 'loading') {
    // DOMContentLoaded will fire
} else {
    console.log('DOM already ready - initializing immediately');
    window.businessManager = new BankingGradeBusinessManager();
}
