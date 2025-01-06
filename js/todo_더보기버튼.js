const API_BASE_URL = 'http://172.30.1.36:8000';

// Axios 기본 설정
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isExpanded = false; // 펼침 상태를 관리하는 변수

// Todo 목록 조회
async function fetchTodos() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/todos/`);
        const todoList = document.getElementById('todoList');
        const toggleButtonContainer = document.getElementById('toggleButtonContainer');

        // 할 일 목록이 5개를 초과하는지 확인
        if (response.data.length > 5) {
            toggleButtonContainer.classList.remove('hidden'); // 버튼 표시
        } else {
            toggleButtonContainer.classList.add('hidden'); // 버튼 숨기기
        }

        // 할 일 목록 렌더링
        const visibleTodos = isExpanded ? response.data : response.data.slice(0, 5);
        todoList.innerHTML = visibleTodos.map(todo => `
            <div class="todo-item">
                <input type="checkbox"
                       ${todo.is_completed ? 'checked' : ''}
                       onchange="toggleTodo(${todo.id}, this.checked)">
                <span>${todo.title}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 401) {
            // 토큰이 만료된 경우
            window.location.href = 'login.html';
        }
    }
}

// 접기/펴기 버튼 클릭 이벤트
function toggleExpand() {
    isExpanded = !isExpanded; // 상태 토글
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.textContent = isExpanded ? '접기' : '더 보기';
    fetchTodos(); // 목록 다시 렌더링
}

// 페이지 로드 시 Todo 목록 조회
document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();

    // 접기/펴기 버튼 이벤트 설정
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleExpand);
    }
});

