"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MessageSquare, Briefcase, Star, FileText } from "lucide-react";

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { name: "Total Messages", value: "-", icon: <MessageSquare size={24} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Total Projects", value: "-", icon: <Briefcase size={24} />, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Experience Entries", value: "-", icon: <FileText size={24} />, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Listed Skills", value: "-", icon: <Star size={24} />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const msgCol = collection(db, "messages");
        const projCol = collection(db, "projects");
        const expCol = collection(db, "experience");
        const skillCol = collection(db, "skills");

        const [msgSnap, projSnap, expSnap, skillSnap] = await Promise.all([
          getCountFromServer(msgCol),
          getCountFromServer(projCol),
          getCountFromServer(expCol),
          getCountFromServer(skillCol),
        ]);

        setStats([
          { name: "Total Messages", value: msgSnap.data().count.toString(), icon: <MessageSquare size={24} />, color: "text-blue-500", bg: "bg-blue-500/10" },
          { name: "Total Projects", value: projSnap.data().count.toString(), icon: <Briefcase size={24} />, color: "text-purple-500", bg: "bg-purple-500/10" },
          { name: "Experience Entries", value: expSnap.data().count.toString(), icon: <FileText size={24} />, color: "text-green-500", bg: "bg-green-500/10" },
          { name: "Listed Skills", value: skillSnap.data().count.toString(), icon: <Star size={24} />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] shadow-lg flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
