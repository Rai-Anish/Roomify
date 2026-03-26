export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
                        Legal
                    </span>
                    <h1 className="text-4xl font-serif font-bold text-zinc-900 mt-2 mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-zinc-400 font-mono">Last updated: March 24, 2026</p>
                </div>

                <div className="flex flex-col gap-10 text-zinc-600 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">1. Acceptance of terms</h2>
                        <p>
                            By accessing or using FloorPlan3D ("the platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">2. Use of the platform</h2>
                        <p className="mb-3">You agree to use FloorPlan3D only for lawful purposes. You must not:</p>
                        <ul className="flex flex-col gap-2 pl-4">
                            {[
                                "Upload content that infringes on intellectual property rights",
                                "Attempt to reverse engineer or extract our AI models",
                                "Use the platform to generate misleading or deceptive content",
                                "Share your account credentials with others",
                                "Use automated scripts to abuse the rendering pipeline",
                                "Upload illegal, harmful, or offensive content",
                                "Attempt to gain unauthorized access to other users' projects",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 mt-1.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">3. Account registration</h2>
                        <p>
                            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must immediately notify us of any unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">4. Intellectual property</h2>
                        <div className="flex flex-col gap-3 pl-4 border-l-2 border-zinc-100">
                            <div>
                                <p className="font-medium text-zinc-800">Your content</p>
                                <p>You retain ownership of all floor plan images you upload. By uploading content, you grant us a limited, non-exclusive license to process and store your content for the purpose of providing the service.</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Generated renders</p>
                                <p>AI-generated renders produced from your floor plans are yours to use commercially, subject to the terms of the AI model providers (Google Gemini, Stable Diffusion).</p>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-800">Platform content</p>
                                <p>All platform content, including our software, design, and branding, is owned by FloorPlan3D and protected by intellectual property laws. You may not copy, reproduce, or distribute any part of the platform without our written consent.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">5. Subscription and billing</h2>
                        <p className="mb-3">
                            Paid plans are billed in advance on a monthly or annual basis. By subscribing, you authorize us to charge your payment method on a recurring basis. You may cancel your subscription at any time from your account settings.
                        </p>
                        <p>
                            Refunds are provided on a case-by-case basis. If you believe you are entitled to a refund, contact us at billing@floorplan3d.com within 14 days of the charge.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">6. Service availability</h2>
                        <p>
                            We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the platform. We may perform scheduled maintenance, which we will communicate in advance. We are not liable for any losses resulting from platform downtime or unavailability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">7. Disclaimer of warranties</h2>
                        <p>
                            The platform is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the platform will be error-free, that defects will be corrected, or that AI-generated renders will meet your specific requirements or expectations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">8. Limitation of liability</h2>
                        <p>
                            To the maximum extent permitted by law, FloorPlan3D shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">9. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at any time for violations of these Terms. You may delete your account at any time from your profile settings. Upon termination, your right to use the platform ceases immediately and your data will be deleted in accordance with our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">10. Governing law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be resolved through binding arbitration, except where prohibited by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">11. Changes to terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. Material changes will be communicated via email or platform notice at least 30 days before taking effect. Continued use of the platform after changes constitutes acceptance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-3">12. Contact</h2>
                        <p>
                            For questions about these Terms, contact us at{" "}
                            <a href="mailto:legal@floorplan3d.com" className="text-primary hover:underline">
                                legal@floorplan3d.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}