import UserPagination from "components/common/UserPagination";
import Filters from "components/public/spaces/Filters";
import PropertyList from "components/public/spaces/PropertyList";
import SearchBar from "components/public/SearchBar";
import { useEffect, useState } from "react";
import axios from 'axios';
import Loader from "components/common/Loader";

export default function Spaces() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [page, setPage] = useState(1);
    const [spaces, setSpaces] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        minValue: 0,
        maxValue: 100000,
        priceType: "",
        minSize: "",
        maxSize: "",
        furnishing: "all",
        smoking: "all",
        propertyType: "all",
        roomAvailable: "any",
        bedrooms: "Any",
        moveInDate: "",
    });
const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const params = {
                    page,
                    limit: itemsPerPage,
                    ...filters,
                };

                Object.keys(params).forEach((key) => {
                    if (
                        params[key] === "all" ||
                        params[key] === "any" ||
                        params[key] === "" ||
                        params[key] === 0
                    ) {
                        delete params[key];
                    }
                });

                const { data } = await axios.get(`${apiUrl}spaces`, { params });
                setSpaces(data.data);
                setTotalPages(data.pages);
                  } catch (err) {
        console.error("Failed to fetch spaces:", err);
        setSpaces([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [page, filters]);

    return (
        <div className="container px-4 mt-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 space-y-4">
                <SearchBar />
                <Filters filters={filters} setFilters={setFilters} setPage={setPage} />
            </div>

<div className="col-span-3">
        {loading ? (
          <Loader fullScreen={false} />
        ) : spaces.length > 0 ? (
          <>
            <PropertyList properties={spaces} page={page} itemsPerPage={itemsPerPage} />
            <div className="text-end flex justify-end mt-5">
              <UserPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">
            No Spaces Found
          </div>
        )}
      </div>
        </div>
    );
}