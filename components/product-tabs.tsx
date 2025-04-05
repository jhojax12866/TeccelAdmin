"use client"

import { useState } from "react"

interface ProductTabsProps {
  description: string
  features: string[]
  specifications: Record<string, string>
}

export default function ProductTabs({ description, features, specifications }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "description" ? "text-[#e41e26] border-b-2 border-[#e41e26]" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("description")}
        >
          Descripción
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "features" ? "text-[#e41e26] border-b-2 border-[#e41e26]" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("features")}
        >
          Características
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "specifications" ? "text-[#e41e26] border-b-2 border-[#e41e26]" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("specifications")}
        >
          Especificaciones
        </button>
      </div>

      <div className="p-4 bg-white border-b border-l border-r rounded-b-lg">
        {activeTab === "description" && (
          <div>
            <p>{description}</p>
          </div>
        )}

        {activeTab === "features" && (
          <div>
            <ul className="pl-5 space-y-2 list-disc">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="divide-y">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex py-2">
                <span className="w-1/3 font-medium">{key}</span>
                <span className="w-2/3">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

