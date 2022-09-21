const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const bAdd = document.getElementById('bAdd');
const itTask = document.getElementById('itTask');
const form = document.getElementById('form');
const taskName = document.getElementById('taskName');

renderTime();
renderTasks();

form.addEventListener('submit', e => {
    e.preventDefault();
    if(itTask.value != ''){
        createTasks(itTask.value);
        itTask.value = '';
        renderTasks();
    }
})

function createTasks(value){
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value, 
        completed:false
    };

    tasks.unshift(newTask)
}

function renderTasks(){
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Completado</span>`: `<button class="start" data-id="${task.id}">Empezar</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `
    });

    const taskContainer = document.getElementById('tasks');
    taskContainer.innerHTML = html.join(' ');

    const startButton = document.getElementsByClassName('start');

    Array.from(startButton).forEach(button => {
        button.addEventListener('click', e => {
            if(!timer){
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent = "En progreso..."
            }
        })
    })
}

function startButtonHandler(id){
    time = 25 * 60;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id == id);
    taskName.textContent = tasks[taskIndex].title;
    renderTime();

    timer = setInterval(() => {
        timeHandler(id);
    }, 1000);
}

function timeHandler(id){
    time --;
    renderTime();

    if(time === 0){
        clearInterval(timer);
        // current = null
        // taskName.textContent = ''; cuando termine con el break vuelvo
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function startBreak(){
    time = 5 * 60;
    taskName.textContent = 'Pausa';
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler(){
    time --;
    renderTime();

    if(time === 0){
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = '';
        renderTasks();
    }

}

function renderTime(){
    const timeDiv = document.getElementById('value');
    const minutos = parseInt(time / 60);
    const segundos =  parseInt(time % 60)

    timeDiv.textContent = `${minutos < 10 ? '0': ''}${minutos}:${segundos < 10 ? '0': ''}${segundos}`;
}

function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id == id);
    tasks[taskIndex].completed = true;
}