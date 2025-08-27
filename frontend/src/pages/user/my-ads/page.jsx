import UserPagination from "components/common/UserPagination";
import Filters from "components/user/myads/Filters";
import PropertyList from "components/user/myads/PropertyList";
import SearchBar from "components/user/myads/SearchBar";
import { useState } from "react";
import myAds1 from "../../../assets/img/ghouraf/myads1.jpg";
import agent1 from "../../../assets/img/ghouraf/agent1.jpg";

export default function MyAds(){
      const [page, setPage] = useState(1);

    const properties = [
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2100,
            image: `${myAds1}`,
            user: { name: "Victor", role: "Landlord", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 980,
            image: `${myAds1}`,
            user: { name: "Jhon", role: "Current Flatmate", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 900,
            image: `${myAds1}`,
            user: { name: "Panther", role: "Landlord", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Landlord", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
        {
            title: "1bed/1bath fully furnished UES",
            location: "New York, USA",
            type: "1 bed apartment",
            available: "8 July",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${myAds1}`,
            user: { name: "Alexander", role: "Agent", avatar: `${agent1}` }
        },
    ];

      const itemsPerPage = 10;
  const totalPages = Math.ceil(properties.length / itemsPerPage);
    return(
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="col-span-1 space-y-4">
        <SearchBar />
        <Filters />
      </div>

      <div className="col-span-3">
         <PropertyList
          properties={properties}
          page={page}
          itemsPerPage={itemsPerPage}
        />
        <div className="text-end flex justify-end mt-5">
        <UserPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        </div>
      </div>
    </div>
    );
}