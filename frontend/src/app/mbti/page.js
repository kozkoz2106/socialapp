"use client";
import Navbar from "@/components/navbar";
import { useState } from 'react';

export default function MbtiPage() {
    const [url, setUrl] = useState('https://www.16personalities.com/free-personality-test')
    return (
        <>
        <p>Welcome to the MBTI selection page.</p>
        <Navbar />
        </>
    );
}