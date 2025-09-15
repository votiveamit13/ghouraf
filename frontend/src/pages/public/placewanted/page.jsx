import UserPagination from "components/common/UserPagination";
import Filters from "components/public/place_wanted/Filters";
import PropertyList from "components/public/place_wanted/PropertyList";
import { useState } from "react";
import agent1 from "../../../assets/img/ghouraf/agent1.jpg";
import person1 from "../../../assets/img/ghouraf/person1.jpg";
import person2 from "../../../assets/img/ghouraf/person2.jpg";
import person3 from "../../../assets/img/ghouraf/person3.jpg";
import person4 from "../../../assets/img/ghouraf/person4.jpg";
import person5 from "../../../assets/img/ghouraf/person5.jpg";
import person6 from "../../../assets/img/ghouraf/person6.jpg";
import person7 from "../../../assets/img/ghouraf/person7.jpg";

export default function PlaceWanted() {
    const [page, setPage] = useState(1);

    const properties = [
        {
            title: "Room Wanted",
            location: "New York, USA",
            type: "1 bed room",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person1}`,
            user: { name: "Alexander", role: "Professor", avatar: `${agent1}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2100,
            image: `${person3}`,
            user: { name: "Victor", role: "Student", avatar: `${person3}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person2}`,
            user: { name: "See Song", role: "Engineer", avatar: `${person2}` }
        },
        {
            title: "Room Wanted",
            location: "New York, USA",
            type: "1 bed room",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person4}`,
            user: { name: "Alexander", role: "Professor", avatar: `${person4}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2100,
            image: `${person5}`,
            user: { name: "Victor", role: "Trainer", avatar: `${person5}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person6}`,
            user: { name: "See Song", role: "Agent", avatar: `${person6}` }
        },
        {
            title: "Room Wanted",
            location: "New York, USA",
            type: "1 bed room",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person7}`,
            user: { name: "Alexander", role: "Professor", avatar: `${person7}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2100,
            image: `${person3}`,
            user: { name: "Victor", role: "Landlord", avatar: `${person3}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person2}`,
            user: { name: "See Song", role: "Agent", avatar: `${person2}` }
        },
        {
            title: "Room Wanted",
            location: "New York, USA",
            type: "1 bed room",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person1}`,
            user: { name: "Alexander", role: "Professor", avatar: `${person1}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2100,
            image: `${person3}`,
            user: { name: "Victor", role: "Landlord", avatar: `${person3}` }
        },
        {
            title: "Apartment Wanted",
            location: "New York, USA",
            type: "1 bed apartment",
            description: "Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.",
            price: 2300,
            image: `${person2}`,
            user: { name: "See Song", role: "Agent", avatar: `${person2}` }
        },
    ];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    return (
        <div className="container px-4 mt-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 space-y-4">
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