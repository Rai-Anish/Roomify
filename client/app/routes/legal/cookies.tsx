export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                        Legal
                    </span>
                    <h1 className="text-4xl font-serif font-bold text-zinc-900 mt-2 mb-3">
                        Cookie Policy
                    </h1>
                    <p className="text-sm text-zinc-400 font-mono">Last updated: March 24, 2026</p>
                </div>

                <div className="flex flex-col gap-10 text-zinc-600 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">1. What are cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the platform. We use both session cookies (deleted when you close your browser) and persistent cookies (remain until they expire or you delete them).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">2. Cookies we use</h2>
                        <div className="flex flex-col gap-4">
                            {[
                                {
                                    name: "refreshToken",
                                    type: "Essential",
                                    duration: "7 days",
                                    purpose: "Stores your authentication refresh token securely as an httpOnly cookie. Required to keep you logged in across sessions. Cannot be disabled without logging you out.",
                                },
                                {
                                    name: "user-session",
                                    type: "Functional",
                                    duration: "Persistent",
                                    purpose: "Stored in localStorage (not a traditional cookie), this keeps your user preferences and access token in memory so you stay logged in. Cleared when you log out.",
                                },
                                {
                                    name: "Analytics cookies",
                                    type: "Analytics",
                                    duration: "Up to 2 years",
                                    purpose: "Used to understand how visitors interact with the platform, which pages are most visited, and how users navigate. This data is aggregated and anonymized.",
                                },
                            ].map((cookie) => (
                                <div key={cookie.name} className="bg-zinc-50 rounded-xl border border-zinc-100 p-5">
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                        <p className="font-medium text-zinc-900 font-mono text-xs">{cookie.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                cookie.type === "Essential"
                                                    ? "bg-orange-100 text-primary"
                                                    : cookie.type === "Functional"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-zinc-200 text-zinc-600"
                                            }`}>
                                                {cookie.type}
                                            </span>
                                            <span className="text-xs text-zinc-400 font-mono">{cookie.duration}</span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 text-sm">{cookie.purpose}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">3. Third-party cookies</h2>
                        <p className="mb-3">Some features of our platform use third-party services that may set their own cookies:</p>
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-zinc-100">
                            <div>
                                <p className="font-medium text-zinc-800">Google (OAuth & Gemini API)</p>
                                <p>When you use Google Sign-In or Gemini AI rendering, Google may set cookies on your device. These are governed by Google's Cookie Policy.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Cloudinary</p>
                                <p>Our image storage provider may use cookies for CDN optimization and performance. These are functional cookies that help deliver images faster.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">4. Managing cookies</h2>
                        <p className="mb-3">You can control cookies through several methods:</p>
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-zinc-100">
                            <div>
                                <p className="font-medium text-zinc-800">Browser settings</p>
                                <p>Most browsers allow you to view, delete, and block cookies. Refer to your browser's help documentation for instructions. Note that blocking essential cookies will prevent you from staying logged in.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Account logout</p>
                                <p>Logging out of your account clears your session data and removes authentication cookies from your device.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">localStorage</p>
                                <p>You can clear localStorage through your browser's developer tools (Application → Local Storage → Clear). This will log you out of the platform.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">5. Essential cookies</h2>
                        <p>
                            Some cookies are strictly necessary for the platform to function. The <span className="font-mono text-xs bg-zinc-100 px-1.5 py-0.5 rounded">refreshToken</span> cookie cannot be disabled while you are logged in, as it is required to authenticate your requests securely. If you wish to remove it, simply log out of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">6. Do Not Track</h2>
                        <p>
                            Some browsers offer a "Do Not Track" (DNT) signal. Currently, there is no universally accepted standard for responding to DNT signals. We will update this policy if and when a standard is established.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">7. Updates to this policy</h2>
                        <p>
                            We may update this Cookie Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Continued use after changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">8. Contact us</h2>
                        <p>
                            If you have questions about our use of cookies, contact us at{" "}
                            <a href="mailto:privacy@floorplan3d.com" className="text-primary hover:underline">
                                privacy@floorplan3d.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}