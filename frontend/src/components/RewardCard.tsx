import React from 'react'

type RewardCardProps = {
  name: string
  image?: string
  count: number
  price: number
  checked: boolean
  onCheck: () => void
}

const RewardCard: React.FC<RewardCardProps> = ({ name, image, count, price, checked, onCheck }) => {
  return (
    <label className="flex items-center gap-2 border rounded-md px-2 py-1 shadow-sm bg-gray-50 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onCheck} className="form-checkbox" />
      {image && <img src={image} alt={name} className="w-8 h-8 object-cover rounded" />}
      <div className="text-sm text-gray-800">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-600">
          {count}개 | 예상가 {price.toLocaleString()}G
        </div>
      </div>
    </label>
  )
}

export default RewardCard
