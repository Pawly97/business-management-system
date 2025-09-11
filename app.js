<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Management System - Banking Grade</title>
    <style>
        /* BUSINESS MANAGEMENT SYSTEM - BANKING GRADE STYLES */
        /* ALL TEXT VISIBILITY ISSUES FIXED - DARK TEXT ON LIGHT BACKGROUNDS */

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #2E8B57 0%, #228B22 100%);
            min-height: 100vh;
            color: #1e293b;
        }

        .hidden {
            display: none !important;
        }

        /* LOGIN SCREEN */
        .login-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1rem;
        }

        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }

        .login-header h1 {
            font-size: 2rem;
            color: #2E8B57;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .login-header p {
            color: #666;
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #1e293b;
        }

        .form-control {
            width: 100%;
            padding: 1rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
            background: white;
            color: #1e293b;
        }

        .form-control:focus {
            outline: none;
            border-color: #2E8B57;
            background: white;
        }

        .login-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #2E8B57 0%, #228B22 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .login-btn:hover {
            transform: translateY(-2px);
        }

        .login-help {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #eee;
            font-size: 0.9rem;
            color: #666;
        }

        .error-message {
            background: #ffe6e6;
            color: #d00;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            display: none;
        }

        /* MAIN APPLICATION */
        .app-container {
            min-height: 100vh;
            background: #f5f7fa;
            display: flex;
            flex-direction: column;
        }

        .app-header {
            background: linear-gradient(135deg, #2E8B57 0%, #228B22 100%);
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .app-switcher {
            padding: 0.5rem 1rem;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-weight: 600;
        }

        .prime-rate-display {
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .prime-rate-display:hover {
            background: rgba(255,255,255,0.3);
        }

        .app-main {
            display: flex;
            flex: 1;
        }

        /* LEFT SIDEBAR */
        .sidebar {
            width: 250px;
            background: white;
            border-right: 1px solid #e1e5e9;
            padding: 1rem 0;
            overflow-y: auto;
        }

        .sidebar-nav {
            list-style: none;
        }

        .sidebar-nav li {
            margin-bottom: 0.25rem;
        }

        .nav-link {
            display: flex;
            align-items: center;
            padding: 0.875rem 1.5rem;
            color: #64748b;
            text-decoration: none;
            transition: all 0.2s;
            border-right: 3px solid transparent;
            gap: 0.875rem;
            font-weight: 500;
            cursor: pointer;
        }

        .nav-link:hover {
            background: rgba(46, 139, 87, 0.05);
            color: #2E8B57;
            border-right-color: rgba(46, 139, 87, 0.1);
        }

        .nav-link.active {
            background: rgba(46, 139, 87, 0.1);
            color: #2E8B57;
            border-right-color: #2E8B57;
            font-weight: 600;
        }

        .nav-icon {
            font-size: 1.25rem;
            width: 20px;
            text-align: center;
        }

        .main-content {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }

        .view {
            display: none;
        }

        .view.active {
            display: block;
        }

        .view-header {
            margin-bottom: 2rem;
        }

        .view-header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }

        .view-subtitle {
            color: #64748b;
            font-size: 1.1rem;
        }

        /* DASHBOARD */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .metric-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-left: 5px solid #2E8B57;
            transition: transform 0.2s;
        }

        .metric-card:hover {
            transform: translateY(-5px);
        }

        .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .metric-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .metric-icon {
            font-size: 2rem;
            color: #2E8B57;
        }

        .metric-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2E8B57;
            margin-bottom: 0.5rem;
        }

        .metric-subtitle {
            font-size: 0.9rem;
            color: #64748b;
        }

        /* BUTTONS */
        .btn {
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: #2E8B57;
            color: white;
        }

        .btn-primary:hover {
            background: #228B22;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-warning {
            background: #ffc107;
            color: #333;
        }

        .btn-success {
            background: #28a745;
            color: white;
        }

        .btn-outline {
            background: transparent;
            border: 2px solid #2E8B57;
            color: #2E8B57;
        }

        .btn-outline:hover {
            background: #2E8B57;
            color: white;
        }

        .btn-sm {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
        }

        /* TABLES */
        .table-container {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .table-container table {
            width: 100%;
            border-collapse: collapse;
        }

        .table-container th {
            background: #f8f9fa;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #1e293b;
            border-bottom: 2px solid #e9ecef;
        }

        .table-container td {
            padding: 1rem;
            border-bottom: 1px solid #f1f3f4;
            color: #1e293b;
        }

        .table-container tbody tr:hover {
            background: #f8f9fa;
        }

        /* PAYMENT SCHEDULE */
        .schedule-controls {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .schedule-filters {
            display: flex;
            gap: 2rem;
            margin-bottom: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }

        .filter-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .filter-group label {
            font-weight: 600;
            color: #1e293b;
            min-width: 80px;
        }

        .time-filters {
            display: flex;
            gap: 0.5rem;
        }

        .time-filter-btn {
            padding: 0.5rem 1rem;
            border: 2px solid #2E8B57;
            background: transparent;
            color: #2E8B57;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-size: 0.9rem;
        }

        .time-filter-btn.active,
        .time-filter-btn:hover {
            background: #2E8B57;
            color: white;
        }

        .schedule-table {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .table-header {
            display: grid;
            grid-template-columns: 120px 160px 120px 100px 100px 120px 100px 200px;
            padding: 1rem;
            background: #f8f9fa;
            font-weight: 600;
            color: #1e293b;
            border-bottom: 2px solid #e9ecef;
            font-size: 0.9rem;
        }

        .table-row {
            display: grid;
            grid-template-columns: 120px 160px 120px 100px 100px 120px 100px 200px;
            padding: 1rem;
            border-bottom: 1px solid #f1f3f4;
            align-items: center;
            font-size: 0.9rem;
            color: #1e293b;
            transition: background-color 0.2s;
        }

        .table-row:hover {
            background: #f8f9fa;
        }

        .table-row.next-payment {
            background: rgba(46, 139, 87, 0.1);
            border-left: 4px solid #2E8B57;
            font-weight: 600;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-upcoming {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-paid {
            background: #e8f5e8;
            color: #2e7d32;
        }

        .status-overdue {
            background: #ffebee;
            color: #d32f2f;
        }

        .status-missed {
            background: #fff3e0;
            color: #f57c00;
        }

        /* MODAL STYLES - FIXED TEXT VISIBILITY */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            color: #1e293b;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            padding: 0.25rem;
            border-radius: 4px;
            transition: color 0.2s;
        }

        .modal-close:hover {
            color: #1e293b;
        }

        .modal .form-label {
            color: #1e293b;
            font-weight: 600;
        }

        .modal .form-control {
            background: #f8f9fa;
            border: 1px solid #d0d7de;
            color: #1e293b;
        }

        .modal .form-control:focus {
            border-color: #2E8B57;
            background: white;
        }

        /* FORM LAYOUTS */
        .form-layout {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .form-section {
            margin-bottom: 2rem;
        }

        .form-section h3,
        .form-section h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .form-row {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .form-row .form-group {
            flex: 1;
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
        }

        /* RATE TYPE SELECTOR */
        .rate-type-selector {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .rate-options {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .rate-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .rate-details {
            display: none;
        }

        .rate-details.active {
            display: block;
        }

        /* TRANCHE SECTION */
        .tranches-section {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .tranche-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem;
            border-bottom: 1px solid #f1f3f4;
        }

        .tranche-item:last-child {
            border-bottom: none;
        }

        /* NOTIFICATIONS */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2E8B57;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }

        .notification.error {
            background: #dc3545;
        }

        .notification.warning {
            background: #ffc107;
            color: #333;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        /* PROPERTIES GRID */
        .properties-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }

        .property-card {
            background: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-top: 5px solid #2E8B57;
            transition: transform 0.2s;
            position: relative;
        }

        .property-card:hover {
            transform: translateY(-3px);
        }

        .property-card h3 {
            color: #2E8B57;
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .property-details {
            margin-top: 1rem;
        }

        .property-details div {
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            display: flex;
            justify-content: space-between;
            color: #1e293b;
        }

        .property-actions {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .app-main {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #e1e5e9;
            }
            
            .sidebar-nav {
                display: flex;
                overflow-x: auto;
                padding: 0 1rem;
                gap: 0.5rem;
            }
            
            .sidebar-nav li {
                margin-bottom: 0;
                flex-shrink: 0;
            }
            
            .main-content {
                padding: 1rem;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .table-header,
            .table-row {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }
            
            .form-row {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <!-- LOGIN SCREEN -->
    <div id="loginScreen" class="login-screen">
        <div class="login-container">
            <div class="login-header">
                <h1>🏦 Banking System</h1>
                <p>Professional Loan & Real Estate Management</p>
            </div>
            
            <div id="loginError" class="error-message">Invalid username or password</div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label" for="username">Username</label>
                    <input type="text" id="username" class="form-control" value="admin" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" class="form-control" value="admin123" required>
                </div>
                
                <button type="submit" id="loginButton" class="login-btn">🔑 Login</button>
            </form>
            
            <div class="login-help">
                <p><strong>Demo Credentials:</strong></p>
                <p>Username: admin | Password: admin123</p>
            </div>
        </div>
    </div>

    <!-- MAIN APPLICATION -->
    <div id="mainApp" class="app-container hidden">
        <header class="app-header">
            <div>
                <select id="appModeSelector" class="app-switcher">
                    <option value="loan">💰 Loan Management</option>
                    <option value="realestate">🏢 Real Estate Management</option>
                </select>
            </div>
            <div>
                <h1 id="appTitle">💰 Loan Management</h1>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div id="primeRateDisplay" class="prime-rate-display" title="Click to update Prime Rate">
                    Prime: <span id="primeRateValue">5.50</span>%
                </div>
                <span id="userDisplay">Welcome, Admin</span>
                <button id="logoutBtn" class="btn btn-outline">Logout</button>
            </div>
        </header>

        <div class="app-main">
            <!-- LEFT SIDEBAR -->
            <aside class="sidebar">
                <nav>
                    <ul class="sidebar-nav" id="sidebarNav">
                        <!-- Navigation populated by JavaScript -->
                    </ul>
                </nav>
            </aside>

            <!-- MAIN CONTENT AREA -->
            <main class="main-content">
                <!-- DASHBOARD VIEW -->
                <div id="dashboard" class="view active">
                    <div class="view-header">
                        <h1 id="dashboardTitle">Dashboard</h1>
                        <p class="view-subtitle">Overview of your business operations</p>
                    </div>
                    <div class="dashboard-grid" id="dashboardMetrics">
                        <!-- Metrics populated by JavaScript -->
                    </div>
                </div>

                <!-- ALL LOANS VIEW -->
                <div id="loans" class="view">
                    <div class="view-header">
                        <h1>All Loans</h1>
                        <p class="view-subtitle">Complete loan portfolio management</p>
                        <div style="margin-top: 1rem;">
                            <button class="btn btn-primary" id="addLoanBtn">➕ Add New Loan</button>
                        </div>
                    </div>
                    <div class="table-container" id="loansTable">
                        <!-- Loans table populated by JavaScript -->
                    </div>
                </div>

                <!-- NEW LOAN VIEW -->
                <div id="new-loan" class="view">
                    <div class="view-header">
                        <h1>Create New Loan</h1>
                        <p class="view-subtitle">Professional loan setup with advanced features</p>
                    </div>
                    <div class="form-layout">
                        <div class="form-section">
                            <h3>Quick Access</h3>
                            <p>Use the "Add New Loan" button from any view to create loans with advanced banking features.</p>
                            <div style="margin-top: 1rem;">
                                <button class="btn btn-primary" id="quickAddLoanBtn">➕ Add New Loan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PAYMENT SCHEDULE VIEW -->
                <div id="payment-schedule" class="view">
                    <div class="view-header">
                        <h1>Payment Schedule</h1>
                        <p class="view-subtitle">Advanced payment timeline with banking-grade calculations</p>
                    </div>
                    
                    <div class="schedule-controls">
                        <div class="schedule-filters">
                            <div class="filter-group">
                                <label>Filter by Loan:</label>
                                <select id="loanFilter" class="form-control">
                                    <option value="all">All Loans</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Time Period:</label>
                                <div class="time-filters">
                                    <button class="time-filter-btn active" data-filter="upcoming">Upcoming</button>
                                    <button class="time-filter-btn" data-filter="overdue">Overdue</button>
                                    <button class="time-filter-btn" data-filter="paid">Past Paid</button>
                                    <button class="time-filter-btn" data-filter="missed">Missed</button>
                                    <button class="time-filter-btn" data-filter="all">All History</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="schedule-table">
                        <div class="table-header">
                            <div>Date</div>
                            <div>Borrower</div>
                            <div>Payment</div>
                            <div>Principal</div>
                            <div>Interest</div>
                            <div>Balance</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>
                        <div id="paymentRows">
                            <!-- Payment rows populated by JavaScript -->
                        </div>
                    </div>
                </div>

                <!-- PROPERTIES VIEW -->
                <div id="properties" class="view">
                    <div class="view-header">
                        <h1>Properties</h1>
                        <p class="view-subtitle">Professional property portfolio management</p>
                        <div style="margin-top: 1rem;">
                            <button class="btn btn-primary" id="addPropertyBtn">🏢 Add Property</button>
                        </div>
                    </div>
                    <div class="properties-grid" id="propertiesGrid">
                        <!-- Properties populated by JavaScript -->
                    </div>
                </div>

                <!-- TENANTS VIEW -->
                <div id="tenants" class="view">
                    <div class="view-header">
                        <h1>Tenants</h1>
                        <p class="view-subtitle">Advanced tenant and lease management</p>
                        <div style="margin-top: 1rem;">
                            <button class="btn btn-primary" id="addTenantBtn">👥 Add Tenant</button>
                        </div>
                    </div>
                    <div class="table-container" id="tenantsTable">
                        <!-- Tenants table populated by JavaScript -->
                    </div>
                </div>

                <!-- RENT SCHEDULE VIEW -->
                <div id="rent-schedule" class="view">
                    <div class="view-header">
                        <h1>Rent Payment Schedule</h1>
                        <p class="view-subtitle">Track rent collections and arrears</p>
                    </div>
                    <div class="table-container" id="rentScheduleTable">
                        <!-- Rent schedule populated by JavaScript -->
                    </div>
                </div>

                <!-- REPORTS VIEW -->
                <div id="reports" class="view">
                    <div class="view-header">
                        <h1>Reports & Analytics</h1>
                        <p class="view-subtitle">Banking-grade reporting and analysis</p>
                    </div>
                    <div class="form-layout">
                        <div class="form-section">
                            <h3>📊 Advanced Reporting</h3>
                            <p>Comprehensive financial analysis and portfolio insights coming soon.</p>
                        </div>
                    </div>
                </div>

                <!-- SETTINGS VIEW -->
                <div id="settings" class="view">
                    <div class="view-header">
                        <h1>System Settings</h1>
                        <p class="view-subtitle">Configure system parameters and preferences</p>
                    </div>
                    <div class="form-layout">
                        <div class="form-section">
                            <h3>Interest Rate Settings</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Current Prime Rate (%)</label>
                                    <input type="number" id="settingsPrimeRate" class="form-control" step="0.01" value="5.50">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Default Fixed Rate (%)</label>
                                    <input type="number" class="form-control" value="6.5" step="0.1">
                                </div>
                            </div>
                            <div class="form-actions">
                                <button class="btn btn-primary" onclick="businessManager.updatePrimeRate()">Update Prime Rate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- MODAL CONTAINER -->
    <div id="modalContainer"></div>

    <!-- NOTIFICATION CONTAINER -->
    <div id="notificationContainer"></div>

    <script src="app.js"></script>
</body>
</html>
