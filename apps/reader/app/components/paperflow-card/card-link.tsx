"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CardLink({id, title, link}: {id: string, title: string, link: string}) {
    const pathname = usePathname();
    const url = (pathname === '/') 
        ? `/read/${id}` 
        : link;
    
    return (
        <Link href={url} className="underline">
            {title}
        </Link>
    )
}