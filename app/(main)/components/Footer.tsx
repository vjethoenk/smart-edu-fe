import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Smart-<span className="text-blue-600 dark:text-blue-500">Edu</span>
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Nền tảng học tập thông minh, kết hợp công nghệ AI và phương pháp
                            giáo dục hiện đại, giúp học viên phát triển toàn diện.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <SocialLink href="#" icon="facebook" />
                            <SocialLink href="#" icon="twitter" />
                            <SocialLink href="#" icon="youtube" />
                            <SocialLink href="#" icon="linkedin" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <FooterColumn
                        title="Khám phá"
                        links={[
                            { label: "Giới thiệu", href: "#" },
                            { label: "Chương trình học", href: "#" },
                            { label: "Khóa học nổi bật", href: "#" },
                            { label: "Lộ trình học tập", href: "#" },
                        ]}
                    />

                    {/* Support */}
                    <FooterColumn
                        title="Hỗ trợ"
                        links={[
                            { label: "Trung tâm trợ giúp", href: "#" },
                            { label: "Câu hỏi thường gặp", href: "#" },
                            { label: "Chính sách bảo mật", href: "#" },
                            { label: "Điều khoản sử dụng", href: "#" },
                        ]}
                    />

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                            Đăng ký nhận tin
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Nhận thông tin về khóa học mới và ưu đãi đặc biệt.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                type="email"
                                placeholder="Email của bạn"
                                className="flex-1"
                            />
                            <Button className="whitespace-nowrap">Đăng ký</Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left">
                        © 2025 Smart-Edu. Tất cả các quyền được bảo lưu.
                    </p>
                    <div className="flex space-x-6">
                        <BottomLink href="#">Chính sách bảo mật</BottomLink>
                        <BottomLink href="#">Điều khoản dịch vụ</BottomLink>
                        <BottomLink href="#">Cookie</BottomLink>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span>Hỗ trợ 24/7: 1900 1234</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Sub-components
const SocialLink = ({ href, icon }: { href: string; icon: string }) => {
    const icons = {
        facebook: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
            </svg>
        ),
        twitter: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.68-11.843c0-.214-.005-.426-.014-.636A10.009 10.009 0 0024 4.59z" />
            </svg>
        ),
        youtube: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
        ),
        linkedin: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
            </svg>
        ),
    };
    return (
        <a
            href={href}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
        >
            {icons[icon as keyof typeof icons]}
        </a>
    );
};

const FooterColumn = ({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) => {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                {title}
            </h3>
            <ul className="space-y-3">
                {links.map((link, index) => (
                    <li key={index}>
                        <a
                            href={link.href}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 text-sm transition-colors"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const BottomLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    return (
        <a
            href={href}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm transition-colors"
        >
            {children}
        </a>
    );
};

export default Footer;