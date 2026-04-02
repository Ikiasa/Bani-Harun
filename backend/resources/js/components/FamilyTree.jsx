import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Panel,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

import FamilyNode from './FamilyNode';
import { getLayoutedElements } from './LayoutEngine';
import { Search, Maximize2, Printer } from 'lucide-react';

const nodeTypes = {
    familyNode: FamilyNode,
};

const FamilyTreeContent = ({ initialMembers }) => {
    const [members] = useState(initialMembers);
    const [searchTerm, setSearchTerm] = useState('');
    const { getNodes } = useReactFlow();

    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => getLayoutedElements(members),
        [members]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Handle Search
    useEffect(() => {
        if (!searchTerm) {
            setNodes((nds) => nds.map((node) => ({ ...node, data: { ...node.data, isSelected: false } })));
            return;
        }

        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    isSelected: node.data.name.toLowerCase().includes(searchTerm.toLowerCase()),
                },
            }))
        );
    }, [searchTerm, setNodes]);

    const onToggleCollapse = useCallback((id) => {
        // Basic collapse logic: hide/show children edges and nodes
        // For a complex tree, we might need a more robust approach, but for now let's keep it simple
        console.log('Toggle collapse for:', id);
    }, []);

    const onDownload = useCallback(() => {
        const nodes = getNodes();
        const nodesBounds = getNodesBounds(nodes);
        const transform = getViewportForBounds(nodesBounds, 2000, 2000, 0.5, 2);

        const viewport = document.querySelector('.react-flow__viewport');
        if (!viewport) return;

        toPng(viewport, {
            backgroundColor: '#f8fafc',
            width: 2000,
            height: 2000,
            style: {
                width: '2000px',
                height: '2000px',
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
            },
        }).then((dataUrl) => {
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Silsilah-Keluarga-Bani-Harun.pdf');
        });
    }, [getNodes]);

    return (
        <div
            className="w-full bg-slate-50 rounded-2xl border border-slate-200 shadow-inner overflow-hidden relative"
            style={{ height: '800px' }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.2}
                maxZoom={2}
            >
                <Background color="#cbd5e1" variant="dots" gap={20} />

                <Panel position="top-left" className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200 m-4 flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari keluarga..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border-none bg-transparent focus:ring-0 text-sm min-w-[200px]"
                        />
                    </div>
                </Panel>

                <Panel position="top-right" className="m-4 flex flex-col gap-2 items-end">
                    <button
                        onClick={onDownload}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all font-bold text-sm"
                    >
                        <Printer className="w-4 h-4" />
                        Cetak PDF
                    </button>

                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-medium text-slate-600">Terpilih</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                            <span className="text-xs font-medium text-slate-600">Generasi</span>
                        </div>
                    </div>
                </Panel>

                <Controls className="!bg-white !border-slate-200 !shadow-lg !rounded-lg overflow-hidden" />
                <MiniMap
                    className="!bg-white !border-slate-200 !shadow-lg !rounded-xl overflow-hidden"
                    nodeStrokeColor={(n) => n.data.isSelected ? '#f59e0b' : '#e2e8f0'}
                    nodeColor={(n) => n.data.isSelected ? '#fffbeb' : '#f8fafc'}
                    maskColor="rgba(241, 245, 249, 0.7)"
                />
            </ReactFlow>
        </div>
    );
};

const FamilyTree = (props) => (
    <ReactFlowProvider>
        <FamilyTreeContent {...props} />
    </ReactFlowProvider>
);

export default FamilyTree;
