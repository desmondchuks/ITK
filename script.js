const state = {
    user: { name: "Emmanuel", email: "emmanuel@example.com" },
    balance: 285500,
    plans: [
        { id: 1, name: "School Fees", icon: "🎓", saved: 325000, target: 500000, frequency: "Monthly", duration: 12, remaining: 4, amount: 20000, status: "Active" },
        { id: 2, name: "Business Capital", icon: "💼", saved: 150000, target: 200000, frequency: "Weekly", duration: 6, remaining: 2, amount: 5000, status: "Active" },
        { id: 3, name: "Emergency Fund", icon: "🛡️", saved: 75000, target: 150000, frequency: "Daily", duration: 9, remaining: 7, amount: 1000, status: "Active" }
    ],
    transactions: [
        { date: "Today", name: "School Fees", type: "Monthly Contribution", amount: 20000 },
        { date: "Aug 28, 2026", name: "Flex Savings", type: "Deposit", amount: 10000 },
        { date: "Aug 25, 2026", name: "Flex Savings", type: "Withdrawal", amount: -5000 },
        { date: "Aug 20, 2026", name: "Business Capital", type: "Weekly Contribution", amount: 5000 },
        { date: "Aug 14, 2026", name: "School Fees", type: "Monthly Contribution", amount: 20000 }
    ],
    notifications: [
        { icon: "🔔", title: "Contribution due tomorrow", body: "Your ₦20,000 School Fees contribution is scheduled for tomorrow.", time: "1 hour ago" },
        { icon: "🎉", title: "Savings milestone reached", body: "You crossed ₦300,000 in your School Fees goal.", time: "Yesterday" },
        { icon: "⚠️", title: "Plan reminder", body: "Your Business Capital contribution is due this week.", time: "2 days ago" }
    ],
    view: "dashboard"
};

function money(n) { return "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 }) }
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.className = "show"; setTimeout(() => t.className = "", 2600) }
function showAuth(mode) { document.getElementById("landing").classList.add("hidden"); document.getElementById("app").classList.add("hidden"); document.getElementById("auth").classList.remove("hidden"); renderAuth(mode) }
function backLanding() { document.getElementById("auth").classList.add("hidden"); document.getElementById("landing").classList.remove("hidden") }
function renderAuth(mode) {
    const c = document.getElementById("authContent");
    if (mode === "login") c.innerHTML = `<h1>Welcome back</h1><p class="subtitle">Log in to continue managing your savings.</p>
 <div class="form-group"><label>Email address</label><input id="loginEmail" type="email" value="emmanuel@example.com"></div>
 <div class="form-group"><label>Password</label><input id="loginPass" type="password" value="password"></div>
 <button class="btn btn-primary full" onclick="enterApp()">Log in</button>
 <p class="auth-switch">New to Savora? <button onclick="renderAuth('signup')">Create an account</button></p>`;
    else c.innerHTML = `<h1>Create your account</h1><p class="subtitle">Start building better savings habits today.</p>
 <div class="form-group"><label>Full name</label><input id="signupName" placeholder="e.g. Emmanuel Ogbonnaya"></div>
 <div class="form-group"><label>Email address</label><input id="signupEmail" type="email" placeholder="you@example.com"></div>
 <div class="form-group"><label>Password</label><input id="signupPass" type="password" placeholder="Minimum 8 characters"></div>
 <button class="btn btn-primary full" onclick="createAccount()">Create account</button>
 <p class="auth-switch">Already registered? <button onclick="renderAuth('login')">Log in</button></p>`;
}
function createAccount() { const n = document.getElementById("signupName").value.trim(); const e = document.getElementById("signupEmail").value.trim(); if (!n || !e) { toast("Please complete your details."); return } state.user.name = n.split(" ")[0]; state.user.email = e; enterApp() }
function enterApp() { document.getElementById("auth").classList.add("hidden"); document.getElementById("app").classList.remove("hidden"); navigate("dashboard") }
function logout() { document.getElementById("app").classList.add("hidden"); document.getElementById("landing").classList.remove("hidden"); toast("You have been logged out.") }
function navigate(view) {
    state.view = view;

    document.querySelectorAll(".sidebar button[data-view]").forEach(b => {
        b.classList.toggle("active", b.dataset.view === view);
    });

    const title = {
        dashboard: "Dashboard",
        savings: "My Savings",
        goals: "Goals",
        contributions: "Contributions",
        transactions: "Transactions",
        notifications: "Notifications",
        settings: "Settings"
    }[view];

    document.getElementById("pageTitle").textContent = title;

    // Close mobile sidebar
    document.querySelector(".sidebar").classList.remove("open");

    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.textContent = "☰";
    }

    renderView();
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const hamburger = document.querySelector(".hamburger");

    sidebar.classList.toggle("open");

    if (sidebar.classList.contains("open")) {
        hamburger.textContent = "✕";
    } else {
        hamburger.textContent = "☰";
    }
}
function toggleMobileNav() {
    const navlinks = document.querySelector(".navlinks");
    const menu = document.querySelector(".mobile-menu");

    navlinks.classList.toggle("mobile-open");

    menu.textContent = navlinks.classList.contains("mobile-open")
        ? "✕"
        : "☰";
}function renderView() { const v = document.getElementById("view"); if (state.view === "dashboard") v.innerHTML = dashboard(); if (state.view === "savings") v.innerHTML = savings(); if (state.view === "goals") v.innerHTML = goals(); if (state.view === "contributions") v.innerHTML = contributions(); if (state.view === "transactions") v.innerHTML = transactions(); if (state.view === "notifications") v.innerHTML = notifications(); if (state.view === "settings") v.innerHTML = settings() }
function dashboard() {
    return `<div class="content">
 <div class="welcome"><div><h1>Good morning, ${state.user.name} 👋</h1><p>Here's what's happening with your savings.</p></div><button class="btn btn-primary" onclick="openPlanModal()">＋ New Savings Plan</button></div>
 <div class="stat-grid"><div class="stat main-stat"><div class="stat-label">TOTAL SAVINGS</div><div class="stat-value">${money(state.balance)}</div><div class="stat-change">↑ ₦25,000 this month</div></div><div class="stat"><div class="stat-label">ACTIVE PLANS</div><div class="stat-value">${state.plans.filter(p => p.status === "Active").length}</div><div class="stat-change">Keep going!</div></div><div class="stat"><div class="stat-label">SAVINGS STREAK</div><div class="stat-value">28 days 🔥</div><div class="stat-change">Personal best</div></div></div>
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Active Savings</h3><button class="link-btn" onclick="navigate('savings')">View all</button></div>${state.plans.slice(0, 3).map(planCard).join("")}</div>
 <div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="action-grid"><button class="quick" onclick="openDeposit()"><strong>＋ Deposit</strong><small>Add money</small></button><button class="quick" onclick="openWithdraw()"><strong>↗ Withdraw</strong><small>Move funds</small></button><button class="quick" onclick="openPlanModal()"><strong>🎯 New Goal</strong><small>Start saving</small></button><button class="quick" onclick="navigate('transactions')"><strong>≡ History</strong><small>View activity</small></button></div></div></div>
 <div class="dashboard-grid"><div class="panel"><div class="panel-head"><h3>Recent Transactions</h3><button class="link-btn" onclick="navigate('transactions')">View all</button></div>${state.transactions.slice(0, 4).map(txRow).join("")}</div><div class="panel"><div class="panel-head"><h3>Savings Tip</h3></div><div style="font-size:26px">💡</div><p style="font-size:12px;line-height:1.6;color:#718079">Consistency beats size. A small contribution made regularly can help you build a strong savings habit.</p></div></div>
 </div>`}
function planCard(p) { let pct = Math.min(100, p.saved / p.target * 100); return `<div class="saving-card"><div class="saving-top"><div><div class="saving-name">${p.icon} ${p.name}</div><div class="saving-meta">${p.frequency} • ${p.duration} Months • ${p.remaining} months remaining</div></div><div class="saving-percent">${pct.toFixed(0)}%</div></div><div class="saving-progress"><i style="width:${pct}%"></i></div><div class="saving-amount">${money(p.saved)} of ${money(p.target)}</div></div>` }
function txRow(t) { return `<div class="tx"><div class="tx-left"><div class="tx-icon">${t.amount > 0 ? "↓" : "↑"}</div><div><div class="tx-name">${t.name}</div><div class="tx-date">${t.type} • ${t.date}</div></div></div><div class="tx-amount ${t.amount > 0 ? "plus" : "minus"}">${t.amount > 0 ? "+" : "−"}${money(Math.abs(t.amount))}</div></div>` }
function savings() { return `<div class="content"><div class="page-section-title"><h1>My Savings</h1><button class="btn btn-primary" onclick="openPlanModal()">＋ Create Plan</button></div><div class="plans-grid">${state.plans.map(p => `<div class="big-plan">${planCard(p)}<div class="detail-row"><span>Next contribution</span><b>${money(p.amount)}</b></div><div class="detail-row"><span>Status</span><b style="color:#277257">${p.status}</b></div><button class="btn btn-outline full" onclick="openPlanDetails(${p.id})">Manage plan</button></div>`).join("")}</div></div>` }
function goals() { return `<div class="content"><div class="page-section-title"><h1>Your Goals</h1><button class="btn btn-primary" onclick="openPlanModal()">＋ New Goal</button></div><div class="goal-grid">${state.plans.map(p => `<div class="goal-card"><div class="goal-icon">${p.icon}</div><h3>${p.name}</h3><p>Target: ${money(p.target)}</p><div class="saving-progress"><i style="width:${Math.min(100, p.saved / p.target * 100)}%"></i></div><p><b>${money(p.saved)}</b> saved • ${Math.round(p.saved / p.target * 100)}% complete</p></div>`).join("")}</div></div>` }
function contributions() { return `<div class="content"><div class="page-section-title"><h1>Contributions</h1><button class="btn btn-primary" onclick="openPlanModal()">＋ Start Contribution</button></div><div class="panel"><div class="panel-head"><h3>Contribution schedule</h3><span class="status">3 active</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Plan</th><th>Frequency</th><th>Amount</th><th>Next Due</th><th>Status</th></tr></thead><tbody>${state.plans.map((p, i) => `<tr><td>${p.icon} ${p.name}</td><td>${p.frequency}</td><td>${money(p.amount)}</td><td>${i === 0 ? "Sep 3" : i === 1 ? "Sep 4" : "Sep 3"}, 2026</td><td><span class="status">Active</span></td></tr>`).join("")}</tbody></table></div></div></div>` }
function transactions() { return `<div class="content"><div class="page-section-title"><h1>Transactions</h1><div class="filters"><button class="filter active">All</button><button class="filter">Deposits</button><button class="filter">Withdrawals</button></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th></tr></thead><tbody>${state.transactions.map(t => `<tr><td>${t.date}</td><td>${t.name}</td><td>${t.type}</td><td class="${t.amount > 0 ? "plus" : "minus"}">${t.amount > 0 ? "+" : "−"}${money(Math.abs(t.amount))}</td></tr>`).join("")}</tbody></table></div></div>` }
function notifications() { return `<div class="content"><div class="page-section-title"><h1>Notifications</h1><button class="link-btn" onclick="toast('All notifications marked as read.')">Mark all as read</button></div>${state.notifications.map(n => `<div class="notice"><div style="font-size:20px">${n.icon}</div><div><b>${n.title}</b><p>${n.body}</p><small class="muted">${n.time}</small></div></div>`).join("")}</div>` }
function settings() { return `<div class="content"><div class="page-section-title"><h1>Settings</h1></div><div class="settings"><div class="setting-row"><div><b>Profile information</b><p>${state.user.name} • ${state.user.email}</p></div><button class="link-btn" onclick="toast('Profile editor is part of the prototype.')">Edit</button></div><div class="setting-row"><div><b>Contribution reminders</b><p>Receive reminders before scheduled deposits.</p></div><button class="filter active" onclick="toast('Reminder preference toggled.')">ON</button></div><div class="setting-row"><div><b>Security</b><p>PIN, password and account security controls.</p></div><button class="link-btn" onclick="toast('Security settings opened.')">Manage</button></div></div></div>` }

function openModal(content) { document.getElementById("modalContent").innerHTML = content; document.getElementById("modal").classList.remove("hidden") }
function closeModal() { document.getElementById("modal").classList.add("hidden") }
function openDeposit() { openModal(`<h2>Make a deposit</h2><p class="subtitle">Simulate adding money to your Savora balance.</p><div class="form-group"><label>Amount</label><input id="depositAmount" type="number" min="100" value="10000"></div><div class="form-group"><label>Destination</label><select id="depositPlan"><option>General Savings</option>${state.plans.map(p => `<option>${p.name}</option>`).join("")}</select></div><button class="btn btn-primary full" onclick="deposit()">Confirm Deposit</button>`) }
function deposit() { const a = Number(document.getElementById("depositAmount").value); if (a <= 0) { toast("Enter a valid amount."); return } state.balance += a; state.transactions.unshift({ date: "Just now", name: document.getElementById("depositPlan").value, type: "Deposit", amount: a }); closeModal(); renderView(); toast(`${money(a)} deposited successfully.`) }
function openWithdraw() { openModal(`<h2>Withdraw funds</h2><p class="subtitle">Early withdrawals may attract a plan-specific fee.</p><div class="form-group"><label>Amount</label><input id="withdrawAmount" type="number" min="100" value="10000" oninput="updateFee()"></div><div class="form-group"><label>Withdrawal reason</label><select><option>Personal need</option><option>Emergency</option><option>Goal completed</option></select></div><div id="feeBox" class="fee-box">Early withdrawal fee: <b>10%</b><br>Estimated fee: ₦1,000<br>You receive: ₦9,000</div><button class="btn btn-primary full" onclick="withdraw()">Confirm Withdrawal</button>`) }
function updateFee() { const a = Number(document.getElementById("withdrawAmount").value) || 0; const fee = a * .10; document.getElementById("feeBox").innerHTML = `Early withdrawal fee: <b>10%</b><br>Estimated fee: ${money(fee)}<br>You receive: <b>${money(Math.max(0, a - fee))}</b>` }
function withdraw() { const a = Number(document.getElementById("withdrawAmount").value); if (a <= 0 || a > state.balance) { toast("Insufficient balance or invalid amount."); return } const fee = a * .10, net = a - fee; state.balance -= a; state.transactions.unshift({ date: "Just now", name: "Savings withdrawal", type: "Early Withdrawal (10% fee)", amount: -a }); closeModal(); renderView(); toast(`Withdrawal requested. ${money(net)} payable after fee.`) }
function openPlanModal() {
    openModal(`<h2>Create a savings plan</h2><p class="subtitle">Set up a goal and see the contribution estimate instantly.</p>
<div class="form-group"><label>What are you saving for?</label><select id="goal"><option>🎓 School Fees</option><option>🏠 Rent</option><option>💼 Business Capital</option><option>📱 New Gadget</option><option>🛡️ Emergency Fund</option><option>🎯 Other Goal</option></select></div>
<div class="form-group"><label>Contribution frequency</label><select id="freq" onchange="calculatePlan()"><option>Daily</option><option>Weekly</option><option selected>Monthly</option></select></div>
<div class="form-group"><label>Duration</label><select id="duration" onchange="calculatePlan()"><option value="6">6 Months</option><option value="9">9 Months</option><option value="12" selected>12 Months</option></select></div>
<div class="form-group"><label>Contribution amount</label><input id="amount" type="number" value="20000" min="100" oninput="calculatePlan()"></div>
<div class="calculator"><div class="calc-row"><span>Estimated contributions</span><strong id="estimate">₦240,000</strong></div><div class="calc-row"><span>Contribution count</span><span id="count">12</span></div><div class="calc-row"><span>Early withdrawal fee</span><span>10%</span></div></div>
<button class="btn btn-primary full" onclick="createPlan()">Create Savings Plan</button>`)
}
function calculatePlan() { const f = document.getElementById("freq").value, d = Number(document.getElementById("duration").value), a = Number(document.getElementById("amount").value) || 0; let count = f === "Daily" ? Math.round(d * 30.4) : f === "Weekly" ? Math.round(d * 4.345) : d; document.getElementById("count").textContent = count; document.getElementById("estimate").textContent = money(count * a) }
function createPlan() { const f = document.getElementById("freq").value, d = Number(document.getElementById("duration").value), a = Number(document.getElementById("amount").value), goal = document.getElementById("goal").value; const names = goal.replace(/^.{2}/, "").trim(); if (a <= 0) { toast("Enter a valid contribution."); return } let count = f === "Daily" ? Math.round(d * 30.4) : f === "Weekly" ? Math.round(d * 4.345) : d; const target = count * a; state.plans.unshift({ id: Date.now(), name: names, icon: goal.slice(0, 2), saved: 0, target, frequency: f, duration: d, remaining: d, amount: a, status: "Active" }); closeModal(); renderView(); toast("Savings plan created successfully.") }
function openPlanDetails(id) { const p = state.plans.find(x => x.id === id); openModal(`<h2>${p.icon} ${p.name}</h2><p class="subtitle">${p.frequency} contribution • ${p.duration}-month plan</p>${planCard(p)}<div class="detail-row"><span>Next contribution</span><b>${money(p.amount)}</b></div><div class="detail-row"><span>Early withdrawal fee</span><b>10%</b></div><button class="btn btn-primary full" onclick="openDeposit();closeModal()">＋ Add Deposit</button>`) }
document.addEventListener("DOMContentLoaded", () => { document.getElementById("modal").classList.add("hidden") })