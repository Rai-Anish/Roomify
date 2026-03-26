import { Outlet } from "react-router";
import Navbar from "~/components/navbar/Navbar";
import { Footer } from "~/components/Footer";

export default function MainLayout() {
    return (
        <div>
            <Navbar />
                <Outlet />
            <Footer />
        </div>
    );
}