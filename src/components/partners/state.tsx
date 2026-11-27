"use client";

// Page state for /partners, shared by the seat picker, the calculator and the
// apply form: the partner type (pre-selected from ?type= so each flyer's QR
// opens on the right tab), the bank/credit union switch, referrals per month,
// and who referred the visitor (?ref=).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isPartnerType, partnerNames, type PartnerTypeId } from "@/lib/partners";
import { loadAttribution } from "@/lib/ref";

type Ctx = {
  type: PartnerTypeId;
  setType: (t: PartnerTypeId) => void;
  bank: boolean;
  setBank: (b: boolean) => void;
  clients: number;
  setClients: (n: number) => void;
  /** Stored partner ref slug, and a display name only if partners.ts lists one */
  ref: string;
  refName: string | null;
};

const PartnerContext = createContext<Ctx | null>(null);

export function usePartner() {
  const c = useContext(PartnerContext);
  if (!c) throw new Error("usePartner must be used inside <PartnerProvider>");
  return c;
}

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const [type, setTypeState] = useState<PartnerTypeId>("insurance");
  const [bank, setBank] = useState(false);
  const [clients, setClients] = useState(2);
  const [ref, setRef] = useState("");

  useEffect(() => {
    const t = new URLSearchParams(location.search).get("type")?.toLowerCase();
    if (isPartnerType(t)) setTypeState(t);
    const sync = () => setRef(loadAttribution()?.ref ?? "");
    sync();
    window.addEventListener("amg:attribution", sync);
    return () => window.removeEventListener("amg:attribution", sync);
  }, []);

  // Keep ?type= in the address bar in step with the tab, so a copied link opens the same seat
  const setType = useCallback((t: PartnerTypeId) => {
    setTypeState(t);
    try {
      const url = new URL(location.href);
      url.searchParams.set("type", t);
      history.replaceState(history.state, "", url);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({ type, setType, bank, setBank, clients, setClients, ref, refName: ref ? (partnerNames[ref]?.name ?? null) : null }),
    [type, setType, bank, clients, ref]
  );
  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}
