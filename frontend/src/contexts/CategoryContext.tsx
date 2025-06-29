import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories } from '@/api/api'; 

type Category = {
        id: number;
        ko_name: string;
        en_name: string;
        image: string;
    };

type CategoryContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  // 통신을 한번만 하도록 설정 useEffect를 사용하여 컴포넌트가 마운트될 때 카테고리를 가져옵니다.
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);
  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};


export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};