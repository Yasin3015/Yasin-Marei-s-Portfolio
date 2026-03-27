"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Loader2, Plus, FileText, Pencil } from "lucide-react";
import toast from "react-hot-toast";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const fetchExperiences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "experience"));
      const data: any[] = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setExperiences(data.sort((a,b) => (a.createdAt > b.createdAt ? -1 : 1)));
    } catch {
      toast.error("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this experience entry?")) return;
    try {
      await deleteDoc(doc(db, "experience", id));
      setExperiences(experiences.filter(e => e.id !== id));
      toast.success("Entry deleted");
    } catch {
      toast.error("Error deleting entry");
    }
  };

  const handleStartEdit = (exp: any) => {
    setEditingId(exp.id);
    setTitle(exp.title || "");
    setCompany(exp.company || "");
    setDuration(exp.duration || "");
    setDescription(exp.description || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const expData = { title, company, duration, description, createdAt: serverTimestamp() };
      if (editingId) {
        await setDoc(doc(db, "experience", editingId), expData as any);
        toast.success("Experience updated!");
      } else {
        const docRef = await addDoc(collection(db, "experience"), expData);
        setExperiences([{ id: docRef.id, ...expData }, ...experiences]);
        toast.success("Experience added!");
      }
      
      setTitle(""); setCompany(""); setDuration(""); setDescription("");
      setEditingId(null);
      setShowForm(false);
      await fetchExperiences();
    } catch {
      toast.error(editingId ? "Failed to update experience" : "Failed to add experience");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-green-500" size={40} /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Experience Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] mb-8 shadow-lg max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-semibold mb-4 text-green-500">
            {editingId ? "Edit Role" : "Add New Role"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" placeholder="e.g. Front-End Developer" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company</label>
                <input required type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" placeholder="e.g. Google" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Duration</label>
                <input required type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" placeholder="e.g. Jan 2022 - Present" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white outline-none focus:border-green-500" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 border-t border-[#1a2333] pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Saving..." : editingId ? "Update Entry" : "Save Entry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {experiences.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-[#0a0e17] rounded-xl border border-[#1a2333]">
          <FileText size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No experience entries yet</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] flex justify-between items-start group hover:border-green-500/30 transition-colors shadow-lg">
              <div>
                <h3 className="text-xl font-bold text-white">{exp.title} <span className="text-green-500 font-medium">@ {exp.company}</span></h3>
                <p className="text-sm text-gray-400 mt-1 mb-3">{exp.duration}</p>
                <p className="text-gray-300 whitespace-pre-wrap">{exp.description}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleStartEdit(exp)}
                  className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                >
                  <Pencil size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
