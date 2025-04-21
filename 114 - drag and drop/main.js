document.addEventListener('DOMContentLoaded', () => {
    // ======================
    // ELEMENT SELECTORS
    // ======================
    const listOpeners = document.querySelectorAll('.list-opener');
    const editBtns = document.querySelectorAll('.edit-btn, .fa-pen');
    const addStateBtn = document.querySelectorAll('.add-state, .add-state-btn, .add-new-state');
    const categoryPopupBtn = document.querySelector('.add-newCategory-popup');
    const addEditCategoryPopup = document.querySelector('.add-edit-category');
    const closePopupBtns = document.querySelectorAll('.fa-xmark');
    const addEditStatePopup = document.querySelector('.add-edit-state');
    const categoryNameInput = document.querySelector('#category_name');
    const formCategory = document.querySelector('.form-category');
    const formState = document.querySelector('.form-state');
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'category_color';
    colorPicker.value = '#614385';

    // Add color picker to category form
    const categoryFormDiv = formCategory.querySelector('div');
    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'category_color';
    colorLabel.textContent = 'Category color';
    categoryFormDiv.appendChild(colorLabel);
    categoryFormDiv.appendChild(colorPicker);

    // ======================
    // DATA MANAGEMENT
    // ======================
    const STORAGE_KEY = 'toDoAppData';
    let appData = {
        categories: [],
        tasks: []
    };

    // Initialize data from localStorage
    const initializeData = () => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            appData = JSON.parse(savedData);
            renderCategories();
            renderTasks();
        } else {
            // Set up default categories if no data exists
            appData.categories = [
                { id: 1, name: 'pending', color: '#b22222' },
                { id: 2, name: 'inProgress', color: '#201f50' },
                { id: 3, name: 'Done', color: '#1f501f' }
            ];
            saveData();
        }
    };

    // Save data to localStorage
    const saveData = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    };

    // ======================
    // POPUP HANDLERS
    // ======================
    const handleCategoryPopupOpen = (e) => {
        e.stopPropagation();
        addEditCategoryPopup.classList.add('active-popup');
        // Reset form when opening for new category
        if (!categoryNameInput.dataset.editId) {
            formCategory.reset();
            colorPicker.value = '#614385'; // Reset to default color
        }
    };

    const handlePopupClose = (e) => {
        e.stopPropagation();
        document.querySelectorAll('.add-edit-category, .add-edit-state').forEach(popup => {
            popup.classList.remove('active-popup');
        });
        // Clear edit mode when closing
        delete categoryNameInput.dataset.editId;
    };

    const handleOutsideClick = (e) => {
        // If click is inside any popup form, do nothing
        if (e.target.closest('.form-category, .form-state')) return;

        // If click is on a trigger button, do nothing (handled by button's own event)
        if (e.target.closest('.add-newCategory-popup, .add-state, .add-state-btn, .add-new-state')) return;

        // Close both popups if they're open
        addEditCategoryPopup.classList.remove('active-popup');
        addEditStatePopup.classList.remove('active-popup');

        // Close all menus
        document.querySelectorAll('.menu-list').forEach(menu => {
            menu.classList.remove('menu-opened');
        });

        // Clear edit mode when clicking outside
        delete categoryNameInput.dataset.editId;
    };

    // ======================
    // RENDER FUNCTIONS
    // ======================
    const renderCategories = () => {
        // Clear existing categories (except the container)
        document.querySelectorAll('.parent-box').forEach(box => {
            if (!box.classList.contains('container')) {
                box.remove();
            }
        });

        // Render each category
        appData.categories.forEach(category => {
            const categoryBox = document.createElement('div');
            categoryBox.className = `parent-box ${category.name.toLowerCase()}`;
            categoryBox.style.setProperty('--clr', category.color);

            // Build category HTML structure
            categoryBox.innerHTML = `
                <div class="box-header">
                    <div class="header-box">
                        <div class="box-title">
                            <h3>${category.name}</h3>
                        </div>
                        <div class="box-controls">
                            <div class="controls-list">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <i class="fa-solid fa-ellipsis-vertical list-opener"></i>
                                <div class="menu-list">
                                    <ul>
                                        <li class="add-state">
                                            <div><i class="fa-solid fa-plus add-state-btn"></i></div>
                                        </li>
                                        <li class="edit-btn">
                                            <div><i class="fa-solid fa-pen"></i></div>
                                        </li>
                                        <li class="delete-btn">
                                            <div><i class="fa-solid fa-trash-alt"></i></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-content-details"></div>
                </div>
            `;

            document.querySelector('.container').appendChild(categoryBox);
        });

        // Reattach event listeners after rendering
        attachEventListeners();
    };

    const renderTasks = () => {
        // Clear existing tasks first
        document.querySelectorAll('.box-content-details ul').forEach(ul => ul.innerHTML = '');

        appData.tasks.forEach(task => {
            const categoryBox = document.querySelector(`.${task.category.toLowerCase()}`);
            if (categoryBox) {
                const taskList = categoryBox.querySelector('.box-content-details') ||
                    document.createElement('div');
                taskList.className = 'box-content-details';

                if (!categoryBox.querySelector('.box-content-details')) {
                    categoryBox.querySelector('.box-header').after(taskList);
                }

                const ul = categoryBox.querySelector('.box-content-details ul') ||
                    document.createElement('ul');
                if (!categoryBox.querySelector('.box-content-details ul')) {
                    taskList.appendChild(ul);
                }

                const taskElement = document.createElement('li');
                taskElement.innerHTML = `
                    <figure>
                        <img src="${task.image || './assets/img (1).jpg'}" alt="">
                    </figure>
                    <div class="content_bx">
                        <div class="content-details">
                            <h5>${task.title}</h5>
                            <p>${task.description}</p>
                        </div>
                        <div class="content-badge">
                            ${task.category}
                        </div>
                    </div>
                `;
                ul.appendChild(taskElement);
            }
        });
    };

    // ======================
    // FORM HANDLERS
    // ======================
    const handleCategorySubmit = (e) => {
        e.preventDefault();
        const categoryName = categoryNameInput.value.trim();
        const categoryColor = colorPicker.value;

        if (categoryName) {
            // Check if we're editing an existing category
            const isEdit = categoryNameInput.dataset.editId;

            if (isEdit) {
                // Update existing category
                const category = appData.categories.find(c => c.id == isEdit);
                if (category) {
                    category.name = categoryName;
                    category.color = categoryColor;
                }
                delete categoryNameInput.dataset.editId;
            } else {
                // Add new category
                const newCategory = {
                    id: Date.now(),
                    name: categoryName,
                    color: categoryColor
                };
                appData.categories.push(newCategory);
            }

            saveData();
            renderCategories();
            addEditCategoryPopup.classList.remove('active-popup');
            formCategory.reset();
        }
    };

    const handleStateSubmit = (e) => {
        e.preventDefault();
        const stateName = document.querySelector('#state_name').value.trim();
        const stateStatus = document.querySelector('#state_status').value.trim();
        const stateImg = document.querySelector('#state_img').files[0];
        const category = document.querySelector('.parent-box.active')?.className.replace('parent-box ', '') || 'pending';

        if (stateName && stateStatus) {
            const newTask = {
                id: Date.now(),
                title: stateName,
                description: stateStatus,
                category: category,
                image: stateImg ? URL.createObjectURL(stateImg) : null
            };

            appData.tasks.push(newTask);
            saveData();
            renderTasks();
            addEditStatePopup.classList.remove('active-popup');
            formState.reset();
        }
    };

    // ======================
    // EVENT LISTENERS SETUP
    // ======================
    const attachEventListeners = () => {
        // Re-select elements after rendering
        const newListOpeners = document.querySelectorAll('.list-opener');
        const newEditBtns = document.querySelectorAll('.edit-btn, .fa-pen');
        const newAddStateBtn = document.querySelectorAll('.add-state, .add-state-btn, .add-new-state');
        const newClosePopupBtns = document.querySelectorAll('.fa-xmark');
        const newDeleteBtns = document.querySelectorAll('.delete-btn, .fa-trash-alt');

        // Form submissions
        formCategory?.addEventListener('submit', handleCategorySubmit);
        formState?.addEventListener('submit', handleStateSubmit);

        // Popup triggers
        categoryPopupBtn?.addEventListener('click', handleCategoryPopupOpen);

        // Close buttons
        newClosePopupBtns.forEach(btn => btn.addEventListener('click', handlePopupClose));

        // Edit buttons
        newEditBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const headerBox = btn.closest('.header-box');
                if (headerBox) {
                    const categoryName = headerBox.querySelector('h3').textContent.trim();
                    const category = appData.categories.find(c => c.name === categoryName);
                    if (category) {
                        categoryNameInput.value = category.name;
                        colorPicker.value = category.color;
                        categoryNameInput.dataset.editId = category.id;
                        addEditCategoryPopup.classList.add('active-popup');
                    }
                }
            });
        });

        // Delete buttons
        newDeleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const headerBox = btn.closest('.header-box');
                if (headerBox) {
                    const categoryName = headerBox.querySelector('h3').textContent.trim();
                    if (confirm(`Delete category "${categoryName}" and all its tasks?`)) {
                        appData.categories = appData.categories.filter(c => c.name !== categoryName);
                        appData.tasks = appData.tasks.filter(t => t.category.toLowerCase() !== categoryName.toLowerCase());
                        saveData();
                        renderCategories();
                        renderTasks();
                    }
                }
            });
        });

        // Menu toggles
        newListOpeners.forEach(listOpener => {
            listOpener.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = listOpener.parentElement.querySelector('.menu-list');
                document.querySelectorAll('.menu-list').forEach(m => {
                    if (m !== menu) m.classList.remove('menu-opened');
                });
                menu.classList.toggle('menu-opened');
            });
        });

        // State add buttons
        newAddStateBtn.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Mark the parent category as active
                const parentBox = btn.closest('.parent-box');
                document.querySelectorAll('.parent-box').forEach(box => {
                    box.classList.remove('active');
                });
                parentBox.classList.add('active');

                addEditStatePopup.classList.add('active-popup');
            });
        });

        // Outside click handler
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-list') && !e.target.closest('.list-opener')) {
                document.querySelectorAll('.menu-list').forEach(menu => {
                    menu.classList.remove('menu-opened');
                });
            }
            handleOutsideClick(e);
        });
    };

    // ======================
    // INITIALIZATION
    // ======================
    initializeData();
});