"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Save, Upload, User } from "lucide-react";
import toast from "react-hot-toast";
import { buildCloudinaryUrl } from "@/lib/utils";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    aboutText: "",
    email: "",
    phone: "",
    whatsapp: "",
    github: "",
    linkedin: "",
    facebook: "",
    profileImgUrl: "",
    cvUrl: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await setDoc(doc(db, "settings", "global"), formData);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Global Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile & CV Section */}
        <div className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><User size={20} className="text-[#A07CFE]"/> Personal Assets</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#020617] border-2 border-[#1a2333] flex justify-center items-center relative group">
                {formData.profileImgUrl ? (
                  <img src={buildCloudinaryUrl(formData.profileImgUrl, 200, 200)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-500" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Profile Image (Cloudinary)</label>
                <input type="text" name="profileImgUrl" value={formData.profileImgUrl || ""} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-3 text-white focus:border-[#A07CFE] outline-none" placeholder="Cloudinary URL أو Public ID" />
                <p className="text-xs text-gray-500 mt-1">ارفع الصورة على Cloudinary وحط الـ URL أو الـ Public ID هنا</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CV URL</label>
                <div className="flex items-center gap-4">
                  <input type="url" name="cvUrl" value={formData.cvUrl || ""} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-3 text-white focus:border-[#A07CFE] outline-none" placeholder="https://drive.google.com/..." />
                  {formData.cvUrl && (
                    <a href={formData.cvUrl} target="_blank" rel="noreferrer" className="text-[#A07CFE] text-sm hover:underline flex-shrink-0">View Current CV</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] shadow-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-[#A07CFE]">Content</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Hero Title (Subtitle)</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-3 text-white focus:border-[#A07CFE] outline-none" placeholder="e.g. Front-End Developer working with React & Next.js" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">About Me Text</label>
            <textarea name="aboutText" rows={5} value={formData.aboutText} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-3 text-white focus:border-[#A07CFE] outline-none" placeholder="Write about yourself..."></textarea>
          </div>
        </div>

        {/* Social & Contact */}
        <div className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#A07CFE]">Contact & Socials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Public Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-[#A07CFE] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Public Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-[#A07CFE] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">WhatsApp Link/Number</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-[#A07CFE] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
              <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-[#A07CFE] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">LinkedIn Link</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-[#A07CFE] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Facebook Link</label>
              <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full bg-[#020617] border border-[#1a2333] rounded-lg px-4 py-2 text-white focus:border-[#A07CFE] outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-[#A07CFE] to-[#da4478] text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg">
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
