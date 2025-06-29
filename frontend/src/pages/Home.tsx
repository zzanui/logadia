import { useCategoryContext } from '@/contexts/CategoryContext';
import Card from '@/components/Card'

const Home: React.FC = () => {
  const { categories } = useCategoryContext()

  const cardData = categories.map((category) => ({
  title: category.ko_name,
  description: '카테고리에 대한 설명을 여기에 넣을 수 있어요.',
  // 실제 이미지로 변경
  imageUrl: category.image,
}));

  return (
    <main className="px-4 py-8 flex flex-wrap justify-center gap-8">
      {cardData.map((card, idx) => (
        <Card key={idx} {...card} />
      ))}
    </main>
  )
}

export default Home
