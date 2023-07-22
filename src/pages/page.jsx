import NavBar from "@/components/common/NavBar";
import Editor from "../ui/editor";

export default function Page() {
    return (
        <>
            <NavBar selectedPage={"notes"} />
            <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
                <Editor />
            </div>
        </>
    );
}
