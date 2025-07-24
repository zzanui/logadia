// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { fetchGadiansPage } from '@/api/api'; 

// type Gadian = {
//   ko_name: string
//   level: string
//   vulnerable_properties: string
//   kind: string
//   stage: string
//   items: string[]
//   imageUrl: string
// }
// type GadianContextType = {
//   gadians: Gadian[];
//   setGadians: React.Dispatch<React.SetStateAction<Gadian[]>>;
// };

// const GadianContext = createContext<GadianContextType | undefined>(undefined);

// export const GadianProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [gadians, setGadians] = useState<Gadian[]>([]);
//   // 통신을 한번만 하도록 설정 useEffect를 사용하여 컴포넌트가 마운트될 때 가디언 정보를 가져옵니다.
//   // 콘텍스트를 사용하지 않는것 이 좋을것 같다.(전역으로 관리할 필요가 없을 것 같음) 
//   useEffect(() => {
//     fetchGadiansPage().then(setGadians).catch(console.error);
//   }, []);
//   return (
//     <GadianContext.Provider value={{ gadians, setGadians }}>
//       {children}
//     </GadianContext.Provider>
//   );
// };


// export const useGadianContext = () => {
//   const context = useContext(GadianContext);
//   if (!context) {
//     throw new Error('useGadianContext must be used within a GadianProvider');
//   }
//   return context;
// };