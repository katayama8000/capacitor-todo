import { Preferences } from '@capacitor/preferences';
import type { Todo } from './types';

// Key used to persist the todo list. Capacitor Preferences stores this in
// UserDefaults on iOS, SharedPreferences on Android and localStorage on the web.
const STORAGE_KEY = 'todos';

/** Returns true when the given value looks like a stored Todo. */
const isTodo = (value: unknown): value is Todo => {
  if (typeof value !== 'object' || value === null) return false;
  const todo = value as Record<string, unknown>;
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.done === 'boolean' &&
    typeof todo.createdAt === 'number'
  );
};

/** Loads the saved todos. Returns an empty list if nothing valid is stored. */
export const loadTodos = async (): Promise<Todo[]> => {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
  } catch {
    // The stored value is corrupted, so start over rather than crashing.
    return [];
  }
};

/** Persists the whole todo list. */
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(todos) });
};
