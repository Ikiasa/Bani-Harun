import { EmpowermentClient } from "@/components/pemberdayaan/empowerment-client"

import { cookies } from 'next/headers'
import { API_BASE_URL } from "@/lib/api-config"

async function getEmpowermentData() {
    const baseUrl = API_BASE_URL;
    const cookieStore = await cookies()
    const token = cookieStore.get('bh-auth-token')?.value

    const res = await fetch(`${baseUrl}/api/dashboard/empowerment`, {
        cache: 'no-store',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });

    if (!res.ok) throw new Error("Failed to fetch empowerment data");
    return res.json();
}

export default async function PemberdayaanPage() {
    const data = await getEmpowermentData();

    return (
        <EmpowermentClient
            opportunities={data.opportunities}
            programs={data.programs}
            ideas={data.ideas}
        />
    )
}
