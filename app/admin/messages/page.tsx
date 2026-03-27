"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Loader2, MailOpen } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  createdAt: any;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Message[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages. Please check Firebase Rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await deleteDoc(doc(db, "messages", id));
      setMessages(messages.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="bg-[#0a0e17] px-4 py-2 rounded-lg border border-[#1a2333] flex items-center gap-2">
          <MailOpen size={20} className="text-blue-500" />
          <span className="font-medium">{messages.length} Total</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#0a0e17] rounded-xl p-12 text-center border border-[#1a2333]">
          <MailOpen size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No messages yet</h3>
          <p className="text-gray-500 mt-2">When someone contacts you, their message will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-[#0a0e17] rounded-xl p-6 border border-[#1a2333] shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{msg.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <span>From: {msg.firstName} {msg.lastName}</span>
                    <span>•</span>
                    <a href={`mailto:${msg.email}`} className="text-purple-400 hover:underline">{msg.email}</a>
                    <span>•</span>
                    <a href={`tel:${msg.phoneNumber}`} className="text-purple-400 hover:underline">{msg.phoneNumber}</a>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="bg-[#020617] p-4 rounded-lg mt-4 border border-[#1a2333]">
                <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
              </div>
              <div className="text-xs text-gray-500 mt-4 text-right">
                Received: {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Date unknown'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
