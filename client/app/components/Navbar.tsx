import { Box } from "lucide-react"
import { Button } from "./ui/Button"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "~/store/authStore"

const Navbar = () => {
    const navigate = useNavigate()

    const { user, _hasHydrated } = useAuthStore();
    const logoutAction = useAuthStore((state) => state.logout);

    const isSignedIn = !!user;
    if (!_hasHydrated) {
        return <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />; 
        }   
return (
    <header className="navbar">
        <nav className="inner">
            <div className="left">
                <div className="brand">
                    <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="name">FloorPlan3D</span>
                </div>

                <div className="links">
                    <a href="#">Products</a>
                    <a href="#">Pricing</a>
                    <a href="#">Community</a>
                    <a href="#">Enterprise</a>
                </div>               
            </div>

            <div className="actions">
                    {
                        isSignedIn ? (
                            <>
                                
                                    {
                                        user.avatar ? (
                                            <img src={user.avatar}  alt={user.username} className="w-9 h-9 rounded-full"/>
                                        ) :
                                        <span className="capitalize">Hi, {user.username} </span>
                                    }
                                
                                <Button className="user-name" onClick={logoutAction}>Logout</Button>
                            </>
                        ) : (
                            <Button variant="default" onClick={()=>navigate('/login')}>
                                Log In
                            </Button>
                        )
                    }
                </div>
        </nav>
    </header>
)
}

export default Navbar