const data = {
    users: [],
    students: [],
    attendance: []
};

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    setTodayDate();
    loadDataFromStorage();
    updateUserDisplay();
});

function initializeEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    document.getElementById('registerForm2').addEventListener('submit', handleRegister2);

    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);

    document.getElementById('recordAttendanceForm').addEventListener('submit', handleRecordAttendance);

    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function switchTab(e) {
    const tabName = e.target.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    e.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (data.users.some(user => user.email === email)) {
        showMessage('registerMsg', 'Email already registered!', 'error');
        return;
    }

    const newUser = { name, email, password };
    data.users.push(newUser);
    saveDataToStorage();

    showMessage('registerMsg', `User "${name}" registered successfully!`, 'success');
    document.getElementById('registerForm').reset();
}

function handleRegister2(e) {
    e.preventDefault();

    const name = document.getElementById('regName2').value.trim();
    const email = document.getElementById('regEmail2').value.trim();
    const password = document.getElementById('regPassword2').value.trim();

    if (data.users.some(user => user.email === email)) {
        showMessage('registerMsg2', 'Email already registered!', 'error');
        return;
    }

    const newUser = { name, email, password };
    data.users.push(newUser);
    saveDataToStorage();

    showMessage('registerMsg2', `Account created! Please login with your credentials.`, 'success');
    document.getElementById('registerForm2').reset();
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        showMessage('loginMsg', `Welcome back, ${user.name}!`, 'success');
        updateUserDisplay();
        document.getElementById('loginForm').reset();
        
        setTimeout(() => {
            const studentBtn = document.querySelector('[data-tab="students"]');
            if (studentBtn) {
                studentBtn.click();
            }
        }, 1000);
    } else {
        showMessage('loginMsg', 'Invalid Email or Password!', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    updateUserDisplay();
    document.getElementById('logoutBtn').style.display = 'none';
    
    const loginBtn = document.querySelector('[data-tab="login"]');
    if (loginBtn) {
        loginBtn.click();
    }
}

function updateUserDisplay() {
    const userDisplay = document.getElementById('loggedInUser');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginTab = document.querySelector('[data-tab="login"]');
    const studentTab = document.querySelector('[data-tab="students"]');
    const attendanceTab = document.querySelector('[data-tab="attendance"]');
    const loginContent = document.getElementById('login');
    const studentContent = document.getElementById('students');
    const attendanceContent = document.getElementById('attendance');

    if (currentUser) {
        userDisplay.textContent = `✅ Logged in as: ${currentUser.name} (${currentUser.email})`;
        logoutBtn.style.display = 'inline-block';
        
        loginTab.classList.add('hidden');
        loginContent.classList.add('hidden');
        
        // Show protected tabs and content
        studentTab.classList.remove('hidden');
        attendanceTab.classList.remove('hidden');
        studentContent.classList.remove('hidden');
        attendanceContent.classList.remove('hidden');
    } else {
        userDisplay.textContent = '❌ Not logged in';
        logoutBtn.style.display = 'none';
        
        // Show Login tab and Register section
        loginTab.classList.remove('hidden');
        loginContent.classList.remove('hidden');
        
        // Hide protected tabs and content
        studentTab.classList.add('hidden');
        attendanceTab.classList.add('hidden');
        studentContent.classList.add('hidden');
        attendanceContent.classList.add('hidden');
    }
}

// Add Student
function handleAddStudent(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('studentId').value);
    const name = document.getElementById('studentName').value.trim();
    const course = document.getElementById('studentCourse').value.trim();

    // Check if student ID already exists
    if (data.students.some(student => student.id === id)) {
        showMessage('addStudentMsg', 'Student ID already exists!', 'error');
        return;
    }

    const newStudent = { id, name, course };
    data.students.push(newStudent);
    saveDataToStorage();

    showMessage('addStudentMsg', `Student "${name}" added successfully!`, 'success');
    document.getElementById('addStudentForm').reset();
    displayStudents();
}

// Display Students
function displayStudents() {
    const tbody = document.getElementById('studentsBody');

    if (data.students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No students added yet</td></tr>';
        return;
    }

    tbody.innerHTML = data.students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
        </tr>
    `).join('');
}

// Record Attendance
function handleRecordAttendance(e) {
    e.preventDefault();

    const studentId = parseInt(document.getElementById('attStudentId').value);
    const date = document.getElementById('attDate').value;
    const status = document.getElementById('attStatus').value;

    // Check if student exists
    if (!data.students.some(student => student.id === studentId)) {
        showMessage('recordAttMsg', 'Student ID not found!', 'error');
        return;
    }

    const newAttendance = { studentId, date, status };
    data.attendance.push(newAttendance);
    saveDataToStorage();

    showMessage('recordAttMsg', 'Attendance recorded successfully!', 'success');
    document.getElementById('recordAttendanceForm').reset();
    setTodayDate();
    displayAttendance();
}

// Display Attendance
function displayAttendance() {
    const tbody = document.getElementById('attendanceBody');

    if (data.attendance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No attendance records yet</td></tr>';
        return;
    }

    tbody.innerHTML = data.attendance.map(record => `
        <tr>
            <td>${record.studentId}</td>
            <td>${record.date}</td>
            <td><span class="status-badge ${record.status.toLowerCase()}">${record.status}</span></td>
        </tr>
    `).join('');
}

// Show Message
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;

    setTimeout(() => {
        element.className = 'message';
    }, 5000);
}

// Set Today's Date
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attDate').value = today;
}

// Local Storage
function saveDataToStorage() {
    localStorage.setItem('smartAttendData', JSON.stringify(data));
}

function loadDataFromStorage() {
    const stored = localStorage.getItem('smartAttendData');
    if (stored) {
        const parsed = JSON.parse(stored);
        data.users = parsed.users || [];
        data.students = parsed.students || [];
        data.attendance = parsed.attendance || [];
    }
}

// Add CSS for status badges dynamically
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85em;
    }
    .status-badge.present {
        background: #d4edda;
        color: #155724;
    }
    .status-badge.absent {
        background: #f8d7da;
        color: #721c24;
    }
    .status-badge.late {
        background: #fff3cd;
        color: #856404;
    }
`;
document.head.appendChild(style);
