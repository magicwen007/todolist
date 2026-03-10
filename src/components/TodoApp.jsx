import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './TodoApp.css';

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 * @property {number} createdAt
 */

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addTodo = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo = {
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }

    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: trimmed } : todo
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const incompleteCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Todo List</h1>

        <div className="input-section">
          <input
            type="text"
            className="todo-input"
            placeholder="添加新的待办事项..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="add-btn" onClick={addTodo}>
            添加
          </button>
        </div>

        <div className="stats">
          <span>待办: {incompleteCount}</span>
          <span>已完成: {completedCount}</span>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    autoFocus
                  />
                  <button className="save-btn" onClick={saveEdit}>保存</button>
                  <button className="cancel-btn" onClick={cancelEdit}>取消</button>
                </div>
              ) : (
                <>
                  <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <div className="todo-actions">
                    <button className="edit-btn" onClick={() => startEdit(todo)}>编辑</button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>删除</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty-message">暂无待办事项，添加一个吧！</p>
        )}
      </div>
    </div>
  );
}

export default App;
