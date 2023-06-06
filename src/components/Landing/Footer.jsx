import Link from "next/link";

import { Container } from "@/components/Landing/Container";
import { NavLink } from "@/components/Landing/NavLink";
import Image from "next/image";
import ojoLogo from "@/images/logos/ojo_logo.svg"

export function Footer() {
    return (
        <footer className="bg-slate-50">
            <Container>
                <div className="py-16">
                    <Image
                        className="mx-auto h-20 w-auto"
                        src={ojoLogo}
                        alt="Ojo Teach Logo"
                        width={80}
                        height={10}
                    />
                    <nav className="mt-10 text-sm" aria-label="quick links">
                        <div className="-my-1 flex justify-center gap-x-6">
                            <NavLink href="#features">Features</NavLink>
                            <NavLink href="#testimonials">Testimonials</NavLink>
                            <NavLink href="#pricing">Pricing</NavLink>
                        </div>
                    </nav>
                </div>
                <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
                    <div className="flex gap-x-6">
                        <Link
                            href="mailto:danielryder98@gmail.com"
                            className="group"
                            aria-label="Support Email"
                        >
                            danielryder98@gmail.com
                        </Link>
                        <Link
                            href="https://twitter.com/ojoteach"
                            className="group"
                            aria-label="Ojo Teach on Twitter"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                            >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
                            </svg>
                        </Link>
                        <Link
                            href="https://www.instagram.com/ojo_teach/"
                            className="group"
                            aria-label="Ojo Teach on Instagram"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </Link>
                        <Link
                            href="https://www.tiktok.com/@ojoteach"
                            className="group"
                            aria-label="Ojo Teach on TikTok"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 448 512"
                                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                            >
                                <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                            </svg>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-slate-500 sm:mt-0">
                        Copyright &copy; {new Date().getFullYear()} Ojo Teach.
                        All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
