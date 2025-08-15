import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Theme, RoadmapNode } from "../App";

interface RoadmapModalProps {
  theme: Theme;
  node: RoadmapNode;
  onClose: () => void;
}

const RoadmapModal: React.FC<RoadmapModalProps> = ({ theme, node, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 right-0 h-full w-1/3 p-6 shadow-lg overflow-y-auto z-50 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{node.data.label}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </h3>
            <p className="text-sm">
              {node.data.description || "No description available."}
            </p>
          </div>

          {node.data.details && (
            <div>
              <h3
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Details
              </h3>
              <p className="text-sm">{node.data.details}</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoadmapModal;