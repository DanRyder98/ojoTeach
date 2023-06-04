import 'focus-visible'
import '@/styles/tailwind.css'

import { Toaster } from "react-hot-toast";
// import CookieConsent from "react-cookie-consent";
// import Link from "next/link";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
            {/* <CookieConsent
                location="bottom"
                buttonText="Yeah I want the website to work properly so accept cookies"
                declineButtonText="Decline, the website won't work properly, if you want to know more check out the policy"
                onDecline={() => {
                    window.location.href = "/cookiePolicy";
                }}
                setDeclineCookie={false}
                onAccept={() => {
                    if (window.location.pathname === "/cookiePolicy") {
                        window.location.href = "/";
                    }
                }}
                enableDeclineButton={true}
                cookieName="myWebsiteCookieConsent"
                style={{ background: "#ff9d52" }}
                buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                declineButtonStyle={{
                    color: "#ffffff",
                    fontSize: "13px",
                    background: "#cc6618",
                }}
                expires={150} // The cookie will expire after 150 days
            >
                This website uses cookies, it just makes it easier to make cool
                features work, your data won&apos;t be sold or anything
                don&apos;t worry. Check out the policy if you like.{" "}
                <Link href={"/cookiePolicy"} style={{ fontSize: "10px" }}>
                    Cookie Policy
                </Link>
            </CookieConsent> */}
        </>
    );
}
