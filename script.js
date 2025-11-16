let students = [
    {
        id: "123456789012",
        name: "Juan Dela Cruz",
        birthdate: "2006-05-15",
        gender: "Male",
        track: "Academic",
        strand: "STEM",
        gradeLevel: "Grade 11",
        section: "Newton",
        guardian: "Maria Dela Cruz",
        guardianContact: "09123456789"
    },
    {
        id: "234567890123",
        name: "Maria Santos",
        birthdate: "2006-08-22",
        gender: "Female",
        track: "Academic",
        strand: "HUMSS",
        gradeLevel: "Grade 12",
        section: "Aristotle",
        guardian: "Pedro Santos",
        guardianContact: "09234567890"
    },
    {
        id: "345678901234",
        name: "Luis Reyes",
        birthdate: "2005-12-10",
        gender: "Male",
        track: "Technical-Vocational-Livelihood",
        strand: "ICT",
        gradeLevel: "Grade 12",
        section: "Gates",
        guardian: "Elena Reyes",
        guardianContact: "09345678901"
    }
];

const validUsers = [
    { username: "admin", password: "admin123", name: "Administrator" },
    { username: "teacher", password: "teacher123", name: "Teacher" },
    { username: "shsadmin", password: "shs2024", name: "SHS Coordinator" }
];

const loginPage = document.getElementById('login-page');
const app = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const welcomeUser = document.getElementById('welcome-user');

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const pageTitle = document.getElementById('page-title');
const studentForm = document.getElementById('student-form');
const registerAlert = document.getElementById('register-alert');
const studentsList = document.getElementById('students-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const reportOptions = document.querySelectorAll('.report-option');
const reportOutput = document.getElementById('report-output');

const editModal = document.getElementById('edit-modal');
const closeEditModal = document.getElementById('close-edit-modal');
const cancelEdit = document.getElementById('cancel-edit');
const editStudentForm = document.getElementById('edit-student-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        loginError.style.display = 'none';
        welcomeUser.textContent = `Welcome, ${user.name}`;
        loginPage.classList.add('hidden');
        app.classList.remove('hidden');
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        loginError.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    app.classList.add('hidden');
    loginPage.classList.remove('hidden');
    
    loginForm.reset();
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn === 'true' && currentUser) {
        welcomeUser.textContent = `Welcome, ${currentUser.name}`;
        loginPage.classList.add('hidden');
        app.classList.remove('hidden');
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(section => section.classList.add('hidden'));
        document.getElementById(targetSection).classList.remove('hidden');
        
        updatePageTitle(targetSection);
        
        if (targetSection === 'view') {
            loadStudentsTable();
        }
    });
});

function updatePageTitle(section) {
    const titles = {
        'register': 'Register New SHS Student',
        'view': 'View All SHS Students',
        'search': 'Search SHS Student',
        'reports': 'Generate SHS Reports'
    };
    pageTitle.textContent = titles[section];
}

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('student-id').value;
    const fullName = document.getElementById('full-name').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const track = document.getElementById('track').value;
    const strand = document.getElementById('strand').value;
    const gradeLevel = document.getElementById('grade-level').value;
    const section = document.getElementById('section').value;
    const guardian = document.getElementById('guardian').value;
    const guardianContact = document.getElementById('guardian-contact').value;
    
    if (students.some(student => student.id === studentId)) {
        showAlert('A student with this LRN already exists!', 'danger');
        return;
    }
    
    const newStudent = {
        id: studentId,
        name: fullName,
        birthdate: birthdate,
        gender: gender,
        track: track,
        strand: strand,
        gradeLevel: gradeLevel,
        section: section,
        guardian: guardian,
        guardianContact: guardianContact
    };
    
    students.push(newStudent);
    
    showAlert('SHS student registered successfully!', 'success');
    
    studentForm.reset();
    
    if (!document.getElementById('view').classList.contains('hidden')) {
        loadStudentsTable();
    }
});

function showAlert(message, type) {
    registerAlert.textContent = message;
    registerAlert.className = `alert alert-${type}`;
    registerAlert.classList.remove('hidden');
    
    setTimeout(() => {
        registerAlert.classList.add('hidden');
    }, 3000);
}

function loadStudentsTable() {
    studentsList.innerHTML = '';
    
    if (students.length === 0) {
        studentsList.innerHTML = '<tr><td colspan="7" style="text-align: center;">No students registered yet.</td></tr>';
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.track}</td>
            <td>${student.strand}</td>
            <td>${student.gradeLevel}</td>
            <td>${student.section}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${student.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${student.id}">Delete</button>
            </td>
        `;
        studentsList.appendChild(row);
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const studentId = e.target.getAttribute('data-id');
            openEditModal(studentId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const studentId = e.target.getAttribute('data-id');
            deleteStudent(studentId);
        });
    });
}

function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-full-name').value = student.name;
        document.getElementById('edit-birthdate').value = student.birthdate;
        document.getElementById('edit-gender').value = student.gender;
        document.getElementById('edit-track').value = student.track;
        document.getElementById('edit-strand').value = student.strand;
        document.getElementById('edit-grade-level').value = student.gradeLevel;
        document.getElementById('edit-section').value = student.section;
        document.getElementById('edit-guardian').value = student.guardian;
        document.getElementById('edit-guardian-contact').value = student.guardianContact;
        
        editModal.style.display = 'flex';
    }
}

function closeEditModalFunc() {
    editModal.style.display = 'none';
    editStudentForm.reset();
}

editStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('edit-student-id').value;
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        students[studentIndex] = {
            id: studentId,
            name: document.getElementById('edit-full-name').value,
            birthdate: document.getElementById('edit-birthdate').value,
            gender: document.getElementById('edit-gender').value,
            track: document.getElementById('edit-track').value,
            strand: document.getElementById('edit-strand').value,
            gradeLevel: document.getElementById('edit-grade-level').value,
            section: document.getElementById('edit-section').value,
            guardian: document.getElementById('edit-guardian').value,
            guardianContact: document.getElementById('edit-guardian-contact').value
        };
        
        closeEditModalFunc();
        
        loadStudentsTable();
        
        showAlert('Student information updated successfully!', 'success');
    }
});

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== studentId);
        loadStudentsTable();
        showAlert('Student deleted successfully!', 'success');
    }
}

closeEditModal.addEventListener('click', closeEditModalFunc);
cancelEdit.addEventListener('click', closeEditModalFunc);

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModalFunc();
    }
});

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        searchResults.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }
    
    const results = students.filter(student => 
        student.id.toLowerCase().includes(query) || 
        student.name.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No students found matching your search.</p>';
        return;
    }
    
    results.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <h4>${student.name} (LRN: ${student.id})</h4>
            <p><strong>Track:</strong> ${student.track}</p>
            <p><strong>Strand:</strong> ${student.strand}</p>
            <p><strong>Grade Level:</strong> ${student.gradeLevel}</p>
            <p><strong>Section:</strong> ${student.section}</p>
            <p><strong>Guardian:</strong> ${student.guardian}</p>
            <p><strong>Guardian Contact:</strong> ${student.guardianContact}</p>
            <div class="action-buttons">
                <button class="action-btn edit-btn" data-id="${student.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${student.id}">Delete</button>
            </div>
        `;
        searchResults.appendChild(card);
    });
    
    document.querySelectorAll('#search-results .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const studentId = e.target.getAttribute('data-id');
            openEditModal(studentId);
        });
    });
    
    document.querySelectorAll('#search-results .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const studentId = e.target.getAttribute('data-id');
            deleteStudent(studentId);
        });
    });
}

reportOptions.forEach(option => {
    option.addEventListener('click', () => {
        const reportType = option.getAttribute('data-report');
        generateReport(reportType);
    });
});

function generateReport(type) {
    let reportHTML = '';
    
    switch(type) {
        case 'student-list':
            reportHTML = '<h4>Complete Student List</h4>';
            if (students.length === 0) {
                reportHTML += '<p>No students registered.</p>';
            } else {
                reportHTML += `
                    <table>
                        <thead>
                            <tr>
                                <th>LRN</th>
                                <th>Name</th>
                                <th>Track</th>
                                <th>Strand</th>
                                <th>Grade Level</th>
                                <th>Section</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                students.forEach(student => {
                    reportHTML += `
                        <tr>
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>${student.track}</td>
                            <td>${student.strand}</td>
                            <td>${student.gradeLevel}</td>
                            <td>${student.section}</td>
                        </tr>
                    `;
                });
                
                reportHTML += '</tbody></table>';
            }
            break;
            
        case 'track-enrollment':
            reportHTML = '<h4>Track Enrollment Statistics</h4>';
            const trackCounts = {};
            students.forEach(student => {
                trackCounts[student.track] = (trackCounts[student.track] || 0) + 1;
            });
            
            if (Object.keys(trackCounts).length === 0) {
                reportHTML += '<p>No enrollment data available.</p>';
            } else {
                reportHTML += '<ul>';
                for (const track in trackCounts) {
                    reportHTML += `<li>${track}: ${trackCounts[track]} students</li>`;
                }
                reportHTML += '</ul>';
            }
            break;
            
        case 'strand-enrollment':
            reportHTML = '<h4>Strand Enrollment Statistics</h4>';
            const strandCounts = {};
            students.forEach(student => {
                strandCounts[student.strand] = (strandCounts[student.strand] || 0) + 1;
            });
            
            if (Object.keys(strandCounts).length === 0) {
                reportHTML += '<p>No strand data available.</p>';
            } else {
                reportHTML += '<ul>';
                for (const strand in strandCounts) {
                    reportHTML += `<li>${strand}: ${strandCounts[strand]} students</li>`;
                }
                reportHTML += '</ul>';
            }
            break;
            
        case 'grade-level':
            reportHTML = '<h4>Grade Level Distribution</h4>';
            const gradeCounts = {};
            students.forEach(student => {
                gradeCounts[student.gradeLevel] = (gradeCounts[student.gradeLevel] || 0) + 1;
            });
            
            if (Object.keys(gradeCounts).length === 0) {
                reportHTML += '<p>No grade level data available.</p>';
            } else {
                reportHTML += '<ul>';
                for (const grade in gradeCounts) {
                    reportHTML += `<li>${grade}: ${gradeCounts[grade]} students</li>`;
                }
                reportHTML += '</ul>';
            }
            break;
    }
    
    reportOutput.innerHTML = reportHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadStudentsTable();
});