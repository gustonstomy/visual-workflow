"use client";

import React from "react";
import {
  Clock,
  Zap,
  Webhook,
  Mail,
  MessageSquare,
  Bell,
  Share2,
  Cloud,
  Github,
  Calendar,
  Globe,
  Filter,
  Shuffle,
  GitBranch,
  Sparkles,
} from "lucide-react";

const nodeCategories = [
  {
    title: "Triggers",
    nodes: [
      {
        type: "trigger",
        subType: "manual",
        label: "Manual",
        icon: Zap,
        color: "text-purple-500",
      },
      {
        type: "trigger",
        subType: "schedule",
        label: "Schedule",
        icon: Clock,
        color: "text-purple-500",
      },
      {
        type: "trigger",
        subType: "webhook",
        label: "Webhook",
        icon: Webhook,
        color: "text-purple-500",
      },
    ],
  },
  {
    title: "Data Sources",
    nodes: [
      {
        type: "data",
        subType: "weather",
        label: "Weather",
        icon: Cloud,
        color: "text-blue-500",
      },
      {
        type: "data",
        subType: "github",
        label: "GitHub",
        icon: Github,
        color: "text-blue-500",
      },
      {
        type: "data",
        subType: "calendar",
        label: "Calendar",
        icon: Calendar,
        color: "text-blue-500",
      },
      {
        type: "data",
        subType: "http",
        label: "HTTP Request",
        icon: Globe,
        color: "text-blue-500",
      },
    ],
  },
  {
    title: "Logic",
    nodes: [
      {
        type: "logic",
        subType: "filter",
        label: "Filter",
        icon: Filter,
        color: "text-yellow-500",
      },
      {
        type: "logic",
        subType: "transform",
        label: "Transform",
        icon: Shuffle,
        color: "text-yellow-500",
      },
      {
        type: "logic",
        subType: "condition",
        label: "Condition",
        icon: GitBranch,
        color: "text-yellow-500",
      },
      {
        type: "logic",
        subType: "ai",
        label: "AI",
        icon: Sparkles,
        color: "text-yellow-500",
      },
    ],
  },
  {
    title: "Actions",
    nodes: [
      {
        type: "action",
        subType: "email",
        label: "Email",
        icon: Mail,
        color: "text-green-500",
      },
      {
        type: "action",
        subType: "sms",
        label: "SMS",
        icon: MessageSquare,
        color: "text-green-500",
      },
      {
        type: "action",
        subType: "webhook",
        label: "Webhook",
        icon: Webhook,
        color: "text-green-500",
      },
      {
        type: "action",
        subType: "social",
        label: "Social Post",
        icon: Share2,
        color: "text-green-500",
      },
      {
        type: "action",
        subType: "notification",
        label: "Notification",
        icon: Bell,
        color: "text-green-500",
      },
    ],
  },
];

export function WorkflowNode() {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    subType: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType, subType })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Library</h2>

      <div className="space-y-6">
        {nodeCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {category.title}
            </h3>
            <div className="space-y-2">
              {category.nodes.map((node) => (
                <div
                  key={node.subType}
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type, node.subType)}
                  className="flex items-center gap-2 p-2 rounded-md border border-slate-200 dark:border-slate-800 cursor-move hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <node.icon className={`w-4 h-4 ${node.color}`} />
                  <span className="text-sm">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
