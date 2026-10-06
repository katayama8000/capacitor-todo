import './style.css';
import { loadTodos, saveTodos } from './storage';
import type { Todo } from './types';

const form = document.querySelector<HTMLFormElement>('#new-todo-form')!;
const input = document.querySelector<HTMLInputElement>('#new-todo-input')!;
const list = document.querySelector<HTMLUListElement>('#todo-list')!;
const summary = document.querySelector<HTMLParagraphElement>('#summary')!;
const emptyState = document.querySelector<HTMLParagraphElement>('#empty-state')!;

// Single source of truth for the UI. Every mutation goes through `update()`.
let todos: Todo[] = [];

/** Creates an id that is unique enough for a local-only todo list. */
const createId = (): string =>
  // `crypto.randomUUID` is available in modern WebViews; fall back just in case.
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** Renders the current state into the DOM. */
const render = (): void => {
  list.replaceChildren(
    ...todos.map((todo) => {
      const item = document.createElement('li');
      item.className = todo.done ? 'todo-item done' : 'todo-item';
      item.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.done;
      checkbox.setAttribute('aria-label', `Mark "${todo.title}" as done`);
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      const title = document.createElement('span');
      title.className = 'todo-title';
      // Use textContent so user input is never interpreted as HTML.
      title.textContent = todo.title;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Delete "${todo.title}"`);
      remove.addEventListener('click', () => deleteTodo(todo.id));

      item.append(checkbox, title, remove);
      return item;
    }),
  );

  const remaining = todos.filter((todo) => !todo.done).length;
  summary.textContent =
    todos.length === 0 ? '' : `${remaining} of ${todos.length} remaining`;
  emptyState.hidden = todos.length > 0;
};

/** Applies a change to the list, then re-renders and persists it. */
const update = (next: Todo[]): void => {
  todos = next;
  render();
  // Saving is fire-and-forget so the UI stays responsive.
  void saveTodos(todos);
};

const addTodo = (rawTitle: string): void => {
  const title = rawTitle.trim();
  if (title === '') return;

  const todo: Todo = {
    id: createId(),
    title,
    done: false,
    createdAt: Date.now(),
  };
  // Newest todos appear at the top of the list.
  update([todo, ...todos]);
};

const toggleTodo = (id: string): void => {
  update(
    todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
  );
};

const deleteTodo = (id: string): void => {
  update(todos.filter((todo) => todo.id !== id));
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

/** Loads persisted todos and draws the first frame. */
const start = async (): Promise<void> => {
  todos = await loadTodos();
  render();
};

void start();
