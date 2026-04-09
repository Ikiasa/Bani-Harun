import { EmpowermentClient } from "@/components/pemberdayaan/empowerment-client"

import { supabase } from "@/lib/supabase"

async function getEmpowermentData() {
    const [oppsRes, progsRes, ideasRes] = await Promise.all([
        supabase.from('opportunities').select('*'),
        supabase.from('programs').select('*'),
        supabase.from('ideas').select('*')
    ]);

    return {
        opportunities: oppsRes.data || [],
        programs: progsRes.data || [],
        ideas: ideasRes.data || []
    };
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
