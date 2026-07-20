import { useState, useEffect } from 'react';

function App() {
  // 1. LocalStorage'dan ilk verileri çekme
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('my_todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Güncelleme (Edit) Durumları
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // 2. Todos değiştikçe LocalStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('my_todos', JSON.stringify(todos));
  }, [todos]);

  // Ekleme
  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  // Düzenleme Başlatma
  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // Düzenlemeyi Kaydetme (Güncelleme)
  const handleSaveEdit = (id) => {
    if (editingText.trim() !== '') {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editingText.trim() } : todo
        )
      );
    }
    setEditingId(null);
  };

  // Tamamlandı / Tamamlanmadı Değiştirme
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Silme
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filtreleme
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="todo-container">
      <header className="header">
        <h1>Task Tracker</h1>
        <p className="subtitle">Günlük görevlerinizi kolayca yönetin</p>
      </header>

      {/* İstatistikler */}
      <div className="stats-board">
        <div className="stat-card">
          <span className="stat-value">{totalCount}</span>
          <span className="stat-label">Toplam</span>
        </div>
        <div className="stat-card">
          <span className="stat-value active-val">{activeCount}</span>
          <span className="stat-label">Devam Eden</span>
        </div>
        <div className="stat-card">
          <span className="stat-value completed-val">{completedCount}</span>
          <span className="stat-label">Tamamlanan</span>
        </div>
      </div>

      {/* Ekleme Alanı */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Yeni bir görev ekleyin..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button className="add-btn" onClick={handleAddTodo}>
          Ekle
        </button>
      </div>

      {/* Filtreleme */}
      <div className="filter-section">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tümü
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Aktif
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Tamamlanan
        </button>
      </div>

      {/* Liste */}
      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-message">Henüz gösterilecek bir görev yok.</li>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              {editingId === todo.id ? (
                /* Düzenleme Modu */
                <div className="edit-mode-container">
                  <input
                    type="text"
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                  />
                  <button
                    className="save-btn"
                    onClick={() => handleSaveEdit(todo.id)}
                  >
                    Kaydet
                  </button>
                </div>
              ) : (
                /* Normal Görünüm */
                <>
                  <div
                    className="todo-content"
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {}}
                    />
                    <span>{todo.text}</span>
                  </div>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleStartEdit(todo)}
                      title="Görevi Düzenle"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTodo(todo.id)}
                      title="Görevi Sil"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;