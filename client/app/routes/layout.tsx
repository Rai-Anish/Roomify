import { Outlet } from "react-router";
import Navbar from "~/components/navbar/Navbar";

export default function MainLayout() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}