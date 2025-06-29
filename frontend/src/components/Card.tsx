// src/components/Card.tsx

import React from 'react'

interface CardProps {
  title: string
  description: string
  imageUrl: string
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="relative flex w-96 flex-col rounded-xl bg-white text-gray-700 shadow-md">
      <div className="relative mx-4 -mt-6 h-56 overflow-hidden rounded-xl bg-blue-gray-500 text-white shadow-lg">
        <img
          src={imageUrl}
          alt="img-blur-shadow"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h5 className="mb-2 text-xl font-semibold">{title}</h5>
        <p className="text-base font-light leading-relaxed">{description}</p>
      </div>
      <div className="p-6 pt-0">
        <button
          className="rounded-lg bg-pink-500 py-3 px-6 text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg"
          type="button"
          data-ripple-light="true"
        >
          Read More
        </button>
      </div>
    </div>
  )
}

export default Card
