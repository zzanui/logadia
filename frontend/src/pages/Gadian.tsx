import React, { useEffect, useState } from 'react';
import { fetchGadian } from '@/api/api'; 

import Card from '@/components/Card'

const Gadian: React.FC = () => {

  const [gadiansData, setGadiansData] = useState([]);
  useEffect(() => {
    fetchGadian().then(setGadiansData).catch(console.error);
  }, []);

  // 가디언 전용 카드를 만들어야 됨
  // const cardData = gadiansData.map((gadian) => ({
  //   title: gadian.ko_name,
  //   description: gadian.description || '가디언에 대한 설명을 여기에 넣을 수 있어요.',
  //   imageUrl: gadian.image || 'https://via.placeholder.com/150', // 기본 이미지 URL
  // }));

  return (
      <main className="px-4 py-8 flex flex-wrap justify-center gap-8">
          <p>가디언 페이지</p>
        {/* {gadiansData.map((card, idx) => ( */}
          {/* // <Card key={idx} {...card} /> */}
        {/* ))} */}
      </main>
    )
  }

export default Gadian
