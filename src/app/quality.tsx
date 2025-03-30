export default function Quality(title: string, value: number) {
  return (
    <div>
      <h2 className="text-lg text-gray-700 font-bold">{title}</h2>
      <div className="flex flex-row items-center justify-between mt-2 mb-4">
        <div className="relative w-14 h-44">
          <div className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full">
            <div className="bg-red-500 w-2/4 h-6 rounded-t-2xl border-black border-solid border-2 border-b-0"></div>
            <div className="bg-orange-500 w-2/4 h-4 border-black border-solid border-2 border-b-0"></div>
            <div className="bg-yellow-500 w-2/4 h-4 border-black border-solid border-2 border-b-0"></div>
            <div className="bg-green-500 w-2/4 h-4 border-black border-solid border-2 border-b-0"></div>
          </div>
          <div className="bg-teal-600 w-full aspect-square rounded-full absolute bottom-0 border-black border-solid border-2"></div>
        </div>
        <div className="bg-black text-white font-bold size-14 flex items-center justify-center rounded-full shadow-lg text-2xl">
          {value}
        </div>
      </div>
    </div>
  );
}