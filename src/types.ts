/** A single todo item. */
export type Todo = {
  /** Unique identifier, generated when the todo is created. */
  id: string;
  /** Text the user typed. */
  title: string;
  /** Whether the todo has been completed. */
  done: boolean;
  /** Creation time as a Unix timestamp in milliseconds. */
  createdAt: number;
};
