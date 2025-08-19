
import Footer from "components/public/Footer";
import Navbar from "components/public/Navbar";
import React from "react";

const Public = ({ children }) => {
    return (
        <div>
            <Navbar/>
            <main className="pt-20">{children}</main>
            <Footer />
        </div>
    );
};

export default Public;
