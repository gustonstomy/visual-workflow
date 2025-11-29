/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { X, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Node } from "reactflow";

type NodeConfigPanelProps = {
  node: Node;
  nodes: Node[];
  edges: any[];
  onConfigChange: (nodeId: string, config: any, label?: string) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
};

export function NodeConfigPanel({
  node,
  nodes,
  edges,
  onConfigChange,
  onDelete,
  onClose,
}: NodeConfigPanelProps) {
  // Use a key-based approach to reset state when node changes
  const [config, setConfig] = useState(node.data.config || {});
  const [label, setLabel] = useState(node.data.label || "");
  const [currentNodeId, setCurrentNodeId] = useState(node.id);

  // Only update state when the node ID actually changes (different node selected)
  if (currentNodeId !== node.id) {
    setConfig(node.data.config || {});
    setLabel(node.data.label || "");
    setCurrentNodeId(node.id);
  }

  const handleSave = () => {
    onConfigChange(node.id, config, label);
    onClose(); // Close the panel after saving
  };

  // Helper component to show available data references
  const DataReferenceHelper = () => {
    const [showHelper, setShowHelper] = useState(false);

    // Find nodes connected as inputs to the current node
    const inputNodes = edges
      .filter((edge) => edge.target === node.id)
      .map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        return sourceNode;
      })
      .filter((n) => n !== undefined);

    return (
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
        <button
          onClick={() => setShowHelper(!showHelper)}
          className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 w-full"
        >
          <Info className="w-4 h-4" />
          <span>How to use response from previous node</span>
          <span className="ml-auto">{showHelper ? "▼" : "▶"}</span>
        </button>

        {showHelper && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              You can use these placeholders to reference data from other nodes:
            </p>

            {/* Show connected input nodes */}
            {inputNodes.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Connected Nodes:
                </p>
                {inputNodes.map((inputNode) => (
                  <div
                    key={inputNode.id}
                    className="bg-white dark:bg-slate-900 p-2 rounded border"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {inputNode.data.label || inputNode.data.subType}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({inputNode.data.nodeType})
                      </span>
                    </div>
                    <code className="text-green-600 dark:text-green-400 text-xs break-all">
                      {`{{${inputNode.id}}}`}
                    </code>
                  </div>
                ))}
              </div>
            )}

            {/* General placeholders */}
            <div className="space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Quick Reference:
              </p>
              <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded border space-y-1">
                <div>
                  <code className="text-green-600 dark:text-green-400">
                    {"{{previous.response}} "}
                  </code>
                  <span className="text-slate-500 ml-2">
                    Get previous node&apos;s full output
                  </span>
                </div>
                {/* <div>
                  <code className="text-green-600 dark:text-green-400">
                    {"{{previous.field}}"}
                  </code>
                  <span className="text-slate-500 ml-2">
                    Get specific field from previous node
                  </span>
                </div>
                <div>
                  <code className="text-green-600 dark:text-green-400">
                    {"{{trigger}}"}
                  </code>
                  <span className="text-slate-500 ml-2">Get trigger data</span>
                </div> */}
              </div>
            </div>

            <p className="text-slate-500 italic">
              Example: &quot;Weather is {"{{previous.response}}"}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderConfigFields = () => {
    const { nodeType, subType } = node.data;

    if (nodeType === "trigger" && subType === "schedule") {
      return (
        <>
          <div className="space-y-2">
            <Label>Schedule Type</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.schedule?.type || "daily"}
              onChange={(e) =>
                setConfig({
                  ...config,
                  schedule: { ...config.schedule, type: e.target.value },
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Time (HH:MM)</Label>
            <Input
              type="time"
              value={config.schedule?.time || "09:00"}
              onChange={(e) =>
                setConfig({
                  ...config,
                  schedule: { ...config.schedule, time: e.target.value },
                })
              }
            />
          </div>
        </>
      );
    }

    if (nodeType === "data" && subType === "weather") {
      return (
        <>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="New York"
              value={config.location || ""}
              onChange={(e) =>
                setConfig({ ...config, location: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Units</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.units || "imperial"}
              onChange={(e) => setConfig({ ...config, units: e.target.value })}
            >
              <option value="imperial">Imperial (°F)</option>
              <option value="metric">Metric (°C)</option>
            </select>
          </div>
        </>
      );
    }

    if (nodeType === "data" && subType === "github") {
      return (
        <>
          <div className="space-y-2">
            <Label>Owner</Label>
            <Input
              placeholder="username"
              value={config.owner || ""}
              onChange={(e) => setConfig({ ...config, owner: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Repository</Label>
            <Input
              placeholder="repo-name"
              value={config.repository || ""}
              onChange={(e) =>
                setConfig({ ...config, repository: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Data Type</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.type || "commits"}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
            >
              <option value="commits">Commits</option>
              <option value="issues">Issues</option>
              <option value="prs">Pull Requests</option>
            </select>
          </div>
        </>
      );
    }

    if (nodeType === "data" && subType === "http") {
      return (
        <>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              placeholder="https://api.example.com/data"
              value={config.url || ""}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Method</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.method || "GET"}
              onChange={(e) => setConfig({ ...config, method: e.target.value })}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </>
      );
    }

    if (nodeType === "data" && subType === "calendar") {
      return (
        <>
          <div className="space-y-2">
            <Label>Calendar ID</Label>
            <Input
              placeholder="primary"
              value={config.calendarId || "primary"}
              onChange={(e) =>
                setConfig({ ...config, calendarId: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Time Min (Optional)</Label>
            <Input
              type="datetime-local"
              value={config.timeMin || ""}
              onChange={(e) =>
                setConfig({ ...config, timeMin: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Results</Label>
            <Input
              type="number"
              value={config.maxResults || 10}
              onChange={(e) =>
                setConfig({ ...config, maxResults: parseInt(e.target.value) })
              }
            />
          </div>
        </>
      );
    }

    if (nodeType === "logic" && subType === "filter") {
      return (
        <>
          <div className="space-y-2">
            <Label>Field</Label>
            <Input
              placeholder="temperature"
              value={config.field || ""}
              onChange={(e) => setConfig({ ...config, field: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Operator</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.operator || "equals"}
              onChange={(e) =>
                setConfig({ ...config, operator: e.target.value })
              }
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              placeholder="value"
              value={config.value || ""}
              onChange={(e) => setConfig({ ...config, value: e.target.value })}
            />
          </div>
        </>
      );
    }

    if (nodeType === "logic" && subType === "ai") {
      return (
        <>
          <div className="space-y-2">
            <Label>Provider</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.provider || "openai"}
              onChange={(e) =>
                setConfig({ ...config, provider: e.target.value })
              }
            >
              {/* <option value="openai">OpenAI</option> */}
              <option value="gemini">Google Gemini</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              placeholder="Generate a summary of the data"
              value={config.prompt || ""}
              onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
              rows={4}
            />
          </div>
        </>
      );
    }

    if (nodeType === "action" && subType === "email") {
      return (
        <>
          <div className="space-y-2">
            <Label>To Email</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={config.to || ""}
              onChange={(e) => setConfig({ ...config, to: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="Email subject"
              value={config.subject || ""}
              onChange={(e) =>
                setConfig({ ...config, subject: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Body</Label>
            <Textarea
              placeholder="Email body"
              value={config.body || ""}
              onChange={(e) => setConfig({ ...config, body: e.target.value })}
              rows={4}
            />
          </div>
        </>
      );
    }

    if (nodeType === "action" && subType === "social") {
      return (
        <>
          <div className="space-y-2">
            <Label>Platform</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.platform || "twitter"}
              onChange={(e) =>
                setConfig({ ...config, platform: e.target.value })
              }
            >
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Post content"
              value={config.message || ""}
              onChange={(e) =>
                setConfig({ ...config, message: e.target.value })
              }
              rows={4}
            />
          </div>
        </>
      );
    }

    if (nodeType === "action" && subType === "notification") {
      return (
        <>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Notification title"
              value={config.title || ""}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Notification message"
              value={config.message || ""}
              onChange={(e) =>
                setConfig({ ...config, message: e.target.value })
              }
              rows={3}
            />
          </div>
        </>
      );
    }

    if (nodeType === "action" && subType === "sheet") {
      return (
        <>
          <div className="space-y-2">
            <Label>Spreadsheet ID</Label>
            <Input
              placeholder="Spreadsheet ID"
              value={config.spreadsheetId || ""}
              onChange={(e) =>
                setConfig({ ...config, spreadsheetId: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Range</Label>
            <Input
              placeholder="Sheet1!A1"
              value={config.range || ""}
              onChange={(e) => setConfig({ ...config, range: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Action</Label>
            <select
              className="w-full p-2 border rounded"
              value={config.action || "append"}
              onChange={(e) => setConfig({ ...config, action: e.target.value })}
            >
              <option value="append">Append Row</option>
              <option value="update">Update Range</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Values (Comma separated)</Label>
            <Textarea
              placeholder="Value 1, Value 2, {{nodeId}}"
              value={
                Array.isArray(config.values)
                  ? config.values.join(", ")
                  : config.values || ""
              }
              onChange={(e) =>
                setConfig({
                  ...config,
                  values: e.target.value
                    .split(",")
                    .map((s: string) => s.trim()),
                })
              }
              rows={3}
            />
          </div>
        </>
      );
    }

    return (
      <div className="text-sm text-slate-500">
        No configuration needed for this node type.
      </div>
    );
  };

  return (
    <Card className="absolute top-4 right-4 w-80 z-10 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Configure Node</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataReferenceHelper />

        <div className="space-y-2">
          <Label>Node Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Node label"
          />
        </div>

        {renderConfigFields()}

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(node.id);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
