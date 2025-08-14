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
        return cateResult.results;
    } 
    catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
        

// 활성화 되어있는 가디언리스트를 API로부터 id의 역순으로 받아오는 로직 정렬:(?ordering=-id) //1002
export const fetchGadiansPage = async (categoryId: number ,page: number): Promise<{
  results: any[],
  next: string | null
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents/?category_id=${categoryId}&page=${page}&ordering=-id`);
    if (!response.ok) {
      throw new Error('Network response was not ok : 1002');
    }
    const gadianResult = await response.json();
    return gadianResult;
  } 
  catch (error) {
    console.error('Error fetching gadian:', error);
    return {
      results: [],   // ✅ results는 항상 배열
      next: null     // ✅ next는 기본값 null
    };
  }
}

// 가디언id를 통해 가디언보상, 골드가치를 받아오는 로직 //1003
export const fetchGadianRewards = async (gadianId: number)=>{
    try {
        const response = await fetch(`${API_BASE_URL}/api/prices/?content_id=${gadianId}`);
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


// 검색한 아이템을 API로부터 받아오는 로직 //1004 #여차의 경우 페이지 추가
export const searchItemAverage = async (itemName: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/search/?search_keyword=${encodeURIComponent(itemName)}`);
        if (!response.ok) {
            throw new Error('검색실패:1004');
        }
        const itemResult = await response.json();
        return itemResult;
    } catch (error) {
        console.error(`Error searching items 1004 : ${itemName}:`, error);
        return [];
    }
}

// 아이템 검색 시 자동완성 기능을 위한 API 호출 로직 //1005
export const fetchItemSuggestions = async (keyword: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/autocomplete/?item_keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      throw new Error('검색실패:1005');
    }
    const itemResult = await response.json();
    return itemResult; // [{ ko_name, image }]
  } catch (error) {
    console.error(`Error searching items 1005 : ${keyword}:`, error);
    return [];
  }
}

