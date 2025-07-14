interface CardProps {
  ko_name: string
  level: string
  vulnerable_properties: string
  kind: string
  stage: string
  items: string[]
  image: string
}

const GadianCard: React.FC<CardProps> = (props) => {
    const {
        ko_name,
        level,
        vulnerable_properties,
        kind,
        stage,
        items=[],
        image
    } = props

   return (
  <div className="max-w-4xl w-full flex bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
    {/* Left image section */}
    <div
      className="w-48 h-auto flex-none bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
      title={ko_name}
    ></div>

    {/* Middle content section */}
    <div className="p-4 flex-grow flex flex-col justify-between leading-normal">
      <div>
        <div className="text-gray-900 font-bold text-xl mb-1">{ko_name}</div>
        <p className="text-gray-700 text-sm mb-1">{kind}: {stage}</p>
        <p className="text-gray-700 text-sm mb-1">레벨: {level}</p>
        <p className="text-gray-700 text-sm mb-1">약점 속성: {vulnerable_properties}</p>
      </div>
    </div>

    {/* Right content section */}
    <div className="p-4 w-64 flex-shrink-0 border-l border-gray-200">
      <p className="text-sm font-semibold text-gray-800 mb-1">보상 아이템</p>
      <ul className="list-disc list-inside text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);
}

export default GadianCard
