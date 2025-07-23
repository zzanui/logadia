// const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = 'http://localhost:8000';

// 헤더에 들어갈 카테고리를 API로부터 받아오는 로직 //1001
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/`);
        if (!response.ok) {
            throw new Error('Network response was not ok : 1001');
        }
        const cateResult = await response.json();
        return cateResult;
    } 
    catch (error) {
        console.error('Error fetching categories:', error);
    }
}
        

// 활성화 되어있는 가디언리스트를 API로부터 id의 역순으로 받아오는 로직(?ordering=-id) //1002
export const fetchGadian = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gadians/?ordering=-id&search=true`);
        if (!response.ok) {
            throw new Error('Network response was not ok : 1002');
        }
        const gadianResult = await response.json();
        return gadianResult;
    } 
    catch (error) {
        console.error('Error fetching gadian:', error);
        return [];
    }
}

// 가디언id를 통해 가디언보상, 골드가치를 받아오는 로직 //1003
export const fetchGadianRewards = async (gadianId: number)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/api/prices/?gadian_id=${gadianId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok : 1003');
        }
        const gadianRewardResult = await response.json();
        return gadianRewardResult;
    } catch (error) {
        console.error(`Error fetching rewards for gadian ${gadianId}:`, error);
        return [];
    }
}