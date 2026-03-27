"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Loader2, Plus, Briefcase, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { buildCloudinaryUrl } from "@/lib/utils";
import { projects as seedProjects } from "@/data";

interface Project {
  id: string;
  title: string;
  des: string;
  img: string;
  iconsList: string[];
  link: string;
  sourceCode?: string;
  createdAt?: any;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [link, setLink] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [iconsInput, setIconsInput] = useState("/html.svg, /css.svg, /react.svg");
  const [imgUrl, setImgUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data: Project[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(data.sort((a,b) => (a.createdAt > b.createdAt ? -1 : 1)) as any);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSeedFromData = async () => {
    if (seeding) return;
    const ok = confirm("Seed default projects from local data into Firestore? This will overwrite using the same doc IDs.");
    if (!ok) return;

    setSeeding(true);
    try {
      await Promise.all(
        seedProjects.map((p, index) => {
          const docId = p?.id !== undefined && p?.id !== null ? String(p.id) : String(index);
          const projectData: Omit<Project, "id"> = {
            title: p.title,
            des: p.des,
            img: p.img,
            iconsList: p.iconsList,
            link: p.link,
            ...(p.sourceCode ? { sourceCode: p.sourceCode } : {}),
            createdAt: serverTimestamp(),
          };

          return setDoc(doc(db, "projects", docId), projectData as any);
        })
      );

      toast.success("Projects seeded successfully");
      await fetchProjects();
    } catch (error) {
      console.error("Error seeding projects:", error);
      toast.error("Failed to seed projects");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDes(project.des);
    setLink(project.link);
    setSourceCode(project.sourceCode || "");
    setIconsInput((project.iconsList || []).join(", "));
    setImgUrl(project.img);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgUrl) {
      toast.error("Please provide an image URL");
      return;
    }
    
    setSubmitting(true);
    try {
      const iconsList = iconsInput.split(",").map(i => i.trim()).filter(i => i);
      
      const projectData = {
        title,
        des,
        img: imgUrl,
        link,
        sourceCode: sourceCode || null,
        iconsList,
        createdAt: serverTimestamp()
      };

      if (editingId) {
        await setDoc(doc(db, "projects", editingId), projectData as any);
        toast.success("Project updated successfully");
      } else {
        const docRef = await addDoc(collection(db, "projects"), projectData);
        setProjects([{ id: docRef.id, ...projectData } as Project, ...projects]);
        toast.success("Project added successfully");
      }
      
      setTitle(""); setDes(""); setLink(""); setSourceCode(""); setImgUrl("");
      setEditingId(null);
      setShowForm(false);
      await fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedFromData}
            disabled={seeding}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {seeding ? <Loader2 size={20} className="animate-spin" /> : "Seed Defaults"}
          </button>
          <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Project
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] mb-8 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-semibold mb-4 text-[#A07CFE]">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Demo Link</label>
                <input required type="url" value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Source Code Link (Optional)</label>
                <input type="url" value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tech Icons URLs (e.g. /html.svg, ...)</label>
                <input required type="text" value={iconsInput} onChange={(e) => setIconsInput(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea required rows={3} value={des} onChange={(e) => setDes(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Cover Image (Cloudinary)</label>
              <input required type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" placeholder="Cloudinary URL أو Public ID (e.g. salam)" />
              <p className="text-xs text-gray-500 mt-1">ارفع الصورة على Cloudinary وحط الـ URL أو الـ Public ID هنا</p>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-[#1a2333] pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Saving..." : editingId ? "Update Project" : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-[#0a0e17] rounded-xl border border-[#1a2333]">
          <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No projects yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#0a0e17] rounded-xl overflow-hidden border border-[#1a2333] shadow-lg flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img src={buildCloudinaryUrl(project.img, 600, 400)} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleStartEdit(project)}
                      className="p-2 bg-purple-500/80 hover:bg-purple-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{project.des}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.iconsList?.map((icon, i) => (
                    <span key={i} className="text-xs bg-[#020617] border border-[#1a2333] px-2 py-1 rounded text-[#A07CFE]">{
                      icon.startsWith('/') ? icon.replace('/', '').replace('.svg', '') : icon
                    }</span>
                  ))}
                </div>
                <div className="flex gap-3 text-sm">
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Demo Link</a>
                  {project.sourceCode && <a href={project.sourceCode} target="_blank" rel="noreferrer" className="text-gray-400 hover:underline">Source Code</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
