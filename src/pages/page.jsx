import NavBar from "@/components/common/NavBar";
import Editor from "../ui/editor";

export default function Page() {
    return (
        <>
            <NavBar selectedPage={"notes"} />
            <h1 className="-mb-10 mt-10 text-center text-4xl font-bold">
                Use the / command for AI
            </h1>
            <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
                <Editor />
            </div>
        </>
    );
}
