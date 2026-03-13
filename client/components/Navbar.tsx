    import { Box } from "lucide-react"
    import { Button } from "./ui/Button"

    const Navbar = () => {
        const isSignedIn = false
        const userName = "Anish"

        const handleAuthClick = () => {
            // Implement your authentication logic here
            console.log("Log In button clicked");
        }
        
    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className="logo" />
                        <span className="name">RoomMod</span>
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
                                    <span>Hi {userName}</span>
                                    <Button className="user-name" onClick={handleAuthClick}>Logout</Button>
                                </>
                            ) : (
                                <Button variant="default" onClick={handleAuthClick}>
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