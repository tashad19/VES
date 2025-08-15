// src/components/RoadmapPage.tsx
import React from "react";
import { Node, Edge, ReactFlow, Background, Controls, MiniMap, Handle, Position } from "reactflow";
import { Theme, RoadmapNode } from "../types";
import RoadmapModal from "../components/RoadmapModal";

interface RoadmapPageProps {
  theme: Theme;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  selectedNode: RoadmapNode | null;
  setSelectedNode: (node: RoadmapNode | null) => void;
  fetchAndRenderRoadmap: () => void;
  isLoggedIn: boolean;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({
  theme,
  searchQuery,
  setSearchQuery,
  nodes,
  edges,
  isLoading,
  selectedNode,
  setSelectedNode,
  fetchAndRenderRoadmap,
  isLoggedIn,
}) => {
  if (!isLoggedIn) {
    return (
      <div className={`p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <h1 className="text-3xl font-bold mb-6">Learning Roadmap Generator</h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Please log in to generate learning roadmaps.</p>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-lg shadow-lg relative ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <h1 className="text-3xl font-bold mb-6">Learning Roadmap Generator</h1>
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a skill or topic (e.g., Game Design)"
            className={`flex-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              theme === "dark" ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            onKeyPress={(e) => e.key === "Enter" && fetchAndRenderRoadmap()}
          />
          <button
            onClick={fetchAndRenderRoadmap}
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
      </div>
      <div className="h-[600px] w-full border rounded-lg overflow-hidden">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            className={theme === "dark" ? "bg-gray-900" : "bg-gray-50"}
            nodeTypes={{
              title: (props) => (
                <div
                  className={`p-2 rounded-lg cursor-pointer ${theme === "dark" ? "bg-blue-900 text-white" : "bg-blue-100 text-gray-900"} text-center`}
                  onClick={() => setSelectedNode(props as RoadmapNode)}
                >
                  <div className="font-bold text-lg">{props.data.label}</div>
                  <Handle type="source" position={Position.Bottom} id="bottom" />
                </div>
              ),
              section: (props) => (
                <div
                  className={`p-2 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-900 hover:bg-gray-300"} max-w-xs`}
                  onClick={() => setSelectedNode(props as RoadmapNode)}
                >
                  <div className="font-bold">{props.data.label}</div>
                  <div className="text-sm mt-1">{props.data.description}</div>
                  <Handle type="target" position={Position.Top} id="top" />
                  <Handle type="source" position={Position.Bottom} id="bottom" />
                  {props.data.subsections?.map((_, index) => (
                    <Handle
                      key={index}
                      type="source"
                      position={Position.Bottom}
                      id={`sub-${index}`}
                      style={{ left: `${20 + index * 20}%`, transform: "translateX(-50%)" }}
                    />
                  ))}
                </div>
              ),
              subsection: (props) => (
                <div
                  className={`p-2 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-900 hover:bg-gray-400"} max-w-xs`}
                  onClick={() => setSelectedNode(props as RoadmapNode)}
                >
                  <div className="font-bold">{props.data.label}</div>
                  <div className="text-sm mt-1">{props.data.description}</div>
                  <Handle type="target" position={Position.Top} id="top" />
                </div>
              ),
            }}
            defaultEdgeOptions={{ type: "smoothstep", animated: true }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Enter a topic above to generate a learning roadmap</p>
          </div>
        )}
      </div>
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSelectedNode(null)}>
          <RoadmapModal theme={theme} node={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;