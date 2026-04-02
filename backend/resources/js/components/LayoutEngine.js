import { tree, hierarchy } from 'd3-hierarchy';

/**
 * Calculates the layout of the family tree using D3's tree layout algorithm.
 * @param {Array} members - The list of family members with parent_id relationships.
 * @param {Object} options - Layout options (nodeWidth, nodeHeight, spacing).
 * @returns {Object} - { nodes, edges } formatted for React Flow.
 */
export const getLayoutedElements = (members, { nodeWidth = 250, nodeHeight = 150, spacingX = 100, spacingY = 200 } = {}) => {
    if (!members || members.length === 0) return { nodes: [], edges: [] };

    // 1. Build hierarchy
    const rootMember = members.find(m => !m.parent_id);
    if (!rootMember) return { nodes: [], edges: [] };

    const stratify = (id) => {
        const member = members.find(m => m.id === id);
        return {
            ...member,
            children: members.filter(m => m.parent_id === id).map(m => stratify(m.id))
        };
    };

    const data = stratify(rootMember.id);
    const root = hierarchy(data);

    // Color logic
    const familyColors = [
        '#f59e0b', // Amber
        '#3b82f6', // Blue
        '#10b981', // Emerald
        '#8b5cf6', // Violet
        '#ef4444', // Red
        '#06b6d4', // Cyan
        '#f97316', // Orange
        '#ec4899', // Pink
    ];
    let colorIndex = 0;
    const colorMap = {};
    const getColorForFamily = (familyName) => {
        if (!familyName) return '#cbd5e1';
        if (!colorMap[familyName]) {
            colorMap[familyName] = familyColors[colorIndex % familyColors.length];
            colorIndex++;
        }
        return colorMap[familyName];
    };

    const propagateFamily = (node, currentFamily = null, currentFamilyColor = '#cbd5e1') => {
        let family = currentFamily;
        let color = currentFamilyColor;

        let headOfFamilyStr = node.data.biography?.head_of_family;

        if (headOfFamilyStr) {
            family = headOfFamilyStr;
            color = getColorForFamily(family);
        }

        node.data.familyGroup = family;
        node.data.familyColor = color;

        if (node.children) {
            node.children.forEach(child => propagateFamily(child, family, color));
        }
    };
    propagateFamily(root);

    // 2. Apply D3 Tree Layout
    const treeLayout = tree().nodeSize([nodeWidth + spacingX, nodeHeight + spacingY]);
    treeLayout(root);

    // 3. Convert to React Flow format
    const rfNodes = [];
    const rfEdges = [];

    root.descendants().forEach((d) => {
        rfNodes.push({
            id: d.data.id.toString(),
            type: 'familyNode',
            position: { x: d.x, y: d.y },
            data: {
                ...d.data,
                hasChildren: d.children?.length > 0,
                label: d.data.name
            },
        });

        if (d.parent) {
            rfEdges.push({
                id: `e${d.parent.data.id}-${d.data.id}`,
                source: d.parent.data.id.toString(),
                target: d.data.id.toString(),
                type: 'smoothstep',
                animated: false,
                style: { stroke: d.data.familyColor || '#cbd5e1', strokeWidth: d.data.familyGroup ? 3 : 2 },
            });
        }
    });

    return { nodes: rfNodes, edges: rfEdges };
};
