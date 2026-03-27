"use client";

import { useState, useEffect } from "react";
import { GradualSpacing } from "./ui/GradualSpacing";
import { ShineBorder } from "./ui/ShineBorder";
import Link from "next/link";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    phone: "(+20) 01021798849",
    whatsappLink: "https://wa.me/+201090257503?text=السلام عليكم و رحمة الله و بركاته باشمهندس ياسين انا :",
    email: "yasinmar3i3015@gmail.com"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "global"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            phone: data.phone || "(+20) 01021798849",
            whatsappLink: data.whatsapp || "https://wa.me/+201090257503?text=السلام عليكم و رحمة الله و بركاته باشمهندس ياسين انا :",
            email: data.email || "yasinmar3i3015@gmail.com"
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      toast.success("Message sent successfully!");
      setFormData({
        firstName: "", lastName: "", email: "", phoneNumber: "", subject: "", message: ""
      });
    } catch (error) {
      console.error("Error sending contact request:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="container">
      <GradualSpacing text="Contact me" className="my-10" />
      <div className="flex gap-5 justify-around flex-col-reverse sm:flex-row">
        <div className="mt-5">
          <span className=" mb-5 dark:text-white-100 font-bold tracking-tight">GET IN TOUCH!</span>
          <h1 className="text-xl sm:text-5xl mb-5 dark:text-white-100 font-bold tracking-tight">
            Send Me a Note and Initiate the Dialogue!
          </h1>
          <p className="text-normal text-sm sm:text-lg font-medium text-gray-600 dark:text-gray-400 mt-2">
            I’d love to hear from you! Whether you have questions, feedback, or
            just want to connect, reach out and let’s make it happen.
          </p>

          <div className="flex items-center mt-12 text-gray-600 dark:text-gray-400">
            {/* Same Location Icon */}
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="ml-4 text-md tracking-wide font-semibold w-40">Egypt, Cairo</div>
          </div>

          <div className="flex items-center mt-8 text-gray-600 dark:text-gray-400">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="ml-4 text-md tracking-wide font-semibold w-40">
              <a href={settings.whatsappLink} target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition-colors">
                {settings.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center mt-8 text-gray-600 dark:text-gray-400">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="ml-4 text-md tracking-wide font-semibold w-40">
              <a href={`mailto:${settings.email}`} className="hover:underline hover:text-white transition-colors">
                {settings.email}
              </a>
            </div>
          </div>
        </div>

        <ShineBorder className="p-1 w-full max-w-[600px] mx-auto" color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
          <form onSubmit={handleContact} className="space-y-4 w-full p-8 rounded-sm bg-[#0E162B] text-gray-50">
            <div className="flex gap-5 items-center justify-center flex-col sm:flex-row">
              <div className="flex-1 w-full">
                <label htmlFor="firstName" className="block text-sm font-medium text-[#A07CFE]">First Name</label>
                <input required id="firstName" name="firstName" type="text" placeholder="Ex. Yasin" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-4 py-3 rounded-[10px] bg-black-100 shadow-sm focus:outline-none focus:border-[#A07CFE] border border-transparent sm:text-sm transition-colors" />
              </div>

              <div className="flex-1 w-full">
                <label htmlFor="lastName" className="block text-sm font-medium text-[#A07CFE]">Last Name</label>
                <input required id="lastName" name="lastName" type="text" placeholder="Ex. Marei" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-4 py-3 rounded-[10px] bg-black-100 shadow-sm focus:outline-none focus:border-[#A07CFE] border border-transparent sm:text-sm transition-colors" />
              </div>
            </div>

            <div className="flex gap-5 items-center justify-center flex-col sm:flex-row">
              <div className="flex-1 w-full">
                <label htmlFor="email" className="block text-sm font-medium text-[#A07CFE]">Email</label>
                <input required id="email" name="email" type="email" placeholder="Ex. yas@example.com" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-3 rounded-[10px] bg-black-100 shadow-sm focus:outline-none focus:border-[#A07CFE] border border-transparent sm:text-sm transition-colors" />
              </div>

              <div className="flex-1 w-full">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#A07CFE]">Phone Number</label>
                <input required id="phoneNumber" name="phoneNumber" type="text" placeholder="Ex. +201XXXXXXXXX" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-4 py-3 rounded-[10px] bg-black-100 shadow-sm focus:outline-none focus:border-[#A07CFE] border border-transparent sm:text-sm transition-colors" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#A07CFE]">Subject</label>
              <input required id="subject" name="subject" type="text" placeholder="Ex. Message Title" value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-4 py-3 rounded-[10px] bg-black-100 shadow-sm focus:outline-none focus:border-[#A07CFE] border border-transparent sm:text-sm transition-colors" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#A07CFE]">Message</label>
              <textarea required id="message" name="message" rows={5} placeholder="Ex. Hello, I'd like to work with you!" value={formData.message} onChange={handleChange} className="mt-1 block w-full px-4 py-3 rounded-[10px] bg-black-100 shadow-sm focus:outline-none focus:border-[#A07CFE] border border-transparent sm:text-sm transition-colors" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-gradient-to-r from-[#A07CFE] to-[#da4478] text-white py-3 px-4 rounded-[12px] shadow focus:outline-none hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </ShineBorder>
      </div>
    </div>
  );
}
export default Contact;
