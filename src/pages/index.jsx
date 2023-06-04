import Head from "next/head";

import { CallToAction } from "@/components/Landing/CallToAction";
import { Faqs } from "@/components/Landing/Faqs";
import { Footer } from "@/components/Landing/Footer";
import { Header } from "@/components/Landing/Header";
import { Hero } from "@/components/Landing/Hero";
import { Pricing } from "@/components/Landing/Pricing";
import { PrimaryFeatures } from "@/components/Landing/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/Landing/SecondaryFeatures";
import { Testimonials } from "@/components/Landing/Testimonials";

export default function Home() {
    return (
        <>
            <Head>
                <title>
                    Ojo Teach - Revolutionizing lesson planning for teachers 🍎
                </title>
                <meta
                    name="description"
                    content="Unleash your creativity, save time and focus on what matters most - teaching 📚"
                />
            </Head>
            <Header />
            <main>
                <Hero />
                <PrimaryFeatures />
                {/* <SecondaryFeatures /> */}
                <Testimonials />
                <CallToAction />
                <Pricing />
                <Faqs />
            </main>
            <Footer />
        </>
    );
}