// Business Management Suite - Complete Application Logic
class BusinessManagementSystem {
    constructor() {
        this.currentMode = 'loan';
        this.currentUser = null;
        this.loans = [];
        this.properties = [];
        this.tenants = [];
        this.payments = [];
        this.rentPayments = [];
        
        // Load data from localStorage
        this.loadData();
        
        // Initialize with sample data if empty
        if (this.loans.length === 0 && this.properties.length === 0) {
            this.initializeSampleData();
        }

        // Setup initial event listeners immediately
        this.setupInitialEventListeners();
    }

    // INITIALIZATION AND SAMPLE DATA
    initializeSampleData() {
        this.loans = [
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
                status: "active"
            },
            {
                id: 2,
                borrowerName: "Sarah Johnson Personal", 
                borrowerEmail: "sarah@email.com",
                originalAmount: 50000,
                currentBalance: 48000,
                interestRate: 8.0,
                termMonths: 36,
                paymentType: "interest_only",
                monthlyPayment: 333.33,
                startDate: "2024-03-01",
                paymentDay: 1,
                originationFee: 500,
                renewalFee: 250,
                status: "active"
            }
        ];

        this.properties = [
            {
                id: 1,
                name: "Downtown Office Building",
                address: "123 Main Street, Downtown", 
                type: "Commercial",
                units: 10,
                value: 1200000,
                monthlyRent: 12000
            },
            {
                id: 2,
                name: "Riverside Apartments",
                address: "456 River View Drive",
                type: "Residential", 
                units: 24,
                value: 800000,
                monthlyRent: 18000
            }
        ];

        this.tenants = [
            {
                id: 1,
                name: "Tech Solutions Inc",
                email: "contact@techsolutions.com",
                propertyId: 1,
                unitNumber: "Suite 301",
                monthlyRent: 4500,
                securityDeposit: 9000,
                leaseStart: "2024-01-01",
                leaseEnd: "2025-12-31"
            },
            {
                id: 2,
                name: "Johnson Family", 
                email: "johnson.family@email.com",
                propertyId: 2,
                unitNumber: "Apt 5B",
                monthlyRent: 1850,
                securityDeposit: 3700,
                leaseStart: "2024-02-01", 
                leaseEnd: "2025-01-31"
            }
        ];

        this.saveData();
    }

    // DATA PERSISTENCE
    saveData() {
        try {
            localStorage.setItem('bms_loans', JSON.stringify(this.loans));
            localStorage.setItem('bms_properties', JSON.stringify(this.properties));
            localStorage.setItem('bms_tenants', JSON.stringify(this.tenants));
            localStorage.setItem('bms_payments', JSON.stringify(this.payments));
            localStorage.setItem('bms_rentPayments', JSON.stringify(this.rentPayments));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    loadData() {
        try {
            this.loans = JSON.parse(localStorage.getItem('bms_loans') || '[]');
            this.properties = JSON.parse(localStorage.getItem('bms_properties') || '[]');
            this.tenants = JSON.parse(localStorage.getItem('bms_tenants') || '[]');
            this.payments = JSON.parse(localStorage.getItem('bms_payments') || '[]');
            this.rentPayments = JSON.parse(localStorage.getItem('bms_rentPayments') || '[]');
        } catch (error) {
            console.error('Error loading data:', error);
            this.loans = [];
            this.properties = [];
            this.tenants = [];
            this.payments = [];
            this.rentPayments = [];
        }
    }

    // INITIAL EVENT LISTENERS (LOGIN ONLY)
    setupInitialEventListeners() {
        // Login form - Simple and direct approach
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                
                const username = document.getElementById('loginUsername').value.trim();
                const password = document.getElementById('loginPassword').value.trim();
                
                console.log('Attempting login with username:', username);
                
                if (username === 'admin' && password === 'admin123') {
                    console.log('Login successful');
                    this.currentUser = { username: 'admin', role: 'administrator' };
                    this.showMainApp();
                } else {
                    console.log('Login failed - invalid credentials');
                    this.showAlert('Invalid credentials. Please use admin / admin123', 'error');
                }
            });
        }
    }

    // MAIN APP INITIALIZATION
    init() {
        this.setupMainEventListeners();
        this.generatePaymentSchedule();
        this.generateRentSchedule();
        this.updateAllDisplays();
    }

    // MAIN EVENT LISTENERS SETUP
    setupMainEventListeners() {
        console.log('Setting up main app event listeners...');

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Mode selector
        const modeSelector = document.getElementById('modeSelector');
        if (modeSelector) {
            modeSelector.addEventListener('change', (e) => this.switchMode(e.target.value));
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.getAttribute('data-page');
                this.showPage(page);
                this.setActiveNav(item);
            });
        });

        // Forms
        this.setupForms();

        // Modal controls
        this.setupModals();

        // Filter controls
        this.setupFilters();
    }

    setupForms() {
        // Loan form
        const loanForm = document.getElementById('loanForm');
        if (loanForm) {
            loanForm.addEventListener('submit', (e) => this.handleLoanSubmit(e));
        }

        // Modal loan form
        const modalLoanForm = document.getElementById('modalLoanForm');
        if (modalLoanForm) {
            modalLoanForm.addEventListener('submit', (e) => this.handleModalLoanSubmit(e));
        }

        // Property form
        const modalPropertyForm = document.getElementById('modalPropertyForm');
        if (modalPropertyForm) {
            modalPropertyForm.addEventListener('submit', (e) => this.handlePropertySubmit(e));
        }

        // Tenant form
        const modalTenantForm = document.getElementById('modalTenantForm');
        if (modalTenantForm) {
            modalTenantForm.addEventListener('submit', (e) => this.handleTenantSubmit(e));
        }

        // Add buttons
        const addLoanBtn = document.getElementById('addLoanBtn');
        if (addLoanBtn) {
            addLoanBtn.addEventListener('click', () => this.showModal('addLoanModal'));
        }

        const addPropertyBtn = document.getElementById('addPropertyBtn');
        if (addPropertyBtn) {
            addPropertyBtn.addEventListener('click', () => this.showModal('addPropertyModal'));
        }

        const addTenantBtn = document.getElementById('addTenantBtn');
        if (addTenantBtn) {
            addTenantBtn.addEventListener('click', () => {
                this.populatePropertyDropdown();
                this.showModal('addTenantModal');
            });
        }

        // Report generation
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.generateReport());
        }

        // Settings
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }
    }

    setupModals() {
        // Close modal buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Close modal on backdrop click
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    setupFilters() {
        const scheduleFilter = document.getElementById('scheduleFilter');
        if (scheduleFilter) {
            scheduleFilter.addEventListener('change', () => this.updatePaymentScheduleDisplay());
        }
    }

    // AUTHENTICATION
    showMainApp() {
        console.log('Showing main app...');
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen && mainApp) {
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            
            // Initialize app after showing
            this.init();
            this.showAlert('Welcome to Business Management Suite!', 'success');
        } else {
            console.error('Could not find login screen or main app elements');
        }
    }

    logout() {
        this.currentUser = null;
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen && mainApp) {
            loginScreen.classList.remove('hidden');
            mainApp.classList.add('hidden');
            
            // Clear form fields
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            
            this.showAlert('Logged out successfully', 'info');
        }
    }

    // MODE SWITCHING
    switchMode(mode) {
        this.currentMode = mode;
        
        const loanNav = document.getElementById('loanModeNav');
        const realEstateNav = document.getElementById('realEstateModeNav');

        if (mode === 'loan') {
            loanNav?.classList.remove('hidden');
            realEstateNav?.classList.add('hidden');
            this.showPage('dashboard');
        } else {
            loanNav?.classList.add('hidden');
            realEstateNav?.classList.remove('hidden');
            this.showPage('dashboard');
        }

        this.updateAllDisplays();
    }

    // NAVIGATION
    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update page-specific data
        this.updatePageData(pageId);
    }

    setActiveNav(activeItem) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }

    updatePageData(pageId) {
        switch (pageId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'all-loans':
                this.updateLoansDisplay();
                break;
            case 'payment-schedule':
                this.updatePaymentScheduleDisplay();
                break;
            case 'properties':
                this.updatePropertiesDisplay();
                break;
            case 'tenants':
                this.updateTenantsDisplay();
                break;
            case 'rent-schedule':
                this.updateRentScheduleDisplay();
                break;
        }
    }

    // MODAL MANAGEMENT
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            
            // Set today's date as default for date fields
            const dateInputs = modal.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                if (!input.value) {
                    input.value = new Date().toISOString().split('T')[0];
                }
            });

            // Focus first input
            const firstInput = modal.querySelector('input, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    // LOAN MANAGEMENT
    handleLoanSubmit(e) {
        e.preventDefault();
        
        const loanData = {
            id: Date.now(),
            borrowerName: document.getElementById('borrowerName').value,
            borrowerEmail: document.getElementById('borrowerEmail').value,
            originalAmount: parseFloat(document.getElementById('originalAmount').value),
            currentBalance: parseFloat(document.getElementById('originalAmount').value),
            interestRate: parseFloat(document.getElementById('interestRate').value),
            termMonths: parseInt(document.getElementById('termMonths').value),
            paymentType: document.getElementById('paymentType').value,
            startDate: document.getElementById('startDate').value,
            paymentDay: parseInt(document.getElementById('paymentDay').value),
            originationFee: parseFloat(document.getElementById('originationFee').value) || 0,
            renewalFee: parseFloat(document.getElementById('renewalFee').value) || 0,
            status: 'active'
        };

        // Calculate monthly payment
        loanData.monthlyPayment = this.calculateMonthlyPayment(
            loanData.originalAmount,
            loanData.interestRate,
            loanData.termMonths,
            loanData.paymentType
        );

        this.loans.push(loanData);
        this.saveData();
        this.generatePaymentSchedule();
        this.updateAllDisplays();
        
        e.target.reset();
        this.showAlert('Loan created successfully!', 'success');
    }

    handleModalLoanSubmit(e) {
        e.preventDefault();
        
        const loanData = {
            id: Date.now(),
            borrowerName: document.getElementById('modalBorrowerName').value,
            borrowerEmail: document.getElementById('modalBorrowerEmail').value,
            originalAmount: parseFloat(document.getElementById('modalOriginalAmount').value),
            currentBalance: parseFloat(document.getElementById('modalOriginalAmount').value),
            interestRate: parseFloat(document.getElementById('modalInterestRate').value),
            termMonths: parseInt(document.getElementById('modalTermMonths').value),
            paymentType: document.getElementById('modalPaymentType').value,
            startDate: new Date().toISOString().split('T')[0],
            paymentDay: 15,
            originationFee: 0,
            renewalFee: 0,
            status: 'active'
        };

        loanData.monthlyPayment = this.calculateMonthlyPayment(
            loanData.originalAmount,
            loanData.interestRate,
            loanData.termMonths,
            loanData.paymentType
        );

        this.loans.push(loanData);
        this.saveData();
        this.generatePaymentSchedule();
        this.updateAllDisplays();
        
        this.hideModal('addLoanModal');
        this.showAlert('Loan added successfully!', 'success');
    }

    calculateMonthlyPayment(principal, annualRate, termMonths, paymentType) {
        if (paymentType === 'interest_only') {
            return (principal * (annualRate / 100)) / 12;
        }
        
        const monthlyRate = annualRate / 100 / 12;
        if (monthlyRate === 0) {
            return principal / termMonths;
        }
        
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
               (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    deleteLoan(loanId) {
        if (confirm('Are you sure you want to delete this loan?')) {
            this.loans = this.loans.filter(loan => loan.id !== loanId);
            this.payments = this.payments.filter(payment => payment.loanId !== loanId);
            this.saveData();
            this.updateAllDisplays();
            this.showAlert('Loan deleted successfully!', 'success');
        }
    }

    // PROPERTY MANAGEMENT
    handlePropertySubmit(e) {
        e.preventDefault();
        
        const propertyData = {
            id: Date.now(),
            name: document.getElementById('modalPropertyName').value,
            address: document.getElementById('modalPropertyAddress').value,
            type: document.getElementById('modalPropertyType').value,
            units: parseInt(document.getElementById('modalPropertyUnits').value),
            value: parseFloat(document.getElementById('modalPropertyValue').value),
            monthlyRent: parseFloat(document.getElementById('modalMonthlyRent').value)
        };

        this.properties.push(propertyData);
        this.saveData();
        this.generateRentSchedule();
        this.updateAllDisplays();
        
        this.hideModal('addPropertyModal');
        this.showAlert('Property added successfully!', 'success');
    }

    deleteProperty(propertyId) {
        if (confirm('Are you sure you want to delete this property?')) {
            this.properties = this.properties.filter(property => property.id !== propertyId);
            this.tenants = this.tenants.filter(tenant => tenant.propertyId !== propertyId);
            this.saveData();
            this.updateAllDisplays();
            this.showAlert('Property deleted successfully!', 'success');
        }
    }

    // TENANT MANAGEMENT
    populatePropertyDropdown() {
        const select = document.getElementById('modalTenantProperty');
        if (select) {
            select.innerHTML = '<option value="">Select Property</option>';
            this.properties.forEach(property => {
                const option = document.createElement('option');
                option.value = property.id;
                option.textContent = property.name;
                select.appendChild(option);
            });
        }
    }

    handleTenantSubmit(e) {
        e.preventDefault();
        
        const tenantData = {
            id: Date.now(),
            name: document.getElementById('modalTenantName').value,
            email: document.getElementById('modalTenantEmail').value,
            propertyId: parseInt(document.getElementById('modalTenantProperty').value),
            unitNumber: document.getElementById('modalTenantUnit').value,
            monthlyRent: parseFloat(document.getElementById('modalTenantRent').value),
            securityDeposit: parseFloat(document.getElementById('modalTenantDeposit').value),
            leaseStart: document.getElementById('modalLeaseStart').value,
            leaseEnd: document.getElementById('modalLeaseEnd').value
        };

        this.tenants.push(tenantData);
        this.saveData();
        this.generateRentSchedule();
        this.updateAllDisplays();
        
        this.hideModal('addTenantModal');
        this.showAlert('Tenant added successfully!', 'success');
    }

    deleteTenant(tenantId) {
        if (confirm('Are you sure you want to delete this tenant?')) {
            this.tenants = this.tenants.filter(tenant => tenant.id !== tenantId);
            this.rentPayments = this.rentPayments.filter(payment => payment.tenantId !== tenantId);
            this.saveData();
            this.updateAllDisplays();
            this.showAlert('Tenant deleted successfully!', 'success');
        }
    }

    // PAYMENT MANAGEMENT
    generatePaymentSchedule() {
        this.payments = [];
        const today = new Date();
        
        this.loans.filter(loan => loan.status === 'active').forEach(loan => {
            for (let i = 0; i < 12; i++) {
                const dueDate = new Date(today);
                dueDate.setMonth(dueDate.getMonth() + i);
                dueDate.setDate(loan.paymentDay);
                
                // If the date is invalid (e.g., Feb 30), set to last day of month
                if (loan.paymentDay === 30) {
                    dueDate.setMonth(dueDate.getMonth() + 1, 0);
                }
                
                const isPast = dueDate < today;
                const isUpcoming = !isPast && i < 3;
                
                this.payments.push({
                    id: Date.now() + i + Math.random(),
                    loanId: loan.id,
                    borrowerName: loan.borrowerName,
                    amount: loan.monthlyPayment,
                    dueDate: dueDate.toISOString().split('T')[0],
                    status: isPast ? 'past' : (isUpcoming ? 'pending' : 'scheduled')
                });
            }
        });
        
        this.payments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        this.saveData();
    }

    generateRentSchedule() {
        this.rentPayments = [];
        const today = new Date();
        
        this.tenants.forEach(tenant => {
            for (let i = 0; i < 12; i++) {
                const dueDate = new Date(today);
                dueDate.setMonth(dueDate.getMonth() + i);
                dueDate.setDate(1); // Rent due on 1st of each month
                
                const isPast = dueDate < today;
                const isUpcoming = !isPast && i < 3;
                
                this.rentPayments.push({
                    id: Date.now() + i + Math.random(),
                    tenantId: tenant.id,
                    tenantName: tenant.name,
                    propertyName: this.properties.find(p => p.id === tenant.propertyId)?.name || 'Unknown',
                    unitNumber: tenant.unitNumber,
                    amount: tenant.monthlyRent,
                    dueDate: dueDate.toISOString().split('T')[0],
                    status: isPast ? 'past' : (isUpcoming ? 'pending' : 'scheduled')
                });
            }
        });
        
        this.rentPayments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        this.saveData();
    }

    markPaymentPaid(paymentId) {
        const payment = this.payments.find(p => p.id == paymentId);
        if (payment) {
            payment.status = 'paid';
            payment.paidDate = new Date().toISOString().split('T')[0];
            this.saveData();
            this.updatePaymentScheduleDisplay();
            this.updateDashboard();
            this.showAlert('Payment marked as paid!', 'success');
        }
    }

    markPaymentMissed(paymentId) {
        const payment = this.payments.find(p => p.id == paymentId);
        if (payment) {
            payment.status = 'missed';
            
            // Add interest to loan balance
            const loan = this.loans.find(l => l.id === payment.loanId);
            if (loan) {
                const missedInterest = (loan.currentBalance * (loan.interestRate / 100)) / 12;
                loan.currentBalance += missedInterest;
            }
            
            this.saveData();
            this.updatePaymentScheduleDisplay();
            this.updateAllDisplays();
            this.showAlert('Payment marked as missed. Interest added to balance.', 'warning');
        }
    }

    undoPayment(paymentId) {
        const payment = this.payments.find(p => p.id == paymentId);
        if (payment) {
            payment.status = 'pending';
            delete payment.paidDate;
            this.saveData();
            this.updatePaymentScheduleDisplay();
            this.updateDashboard();
            this.showAlert('Payment status updated!', 'success');
        }
    }

    markRentPaid(paymentId) {
        const payment = this.rentPayments.find(p => p.id == paymentId);
        if (payment) {
            payment.status = 'paid';
            payment.paidDate = new Date().toISOString().split('T')[0];
            this.saveData();
            this.updateRentScheduleDisplay();
            this.showAlert('Rent payment marked as paid!', 'success');
        }
    }

    markRentMissed(paymentId) {
        const payment = this.rentPayments.find(p => p.id == paymentId);
        if (payment) {
            payment.status = 'missed';
            this.saveData();
            this.updateRentScheduleDisplay();
            this.showAlert('Rent payment marked as missed!', 'warning');
        }
    }

    undoRentPayment(paymentId) {
        const payment = this.rentPayments.find(p => p.id == paymentId);
        if (payment) {
            payment.status = 'pending';
            delete payment.paidDate;
            this.saveData();
            this.updateRentScheduleDisplay();
            this.showAlert('Rent payment status updated!', 'success');
        }
    }

    // DISPLAY UPDATES
    updateAllDisplays() {
        this.updateDashboard();
        this.updateLoansDisplay();
        this.updatePropertiesDisplay();
        this.updateTenantsDisplay();
        this.updatePaymentScheduleDisplay();
        this.updateRentScheduleDisplay();
    }

    updateDashboard() {
        // Loan statistics
        const activeLoans = this.loans.filter(l => l.status === 'active');
        const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.currentBalance, 0);
        const monthlyIncome = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
        
        // Property statistics
        const totalProperties = this.properties.length;
        
        const totalLoansEl = document.getElementById('totalLoans');
        const totalBalanceEl = document.getElementById('totalBalance');
        const monthlyIncomeEl = document.getElementById('monthlyIncome');
        const totalPropertiesEl = document.getElementById('totalProperties');
        
        if (totalLoansEl) totalLoansEl.textContent = activeLoans.length;
        if (totalBalanceEl) totalBalanceEl.textContent = `$${totalBalance.toLocaleString()}`;
        if (monthlyIncomeEl) monthlyIncomeEl.textContent = `$${monthlyIncome.toLocaleString()}`;
        if (totalPropertiesEl) totalPropertiesEl.textContent = totalProperties;

        // Recent activity
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const recentPayments = this.payments
            .filter(p => p.status === 'paid' && p.paidDate)
            .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))
            .slice(0, 5);

        if (recentPayments.length === 0) {
            container.innerHTML = '<p>No recent activity</p>';
            return;
        }

        container.innerHTML = `
            <div class="activity-list">
                ${recentPayments.map(payment => `
                    <div class="activity-item">
                        <div class="activity-icon">💰</div>
                        <div class="activity-content">
                            <div class="activity-title">${payment.borrowerName} - Payment Received</div>
                            <div class="activity-meta">$${payment.amount.toFixed(2)} on ${new Date(payment.paidDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateLoansDisplay() {
        const container = document.getElementById('loansContainer');
        if (!container) return;

        if (this.loans.length === 0) {
            container.innerHTML = '<div class="card"><p>No loans found. Add your first loan to get started.</p></div>';
            return;
        }

        container.innerHTML = this.loans.map(loan => `
            <div class="loan-card">
                <div class="card-header">
                    <h3 class="card-title">${loan.borrowerName}</h3>
                    <span class="status status--${loan.status === 'active' ? 'success' : 'info'}">${loan.status.toUpperCase()}</span>
                </div>
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">Original Amount</span>
                        <span class="info-value">$${loan.originalAmount.toLocaleString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Current Balance</span>
                        <span class="info-value">$${loan.currentBalance.toLocaleString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Interest Rate</span>
                        <span class="info-value">${loan.interestRate}%</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Monthly Payment</span>
                        <span class="info-value">$${loan.monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Payment Type</span>
                        <span class="info-value">${loan.paymentType === 'blended' ? 'Blended' : 'Interest Only'}</span>
                    </div>
                    ${loan.borrowerEmail ? `
                    <div class="info-row">
                        <span class="info-label">Email</span>
                        <span class="info-value">${loan.borrowerEmail}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.deleteLoan(${loan.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updatePropertiesDisplay() {
        const container = document.getElementById('propertiesContainer');
        if (!container) return;

        if (this.properties.length === 0) {
            container.innerHTML = '<div class="card"><p>No properties found. Add your first property to get started.</p></div>';
            return;
        }

        container.innerHTML = this.properties.map(property => `
            <div class="property-card">
                <div class="card-header">
                    <h3 class="card-title">${property.name}</h3>
                    <span class="status status--success">${property.type.toUpperCase()}</span>
                </div>
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">Address</span>
                        <span class="info-value">${property.address}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Units</span>
                        <span class="info-value">${property.units}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Value</span>
                        <span class="info-value">$${property.value.toLocaleString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Monthly Rent</span>
                        <span class="info-value">$${property.monthlyRent.toLocaleString()}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.deleteProperty(${property.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateTenantsDisplay() {
        const container = document.getElementById('tenantsContainer');
        if (!container) return;

        if (this.tenants.length === 0) {
            container.innerHTML = '<div class="card"><p>No tenants found. Add your first tenant to get started.</p></div>';
            return;
        }

        container.innerHTML = this.tenants.map(tenant => {
            const property = this.properties.find(p => p.id === tenant.propertyId);
            return `
                <div class="tenant-card">
                    <div class="card-header">
                        <h3 class="card-title">${tenant.name}</h3>
                        <span class="status status--success">ACTIVE</span>
                    </div>
                    <div class="card-info">
                        <div class="info-row">
                            <span class="info-label">Email</span>
                            <span class="info-value">${tenant.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Property</span>
                            <span class="info-value">${property ? property.name : 'Unknown Property'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Unit</span>
                            <span class="info-value">${tenant.unitNumber}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Monthly Rent</span>
                            <span class="info-value">$${tenant.monthlyRent.toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Security Deposit</span>
                            <span class="info-value">$${tenant.securityDeposit.toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Lease Period</span>
                            <span class="info-value">${new Date(tenant.leaseStart).toLocaleDateString()} - ${new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn--sm btn--outline" onclick="app.deleteTenant(${tenant.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updatePaymentScheduleDisplay() {
        const container = document.getElementById('paymentsContainer');
        const filter = document.getElementById('scheduleFilter');
        if (!container) return;

        const filterValue = filter ? filter.value : 'upcoming';
        let filteredPayments = this.payments;

        switch (filterValue) {
            case 'upcoming':
                filteredPayments = this.payments.filter(p => p.status === 'pending' || p.status === 'scheduled');
                break;
            case 'past':
                filteredPayments = this.payments.filter(p => p.status === 'paid' || p.status === 'missed' || p.status === 'past');
                break;
            case 'all':
                // Show all payments
                break;
        }

        if (filteredPayments.length === 0) {
            container.innerHTML = '<p>No payments found for the selected filter.</p>';
            return;
        }

        const tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Borrower</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredPayments.slice(0, 20).map(payment => {
                        const statusClass = payment.status === 'paid' ? 'success' : 
                                          payment.status === 'missed' ? 'error' : 
                                          payment.status === 'pending' ? 'warning' : 'info';
                        
                        return `
                            <tr ${payment.status === 'pending' ? 'class="next-payment"' : ''}>
                                <td>${payment.borrowerName}</td>
                                <td>${new Date(payment.dueDate).toLocaleDateString()}</td>
                                <td>$${payment.amount.toFixed(2)}</td>
                                <td><span class="status status--${statusClass}">${payment.status.toUpperCase()}</span></td>
                                <td>
                                    <div class="payment-actions">
                                        ${payment.status === 'pending' || payment.status === 'scheduled' ? `
                                            <button class="btn btn--sm btn--primary" onclick="app.markPaymentPaid(${payment.id})">✓ Pay</button>
                                            <button class="btn btn--sm" style="background: #a84b2f; color: white;" onclick="app.markPaymentMissed(${payment.id})">✗ Miss</button>
                                        ` : ''}
                                        ${payment.status === 'paid' || payment.status === 'missed' ? `
                                            <button class="btn btn--sm btn--secondary" onclick="app.undoPayment(${payment.id})">↺ Undo</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    updateRentScheduleDisplay() {
        const container = document.getElementById('rentScheduleContainer');
        if (!container) return;

        if (this.rentPayments.length === 0) {
            container.innerHTML = '<p>No rent payments found. Add tenants to see rent schedule.</p>';
            return;
        }

        const tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Unit</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.rentPayments.slice(0, 20).map(payment => {
                        const statusClass = payment.status === 'paid' ? 'success' : 
                                          payment.status === 'missed' ? 'error' : 
                                          payment.status === 'pending' ? 'warning' : 'info';
                        
                        return `
                            <tr ${payment.status === 'pending' ? 'class="next-payment"' : ''}>
                                <td>${payment.tenantName}</td>
                                <td>${payment.propertyName}</td>
                                <td>${payment.unitNumber}</td>
                                <td>${new Date(payment.dueDate).toLocaleDateString()}</td>
                                <td>$${payment.amount.toFixed(2)}</td>
                                <td><span class="status status--${statusClass}">${payment.status.toUpperCase()}</span></td>
                                <td>
                                    <div class="payment-actions">
                                        ${payment.status === 'pending' || payment.status === 'scheduled' ? `
                                            <button class="btn btn--sm btn--primary" onclick="app.markRentPaid(${payment.id})">✓ Pay</button>
                                            <button class="btn btn--sm" style="background: #a84b2f; color: white;" onclick="app.markRentMissed(${payment.id})">✗ Miss</button>
                                        ` : ''}
                                        ${payment.status === 'paid' || payment.status === 'missed' ? `
                                            <button class="btn btn--sm btn--secondary" onclick="app.undoRentPayment(${payment.id})">↺ Undo</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    // REPORTS
    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const container = document.getElementById('reportContainer');
        if (!container) return;

        let reportHTML = '';

        switch (reportType) {
            case 'loan-summary':
                reportHTML = this.generateLoanSummaryReport();
                break;
            case 'property-summary':
                reportHTML = this.generatePropertySummaryReport();
                break;
            case 'payment-history':
                reportHTML = this.generatePaymentHistoryReport();
                break;
        }

        container.innerHTML = reportHTML;
    }

    generateLoanSummaryReport() {
        const activeLoans = this.loans.filter(l => l.status === 'active');
        const totalOriginal = activeLoans.reduce((sum, loan) => sum + loan.originalAmount, 0);
        const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.currentBalance, 0);
        const totalPaid = totalOriginal - totalBalance;
        const monthlyIncome = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
        const avgRate = activeLoans.length ? activeLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / activeLoans.length : 0;

        return `
            <div class="card">
                <h3>Loan Portfolio Summary</h3>
                <table class="table">
                    <tr><td><strong>Active Loans</strong></td><td>${activeLoans.length}</td></tr>
                    <tr><td><strong>Total Original Amount</strong></td><td>$${totalOriginal.toLocaleString()}</td></tr>
                    <tr><td><strong>Total Outstanding Balance</strong></td><td>$${totalBalance.toLocaleString()}</td></tr>
                    <tr><td><strong>Total Amount Paid</strong></td><td>$${totalPaid.toLocaleString()}</td></tr>
                    <tr><td><strong>Monthly Income</strong></td><td>$${monthlyIncome.toLocaleString()}</td></tr>
                    <tr><td><strong>Average Interest Rate</strong></td><td>${avgRate.toFixed(2)}%</td></tr>
                </table>
            </div>
        `;
    }

    generatePropertySummaryReport() {
        const totalValue = this.properties.reduce((sum, prop) => sum + prop.value, 0);
        const totalUnits = this.properties.reduce((sum, prop) => sum + prop.units, 0);
        const totalRent = this.properties.reduce((sum, prop) => sum + prop.monthlyRent, 0);
        const occupancyRate = totalUnits ? (this.tenants.length / totalUnits * 100) : 0;

        return `
            <div class="card">
                <h3>Property Portfolio Summary</h3>
                <table class="table">
                    <tr><td><strong>Total Properties</strong></td><td>${this.properties.length}</td></tr>
                    <tr><td><strong>Total Units</strong></td><td>${totalUnits}</td></tr>
                    <tr><td><strong>Occupied Units</strong></td><td>${this.tenants.length}</td></tr>
                    <tr><td><strong>Occupancy Rate</strong></td><td>${occupancyRate.toFixed(1)}%</td></tr>
                    <tr><td><strong>Total Property Value</strong></td><td>$${totalValue.toLocaleString()}</td></tr>
                    <tr><td><strong>Monthly Rent Roll</strong></td><td>$${totalRent.toLocaleString()}</td></tr>
                </table>
            </div>
        `;
    }

    generatePaymentHistoryReport() {
        const paidPayments = this.payments.filter(p => p.status === 'paid');
        const missedPayments = this.payments.filter(p => p.status === 'missed');
        const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalMissed = missedPayments.reduce((sum, p) => sum + p.amount, 0);

        return `
            <div class="card">
                <h3>Payment History Summary</h3>
                <table class="table">
                    <tr><td><strong>Payments Made</strong></td><td>${paidPayments.length}</td></tr>
                    <tr><td><strong>Payments Missed</strong></td><td>${missedPayments.length}</td></tr>
                    <tr><td><strong>Total Amount Collected</strong></td><td>$${totalPaid.toLocaleString()}</td></tr>
                    <tr><td><strong>Total Amount Missed</strong></td><td>$${totalMissed.toLocaleString()}</td></tr>
                    <tr><td><strong>Collection Rate</strong></td><td>${paidPayments.length + missedPayments.length > 0 ? ((paidPayments.length / (paidPayments.length + missedPayments.length)) * 100).toFixed(1) : 0}%</td></tr>
                </table>
            </div>
        `;
    }

    // SETTINGS
    saveSettings() {
        const defaultRate = document.getElementById('defaultInterestRate').value;
        const defaultTerm = document.getElementById('defaultTerm').value;
        
        localStorage.setItem('bms_defaultRate', defaultRate);
        localStorage.setItem('bms_defaultTerm', defaultTerm);
        
        this.showAlert('Settings saved successfully!', 'success');
    }

    // UTILITY FUNCTIONS
    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer; color: inherit; opacity: 0.7;">&times;</button>
        `;

        // Add styles
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                alert.style.backgroundColor = '#218085';
                break;
            case 'error':
                alert.style.backgroundColor = '#c0152f';
                break;
            case 'warning':
                alert.style.backgroundColor = '#a84b2f';
                break;
            default:
                alert.style.backgroundColor = '#626c71';
        }

        document.body.appendChild(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    }
}

// Additional CSS styles for alerts and activities
const additionalStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--color-bg-1);
    border-radius: 8px;
}

.activity-icon {
    font-size: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary);
    border-radius: 50%;
    color: white;
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 4px;
}

.activity-meta {
    font-size: 12px;
    color: var(--color-text-secondary);
}
`;

// Add additional styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is ready
let app;

function initApp() {
    console.log('Initializing Business Management Suite...');
    app = new BusinessManagementSystem();
    console.log('Business Management Suite ready!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}