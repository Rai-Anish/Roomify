import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    // auth routes — no navbar
    layout("./routes/auth/layout.tsx", [
        route('/login', "./routes/auth/login.tsx"),
        route('/signup', "./routes/auth/signup.tsx"),
        route('/verify-email', "./routes/auth/verify.tsx"),
        route("auth/callback", "./routes/auth/auth.callback.tsx")
    ]),

    // routes - with no navbar
    route('visualize/:id', "./routes/visualizer.tsx"),

    // main routes — with navbar
    layout("./routes/layout.tsx", [
        index("routes/home.tsx"),
        route('/my-projects', "./routes/my-projects.tsx"),
        route('/profile', "./routes/profile/profile.tsx"),
        route('/pricing',"./routes/pricing.tsx"),
        route('/enterprise',"./routes/enterprise.tsx"),
        route('/terms',"./routes/legal/terms.tsx"),
        route('/cookies',"./routes/legal/cookies.tsx"),
        route('/privacy',"./routes/legal/privacy.tsx"),
    ]),
] satisfies RouteConfig;
