document.addEventListener('DOMContentLoaded', () => {
    //  DOM
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const todosUL = document.getElementById('todos');
    const filterButtons = document.querySelectorAll('.filter-btn');
  
    // Variáveis de estado
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
  
    // Inicialização
    function init() {
      renderTodos();
      setupEventListeners();
    }
  
    // Renderiza das tarefas
    function renderTodos() {
      todosUL.innerHTML = '';
  
      const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'completed') return todo.completed;
        if (currentFilter === 'pending') return !todo.completed;
      });
  
      filteredTodos.forEach(todo => {
        const todoEl = createTodoElement(todo);
        todosUL.appendChild(todoEl);
      });
    }
  

    function createTodoElement(todo) {
      const todoEl = document.createElement('li');
      todoEl.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      todoEl.dataset.id = todo.id;
  
      todoEl.innerHTML = `
        <span class="todo-text">${todo.text}</span>
        <div class="actions">
          <span class="edit-btn">✏️</span>
          <span class="delete-btn">🗑️</span>
        </div>
      `;
  
      // Event listeners para interações
      todoEl.addEventListener('click', toggleComplete);
      todoEl.querySelector('.edit-btn').addEventListener('click', editTodo);
      todoEl.querySelector('.delete-btn').addEventListener('click', deleteTodo);
      todoEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        deleteTodo(e);
      });
  
      return todoEl;
    }
  
    // Adiciona nova tarefa
    function addTodo(e) {
      e.preventDefault();
      
      const text = input.value.trim();
      if (!text) return;
  
      const newTodo = {
        id: Date.now(),
        text,
        completed: false
      };
  
      todos.push(newTodo);
      input.value = '';
      updateAndRender();
    }
  
    function toggleComplete(e) {
      if (e.target.classList.contains('actions') || 
          e.target.classList.contains('edit-btn') || 
          e.target.classList.contains('delete-btn')) {
        return;
      }
  
      const todoEl = e.currentTarget;
      const id = Number(todoEl.dataset.id);
      const todo = todos.find(t => t.id === id);
  
      if (todo) {
        todo.completed = !todo.completed;
        updateAndRender();
      }
    }
  
    
    function editTodo(e) {
      e.stopPropagation();
      const todoEl = e.target.closest('.todo-item');
      const id = Number(todoEl.dataset.id);
      const todo = todos.find(t => t.id === id);
      const newText = prompt('Editar tarefa:', todo.text);
  
      if (newText && newText.trim() !== '') {
        todo.text = newText.trim();
        updateAndRender();
      }
    }
  
    
    function deleteTodo(e) {
      e.stopPropagation();
      const todoEl = e.target.closest('.todo-item');
      const id = Number(todoEl.dataset.id);
  
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        todos = todos.filter(t => t.id !== id);
        updateAndRender();
      }
    }
  

    function applyFilter(e) {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderTodos();
    }
  

    function updateAndRender() {
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    }
  
    // Configura event listeners
    function setupEventListeners() {
      form.addEventListener('submit', addTodo);
      filterButtons.forEach(btn => {
        btn.addEventListener('click', applyFilter);
      });
      
      // Drag and drop
      new Sortable(todosUL, {
        animation: 150,
        onEnd: () => {
          const newOrder = Array.from(todosUL.children).map(el => 
            Number(el.dataset.id)
          );
          todos = newOrder.map(id => todos.find(t => t.id === id));
          updateAndRender();
        }
      });
    }
  
    // Inicia o app
    init();
  });