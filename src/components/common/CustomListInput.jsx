import React, { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CustomListInput({ items, setItems }) {
    const [inputText, setInputText] = useState("");

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddItem();
        }
    };

    const handleAddItem = () => {
        if (inputText.trim() !== "") {
            setItems([...items, inputText.trim()]);
            setInputText("");
        }
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((item, i) => i !== index));
    };

    return (
        <div>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                    <label
                        htmlFor="project-name"
                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                    >
                        Lesson Objectives
                    </label>
                </div>
                <div className="relative flex flex-grow items-stretch focus-within:z-10 sm:col-span-2">
                    <label
                        htmlFor="name"
                        className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                        press enter to add
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={inputText}
                    />
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={handleAddItem}
                    >
                        <PlusIcon
                            className="-ml-0.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        Add
                    </button>
                </div>
                <div className="sm:col-start-2 sm:col-end-4">
                    <ul role="list" className="divide-y divide-gray-100">
                        {items.map((item, index) => (
                            <li
                                key={index + "textListItem"}
                                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-lg py-5 hover:bg-gray-50 sm:flex-nowrap"
                            >
                                <div>
                                    <p className="pl-3 text-sm leading-6 text-gray-900">
                                        <div className="">• {item}</div>
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        handleRemoveItem(index);
                                    }}
                                >
                                    <XMarkIcon
                                        className="ml-4 mr-4 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
