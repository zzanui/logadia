// const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = 'http://localhost:8000';

// 헤더에 들어갈 카테고리를 API로부터 받아오는 로직
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const cateResult = await response.json();
        return cateResult;
    } 
    catch (error) {
        console.error('Error fetching categories:', error);
    }
}
        

// 가디언리스트를 API로부터 받아오는 로직
export const fetchGadian = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gadian/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const gadianResult = await response.json();
        return gadianResult;
    } 
    catch (error) {
        console.error('Error fetching gadian:', error);
    }
}