// Конфігурація схем полів для кожної сутності
const entitySchemas = {
    teachers: {
        title: "Викладача",
        fields: [
            { key: "fullName", label: "ПІБ", type: "text", required: true },
            { key: "department", label: "Кафедра", type: "text", required: true },
            { key: "position", label: "Посада", type: "text", required: true },
            { key: "disciplines", label: "Дисципліни", type: "text", required: true },
            { key: "experience", label: "Стаж (років)", type: "number", min: 0, required: true },
            { key: "degree", label: "Науковий ступінь", type: "text", required: true },
            { key: "email", label: "Email", type: "email", required: true }
        ]
    },
    students: {
        title: "Студента",
        fields: [
            { key: "fullName", label: "ПІБ", type: "text", required: true },
            { key: "group", label: "Група", type: "text", required: true },
            { key: "specialty", label: "Спеціальність", type: "text", required: true },
            { key: "course", label: "Курс", type: "number", min: 1, max: 6, required: true },
            { key: "avgGrade", label: "Середній бал", type: "number", step: "0.1", min: 0, max: 100, required: true },
            { key: "studyForm", label: "Форма навчання", type: "select", options: ["Денна", "Заочна"], required: true },
            { key: "email", label: "Email", type: "email", required: true }
        ]
    },
    disciplines: {
        title: "Дисципліну",
        fields: [
            { key: "name", label: "Назва дисципліни", type: "text", required: true },
            { key: "credits", label: "Кредити ECTS", type: "number", min: 1, required: true },
            { key: "semester", label: "Семестр", type: "number", min: 1, max: 12, required: true },
            { key: "department", label: "Кафедра", type: "text", required: true },
            { key: "lecturer", label: "Лектор", type: "text", required: true },
            { key: "hours", label: "Годин", type: "number", min: 10, required: true },
            { key: "controlType", label: "Форма контролю", type: "select", options: ["Екзамен", "Залік", "Диф. залік"], required: true }
        ]
    }
};

// Вхідні дані
const universityData = {
    teachers: [
        {
            fullName: "Столяренко Тетяна Леонідівна",
            department: "Інтелектуальних систем управління",
            position: "Доцент",
            disciplines: "Об'єктно-орієнтоване програмування, Python",
            experience: 12,
            degree: "Кандидат пед. наук",
            email: "t.stoliarenko@hneu.edu.ua"
        },
        {
            fullName: "Коваленко Іван Петрович",
            department: "Економічної кібернетики",
            position: "Професор",
            disciplines: "Економетрика, Бази даних",
            experience: 20,
            degree: "Доктор екон. наук",
            email: "i.kovalenko@hneu.edu.ua"
        }
    ],
    students: [
        {
            fullName: "Петренко Андрій Дмитрович",
            group: "КН-21",
            specialty: "Комп'ютерні науки",
            course: 3,
            avgGrade: 91.5,
            studyForm: "Денна",
            email: "andrii.petrenko@student.ua"
        }
    ],
    disciplines: [
        {
            name: "Об'єктно-орієнтоване програмування",
            credits: 5,
            semester: 3,
            department: "Інтелектуальних систем управління",
            lecturer: "Столяренко Т. Л.",
            hours: 150,
            controlType: "Екзамен"
        }
    ]
};

let currentTab = "teachers"; // Поточна активна вкладка

// Рендеринг таблиць
function renderTables() {
    // 1. Викладачі
    const teachersTbody = document.getElementById('teachers-tbody');
    teachersTbody.innerHTML = universityData.teachers.map(item => `
        <tr>
            <td>${item.fullName}</td>
            <td>${item.department}</td>
            <td>${item.position}</td>
            <td>${item.disciplines}</td>
            <td>${item.experience}</td>
            <td>${item.degree}</td>
            <td>${item.email}</td>
        </tr>
    `).join('');

    // 2. Студенти
    const studentsTbody = document.getElementById('students-tbody');
    studentsTbody.innerHTML = universityData.students.map(item => `
        <tr>
            <td>${item.fullName}</td>
            <td>${item.group}</td>
            <td>${item.specialty}</td>
            <td>${item.course}</td>
            <td>${item.avgGrade}</td>
            <td>${item.studyForm}</td>
            <td>${item.email}</td>
        </tr>
    `).join('');

    // 3. Дисципліни
    const disciplinesTbody = document.getElementById('disciplines-tbody');
    disciplinesTbody.innerHTML = universityData.disciplines.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.credits}</td>
            <td>${item.semester}</td>
            <td>${item.department}</td>
            <td>${item.lecturer}</td>
            <td>${item.hours}</td>
            <td>${item.controlType}</td>
        </tr>
    `).join('');
}

// Налаштування табів
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            currentTab = button.getAttribute('data-target');
            document.getElementById(currentTab).classList.add('active');
        });
    });
}

// Генерація динамічних полів форми під поточну сутність
function generateFormFields(entityKey) {
    const container = document.getElementById('form-fields-container');
    const schema = entitySchemas[entityKey];
    
    document.getElementById('modal-title').textContent = `Додати ${schema.title}`;
    container.innerHTML = '';

    schema.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;
        formGroup.appendChild(label);

        if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.key;
            select.required = field.required;

            field.options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                select.appendChild(option);
            });
            formGroup.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.key;
            input.required = field.required;
            if (field.min !== undefined) input.min = field.min;
            if (field.max !== undefined) input.max = field.max;
            if (field.step !== undefined) input.step = field.step;
            
            formGroup.appendChild(input);
        }

        container.appendChild(formGroup);
    });
}

// Управління модальним вікном (Попапом)
function setupModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const openBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('add-data-form');

    const openModal = () => {
        generateFormFields(currentTab);
        modalOverlay.classList.add('active');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        form.reset();
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Закриття при кліку поза вікном
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Обробка відправки форми
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const newEntry = {};

        // Збір полів з урахуванням типів даних
        entitySchemas[currentTab].fields.forEach(field => {
            let val = formData.get(field.key);
            if (field.type === 'number') {
                val = Number(val);
            }
            newEntry[field.key] = val;
        });

        // Додавання нової сутності в масив
        universityData[currentTab].push(newEntry);

        // Оновлення таблиць
        renderTables();

        // Закриття попапу
        closeModal();
    });
}

// Ініціалізація проєкту
document.addEventListener('DOMContentLoaded', () => {
    renderTables();
    setupTabs();
    setupModal();
});