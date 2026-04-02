import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';

const FamilyNode = ({ data }) => {
    const { name, role, photo, isCollapsed, hasChildren, onToggleCollapse, isSelected, familyGroup, familyColor } = data;

    return (
        <div
            className={`relative rounded-xl shadow-sm transition-all duration-200 border-2 bg-white
        ${isSelected ? 'border-amber-500 ring-4 ring-amber-100' : 'border-gray-100 hover:border-amber-300 hover:shadow-md'}
        min-w-[200px] overflow-hidden group
      `}
        >
            <Handle type="target" position={Position.Top} className="!bg-gray-300" />

            {familyGroup && (
                <div
                    className="w-full text-center text-white py-1 px-2 text-[10px] font-bold uppercase tracking-widest shadow-sm"
                    style={{ backgroundColor: familyColor }}
                >
                    Jalur {familyGroup}
                </div>
            )}

            <div className="flex flex-col items-center gap-3 p-4">
                {/* Avatar */}
                <div className="relative">
                    {photo ? (
                        <img
                            src={`/storage/${photo}`}
                            alt={name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center border-2 border-white shadow-sm">
                            <User className="w-8 h-8 text-amber-300" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="text-center">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{name}</h3>
                    <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider mt-1">{role}</p>
                </div>

                {/* Collapse Toggle */}
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCollapse();
                        }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-amber-50 transition-colors z-10 shadow-sm"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-gray-300" />
        </div>
    );
};

export default memo(FamilyNode);
