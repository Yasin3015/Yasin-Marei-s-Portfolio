"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Loader2, Plus, Star, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { buildCloudinaryUrl } from "@/lib/utils";

export default function SkillsPage() {
  const [skills, setSkills] = useState<{id: string, name: string, iconUrl: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      const data: any[] = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setSkills(data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this skill?")) return;
    try {
      await deleteDoc(doc(db, "skills", id));
      setSkills(skills.filter(s => s.id !== id));
      toast.success("Skill deleted");
    } catch {
      toast.error("Error deleting skill");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iconUrl) return toast.error("Please provide an icon URL");
    setSubmitting(true);
    try {
      const skillData = { name, iconUrl };
      const docRef = await addDoc(collection(db, "skills"), skillData);
      
      setSkills([...skills, { id: docRef.id, ...skillData }]);
      toast.success("Skill added!");
      setName(""); setIconUrl(""); setShowForm(false);
    } catch {
      toast.error("Failed to add skill");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
          <Plus size={20} /> Add Skill
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] mb-8 shadow-lg max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">Add New Skill</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Skill Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500" placeholder="e.g. Next.js" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Skill Icon (Cloudinary)</label>
              <input required type="text" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500" placeholder="Cloudinary URL أو Public ID" />
              <p className="text-xs text-gray-500 mt-1">ارفع الأيقونة على Cloudinary وحط الـ URL أو الـ Public ID هنا</p>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-[#1a2333] pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={submitting} className="bg-yellow-500 text-black px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 font-semibold hover:opacity-90">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'Saving...' : 'Save Skill'}
              </button>
            </div>
          </form>
        </div>
      )}

      {skills.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-[#0a0e17] rounded-xl border border-[#1a2333]">
          <Star size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No skills added yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] flex flex-col items-center justify-center relative group hover:border-yellow-500/50 transition-colors">
              <button onClick={() => handleDelete(skill.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
              <img src={buildCloudinaryUrl(skill.iconUrl, 80, 80)} alt={skill.name} className="w-12 h-12 mb-3 object-contain" />
              <span className="font-medium text-center text-sm">{skill.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
