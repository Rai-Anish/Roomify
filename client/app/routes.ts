import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    // auth routes — no navbar
    layout("./routes/auth/layout.tsx", [
        route('/login', "./routes/auth/login.tsx"),
        route('/signup', "./routes/auth/signup.tsx"),
        route('/verify-email', "./routes/auth/verify.tsx"),
        route("auth/callback", "./routes/auth/auth.callback.tsx")
    ]),

    // main routes — with navbar
    layout("./routes/layout.tsx", [
        index("routes/home.tsx"),
        route('/my-projects', "routes/my-projects.tsx"),
        route('visualize/:id', "./routes/visualizer.$id.tsx"),
    ]),
] satisfies RouteConfig;
