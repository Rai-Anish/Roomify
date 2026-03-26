export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                        Legal
                    </span>
                    <h1 className="text-4xl font-serif font-bold text-zinc-900 mt-2 mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-zinc-400 font-mono">Last updated: March 24, 2026</p>
                </div>

                <div className="flex flex-col gap-10 text-zinc-600 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">1. Introduction</h2>
                        <p>
                            FloorPlan3D ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. If you disagree with its terms, please discontinue use of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">2. Information we collect</h2>
                        <p className="mb-3">We collect information in the following ways:</p>
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-zinc-100">
                            <div>
                                <p className="font-medium text-zinc-800">Account information</p>
                                <p>When you register, we collect your name, email address, username, and password. If you sign in via Google OAuth, we receive your name, email, and profile picture from Google.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">User content</p>
                                <p>Floor plan images you upload are processed by our AI rendering pipeline and stored on Cloudinary, our cloud storage provider. Generated renders are also stored and associated with your account.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Usage data</p>
                                <p>We collect information about how you interact with our platform, including pages visited, features used, and actions taken, to improve our service.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Device information</p>
                                <p>We may collect your IP address, browser type, operating system, and device identifiers for security and analytics purposes.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">3. How we use your information</h2>
                        <p className="mb-3">We use the information we collect to:</p>
                        <ul className="flex flex-col gap-2 pl-4">
                            {[
                                "Create and manage your account",
                                "Process and render your floor plan images",
                                "Send verification and transactional emails",
                                "Improve and personalize your experience",
                                "Monitor platform usage and prevent abuse",
                                "Comply with legal obligations",
                                "Communicate product updates and changes",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 mt-1.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">4. Data sharing and disclosure</h2>
                        <p className="mb-3">We do not sell your personal data. We may share your information with:</p>
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-zinc-100">
                            <div>
                                <p className="font-medium text-zinc-800">Service providers</p>
                                <p>Third-party vendors that help us operate our platform, including Cloudinary (image storage), Resend (email delivery), and Google (OAuth authentication). These providers are bound by confidentiality obligations.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">AI providers</p>
                                <p>When you use Gemini AI rendering, your floor plan image is sent to Google's Gemini API for processing. Please refer to Google's privacy policy for how they handle this data.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Legal requirements</p>
                                <p>We may disclose your information if required by law, court order, or governmental authority.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">5. Data retention</h2>
                        <p>
                            We retain your personal data for as long as your account is active. If you delete your account, we permanently delete your personal information and all associated projects within 30 days, except where required to retain data by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">6. Your rights</h2>
                        <p className="mb-3">Depending on your location, you may have the following rights:</p>
                        <ul className="flex flex-col gap-2 pl-4">
                            {[
                                "Access and receive a copy of your personal data",
                                "Correct inaccurate or incomplete data",
                                "Request deletion of your personal data",
                                "Object to or restrict processing of your data",
                                "Data portability — receive your data in a machine-readable format",
                                "Withdraw consent at any time where processing is based on consent",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 mt-1.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-3">To exercise these rights, contact us at privacy@floorplan3d.com.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">7. Security</h2>
                        <p>
                            We implement industry-standard security measures including encrypted data transmission (HTTPS), bcrypt password hashing, JWT-based authentication with short-lived access tokens, and httpOnly cookie storage for refresh tokens. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">8. Children's privacy</h2>
                        <p>
                            FloorPlan3D is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">9. Changes to this policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our platform. Your continued use of the platform after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">10. Contact us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at{" "}
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