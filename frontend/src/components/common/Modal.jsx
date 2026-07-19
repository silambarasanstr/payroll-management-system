import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, width = "max-w-2xl" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${width} rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-gray-300  px-6 py-4">
          <h2 className="text-md ">{title}</h2>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
