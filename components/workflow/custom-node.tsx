"use client";

import React from "react";
import { Handle, Position } from "reactflow";
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

const iconMap: Record<string, any> = {
  manual: Zap,
  schedule: Clock,
  webhook: Webhook,
  weather: Cloud,
  github: Github,
  calendar: Calendar,
  http: Globe,
  filter: Filter,
  transform: Shuffle,
  condition: GitBranch,
  ai: Sparkles,
  email: Mail,
  sms: MessageSquare,
  social: Share2,
  notification: Bell,
};

const colorMap: Record<string, string> = {
  trigger: "bg-purple-500",
  data: "bg-blue-500",
  logic: "bg-yellow-500",
  action: "bg-green-500",
};

export function CustomNode({ data }: { data: any }) {
  const Icon = iconMap[data.subType] || Zap;
  const color = colorMap[data.nodeType] || "bg-slate-500";

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg shadow-lg min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div
        className={`${color} text-white p-2 rounded-t-md flex items-center gap-2`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>

      <div className="p-3 text-xs text-slate-600 dark:text-slate-400">
        {data.nodeType} / {data.subType}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
