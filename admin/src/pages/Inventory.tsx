import React, { useState } from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArchiveX,
  ArchiveRestore,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type InventoryStatus = "in-stock" | "out-of-stock";

interface InventoryItem {
  code: string;
  brand: string;
  model: string;
  cpuBrand: string;
  cpuModel: string;
  ram: string;
  storage: string;
  gpuBrand: string;
  gpuModel: string;
  monitor: string;
  price: string;
  quantity: number;
  aiActive: boolean;
  status: InventoryStatus;
}

const initialInventory: InventoryItem[] = [
  {
    code: "11834",
    brand: "HP",
    model: "EliteBook 850 G3",
    cpuBrand: "Intel",
    cpuModel: "6th Gen Core i5-6300U",
    ram: "8 GB",
    storage: "256 GB NVMe",
    gpuBrand: "Intel HD",
    gpuModel: "520 HD Graphics",
    monitor: "15.6-inch",
    price: "9699",
    quantity: 5,
    aiActive: true,
    status: "in-stock",
  },
  {
    code: "11940",
    brand: "Dell",
    model: "Latitude 7490",
    cpuBrand: "Intel",
    cpuModel: "8th Gen Core i7-8650U",
    ram: "8 GB",
    storage: "256 GB NVMe",
    gpuBrand: "Inte UHD",
    gpuModel: "620 UHD Graphics",
    monitor: "14-inch",
    price: "11500",
    quantity: 3,
    aiActive: true,
    status: "in-stock",
  },
  {
    code: "12014",
    brand: "HP",
    model: "EliteBook 850 G6",
    cpuBrand: "Intel",
    cpuModel: "8th Gen Core i5-8365U",
    ram: "8 GB",
    storage: "256 GB NVMe",
    gpuBrand: "Inte UHD",
    gpuModel: "620 UHD Graphics",
    monitor: "15.6-inch",
    price: "11999",
    quantity: 0,
    aiActive: false,
    status: "out-of-stock",
  },
  {
    code: "12015",
    brand: "HP",
    model: "EliteBook 830 G7",
    cpuBrand: "Intel",
    cpuModel: "10th Gen Core i5-10210U",
    ram: "16 GB",
    storage: "256 GB NVMe",
    gpuBrand: "Inte UHD",
    gpuModel: "UHD Graphics",
    monitor: "13.3-inch",
    price: "13500",
    quantity: 8,
    aiActive: true,
    status: "in-stock",
  },
  {
    code: "12017",
    brand: "Dell",
    model: "Latitude 5400",
    cpuBrand: "Intel",
    cpuModel: "8th Gen Core i5-8350U",
    ram: "16 GB",
    storage: "256 GB NVMe",
    gpuBrand: "Inte UHD",
    gpuModel: "UHD 620 UHD Graphics",
    monitor: "14-inch",
    price: "9400",
    quantity: 12,
    aiActive: true,
    status: "in-stock",
  },
  {
    code: "12024",
    brand: "Lenovo",
    model: "Ideapad Gaming 3",
    cpuBrand: "Intel",
    cpuModel: "11th Gen Core i5-11300H",
    ram: "16 GB",
    storage: "512 GB NVMe",
    gpuBrand: "Nvidia RTX",
    gpuModel: "RTX 3050 4GB",
    monitor: "15.6-inch",
    price: "26999",
    quantity: 2,
    aiActive: true,
    status: "in-stock",
  },
  {
    code: "12039",
    brand: "HP",
    model: "ZBook 840 Create G7",
    cpuBrand: "Intel",
    cpuModel: "10th Gen Core i7-10850H",
    ram: "32 GB",
    storage: "512 GB NVMe",
    gpuBrand: "Nvidia RTX",
    gpuModel: "RTX 2070 8GB",
    monitor: "15.6-inch",
    price: "33000",
    quantity: 0,
    aiActive: false,
    status: "out-of-stock",
  },
];

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [activeTab, setActiveTab] = useState<InventoryStatus>("in-stock");

  const filteredItems = items.filter((item) => item.status === activeTab);

  const toggleAiActive = (code: string) => {
    setItems(
      items.map((item) =>
        item.code === code ? { ...item, aiActive: !item.aiActive } : item,
      ),
    );
  };

  const toggleStatus = (code: string) => {
    setItems(
      items.map((item) => {
        if (item.code === code) {
          const newStatus =
            item.status === "in-stock" ? "out-of-stock" : "in-stock";
          return {
            ...item,
            status: newStatus,
            // Automatically update AI active if item goes out of stock, or if quantity changes conceptually
            aiActive: newStatus === "in-stock" ? true : false,
            quantity:
              newStatus === "in-stock" && item.quantity === 0
                ? 1
                : newStatus === "out-of-stock"
                  ? 0
                  : item.quantity,
          };
        }
        return item;
      }),
    );
  };

  const deleteItem = (code: string) => {
    setItems(items.filter((item) => item.code !== code));
  };

  return (
    <PageWrapper
      title="Inventory Management"
      description="Track parts, laptops, and hardware for sales and repairs."
      action={
        <div className="flex gap-2">
          <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Sheet
          </button>
          <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      }
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-[#0a0a0a]">
          <button
            onClick={() => setActiveTab("in-stock")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "in-stock" ? "border-primary text-primary bg-primary/5" : "border-transparent text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50"}`}
          >
            In Stock
          </button>
          <button
            onClick={() => setActiveTab("out-of-stock")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "out-of-stock" ? "border-primary text-primary bg-primary/5" : "border-transparent text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50"}`}
          >
            Out of Stock
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-neutral-800 flex items-center justify-between gap-4 bg-[#0a0a0a]/50">
          <div className="flex-1 max-w-sm relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, brand, or model..."
              className="w-full bg-[#0a0a0a] border border-neutral-700 rounded py-1.5 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-neutral-700 rounded text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-max w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-900 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-3 py-2 border-r border-neutral-800 w-16 text-center">
                  Code
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-20">
                  Brand
                </th>
                <th className="px-3 py-2 border-r border-neutral-800">Model</th>
                <th className="px-3 py-2 border-r border-neutral-800 w-20">
                  CPU Brand
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 min-w-[140px]">
                  CPU Model
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-16 text-center">
                  RAM
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-20">
                  Storage
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-20">
                  GPU Brand
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-28">
                  GPU Model
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-20">
                  Monitor
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-16 text-center text-primary">
                  QTY
                </th>
                <th className="px-3 py-2 border-r border-neutral-800 w-20 text-right text-emerald-500">
                  Price
                </th>
                <th className="px-3 py-2 w-36 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-[#0a0a0a]">
              <AnimatePresence>
                {filteredItems.map((item, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={item.code}
                    className="hover:bg-neutral-800/50 transition-colors cursor-default"
                  >
                    <td className="px-3 py-2 border-r border-neutral-800 font-medium text-neutral-400 text-center">
                      {item.code}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-300 font-medium">
                      {item.brand}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-200">
                      {item.model}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-400">
                      {item.cpuBrand}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-300">
                      {item.cpuModel}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-center text-neutral-300">
                      {item.ram}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-300">
                      {item.storage}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-400">
                      {item.gpuBrand}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-300">
                      {item.gpuModel}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-neutral-400">
                      {item.monitor}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-center font-bold text-white bg-neutral-900/50">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 border-r border-neutral-800 text-right font-medium text-emerald-500">
                      {item.price}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* AI Visibility Toggle */}
                        <button
                          onClick={() => toggleAiActive(item.code)}
                          className={`p-1.5 rounded transition-colors ${item.aiActive ? "text-primary hover:bg-primary/20 bg-primary/10" : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"}`}
                          title={
                            item.aiActive
                              ? "AI discussion enabled"
                              : "Hidden from AI"
                          }
                        >
                          {item.aiActive ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {/* In/Out of Stock Toggle */}
                        <button
                          onClick={() => toggleStatus(item.code)}
                          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title={
                            item.status === "in-stock"
                              ? "Mark Out of Stock"
                              : "Restore to Stock"
                          }
                        >
                          {item.status === "in-stock" ? (
                            <ArchiveX className="w-3.5 h-3.5" />
                          ) : (
                            <ArchiveRestore className="w-3.5 h-3.5 mx-auto" />
                          )}
                        </button>
                        {/* Edit Item */}
                        <button
                          className="p-1.5 rounded text-neutral-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete Item */}
                        <button
                          onClick={() => deleteItem(item.code)}
                          className="p-1.5 rounded text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={13}
                    className="px-3 py-8 text-center text-neutral-500 font-medium"
                  >
                    No items found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
