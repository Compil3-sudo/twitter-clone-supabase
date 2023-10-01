import React from "react";

const MainHeader = () => {
  return (
    <div className="top-0 sticky flex border-b w-full backdrop-filter backdrop-blur-md bg-opacity-70 bg-slate-950">
      <div className="flex flex-col w-full">
        <h1 className="text-lg p-4 font-bold">Home</h1>
        <div className="flex flex-row">
          <div className="w-1/2 flex justify-center hover:bg-white/10">
            <button className="border-blue-500 border-b-4 py-4">For You</button>
          </div>
          <div className="w-1/2 flex justify-center hover:bg-white/10">
            <button className="hover:border-blue-500 border-transparent border-b-4 py-4">
              Following
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
