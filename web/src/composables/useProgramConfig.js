import { ref } from "vue";

// Cấu hình chương trình được đọc lúc chạy từ  public/config/program.json
// => đổi tên chương trình / logo chỉ cần sửa file trong thư mục config/,
//    KHÔNG cần sửa code hay build lại.
const BASE = import.meta.env.BASE_URL || "/";

const DEFAULT_CONFIG = {
  hospitalName: "",
  address: "",
  hotline: "",
  website: "",
  programTitle: "",
  coOrg: "",
  logos: [],
  thanks: [],
};

export function useProgramConfig() {
  const config = ref({ ...DEFAULT_CONFIG });
  const configError = ref("");

  async function loadConfig() {
    // ?t=... + no-store để luôn lấy bản mới nhất, tránh trình duyệt cache file cũ
    const stamp = Date.now();
    try {
      const res = await fetch(`${BASE}config/program.json?t=${stamp}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      config.value = {
        ...DEFAULT_CONFIG,
        ...data,
        logos: (data.logos || []).map((l) => ({
          ...l,
          url: /^(https?:|data:|\/)/.test(l.src) ? l.src : `${BASE}config/${l.src}?t=${stamp}`,
        })),
      };
    } catch (e) {
      configError.value = `Không đọc được config/program.json (${e.message})`;
    }
  }

  return { config, configError, loadConfig };
}

// Chuyển **chữ đậm** thành <b>chữ đậm</b> (đã escape HTML trước để an toàn)
export function richText(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

