let classes = [];
  
document.getElementById('class-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const className = document.getElementById('class-name').value;
  const classGPA = parseFloat(document.getElementById('class-gpa').value);
  const classCredits = parseInt(document.getElementById('class-credits').value);
  const classIsTechnical = document.getElementById('class-is-technical').checked;
  const semester = parseInt(document.getElementById('semester').value);

  const newClass = { className, classGPA, classCredits, classIsTechnical, semester };
  classes.push(newClass);
  displayClasses();
  calculateGPAs();
  saveClasses();
});

function saveClasses() {
  localStorage.setItem('classes', JSON.stringify(classes));
}

function loadClasses() {
  const storedClasses = localStorage.getItem('classes');
  if (storedClasses) {
    classes = JSON.parse(storedClasses);
    displayClasses();
    calculateGPAs();
  }
}


function calculateGPAs() {
  let totalPoints = 0;
  let totalCredits = 0;
  let technicalPoints = 0;
  let technicalCredits = 0;

  for (const c of classes) {
    totalPoints += c.classGPA * c.classCredits;
    totalCredits += c.classCredits;

    if (c.classIsTechnical) {
      technicalPoints += c.classGPA * c.classCredits;
      technicalCredits += c.classCredits;
    }
  }

  const totalGPA = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  const technicalGPA = technicalCredits ? (technicalPoints / technicalCredits).toFixed(2) : '0.00';
  const comboGPA = ((parseFloat(totalGPA) + parseFloat(technicalGPA)) / 2).toFixed(2);

  document.querySelector('#total-gpa span').textContent = totalGPA;
  document.querySelector('#technical-gpa span').textContent = technicalGPA;
  document.querySelector('#combo-gpa span').textContent = comboGPA;
}

function displayClasses() {
  const list = document.getElementById('class-list');
  list.innerHTML = '';
  classes.forEach((c, index) => {
    const item = document.createElement('div');
    item.className = 'class-item';
    item.innerHTML = `
      <div>${c.className} - GPA: ${c.classGPA}, Credits: ${c.classCredits} ${c.classIsTechnical ? '(Technical)' : ''}, Semester: ${c.semester}</div>
      <div class="class-actions">
        <button onclick="editClass(${index})">Edit</button>
        <button onclick="removeClass(${index})">Remove</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function removeClass(index) {
  classes.splice(index, 1);
  displayClasses();
  calculateGPAs();
  saveClasses();  // Save after removing a class
}
function editClass(index) {
  const c = classes[index];
  document.getElementById('class-name').value = c.className;
  document.getElementById('class-gpa').value = c.classGPA;
  document.getElementById('class-credits').value = c.classCredits;
  document.getElementById('class-is-technical').checked = c.classIsTechnical;
  removeClass(index);  // This removes the class and we expect the user to re-add it after editing.
}


const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
});

// Call loadClasses on page load to retrieve classes from local storage
document.addEventListener('DOMContentLoaded', loadClasses);

