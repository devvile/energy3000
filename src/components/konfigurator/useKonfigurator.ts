"use client";

// Hook stanu konfiguratora: cienka warstwa nad czystą logiką z `@/lib/konfigurator`.
// Komponenty UI dostają gotowe dane (wyliczenie, lista opcji ze statusami) i akcje — same nic nie liczą.

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { LiniaId, OpcjaId, Rozliczenie, RozmiarId } from "@/lib/konfigurator/dane.ts";
import {
  STAN_POCZATKOWY,
  doFormularza,
  dopasujRozmiarDoPv,
  normalizuj,
  odkoduj,
  opcjeDlaStanu,
  polecanyRozmiar,
  przelaczOpcje,
  ustawLinie,
  ustawOpcje,
  ustawPv,
  ustawRozliczenie,
  ustawRozmiar,
  ustawSytuacje,
  wylicz,
  zakoduj,
  type Stan,
  type Sytuacja,
} from "@/lib/konfigurator/logika.ts";

/** Zdarzenie na `window` po każdej zmianie konfiguracji — formularz wyceny dopisuje z niego zestaw do zgłoszenia. */
export const ZDARZENIE_KONFIGURACJI = "e3000:konfiguracja";
export type ZdarzenieKonfiguracji = { kod: string; dane: ReturnType<typeof doFormularza> };

export type Akcja =
  | { typ: "linia"; linia: LiniaId }
  | { typ: "rozmiar"; rozmiar: RozmiarId }
  | { typ: "opcja"; id: OpcjaId; ilosc: number }
  | { typ: "przelacz"; id: OpcjaId }
  | { typ: "rozliczenie"; rozliczenie: Rozliczenie }
  | { typ: "pv"; pvKwp: number | string | null }
  | { typ: "dopasujDoPv" }
  | { typ: "sytuacja"; sytuacja: Sytuacja }
  | { typ: "wczytaj"; stan: Partial<Stan> }
  | { typ: "reset" };

export function reduktor(stan: Stan, a: Akcja): Stan {
  switch (a.typ) {
    case "linia":
      return ustawLinie(stan, a.linia);
    case "rozmiar":
      return ustawRozmiar(stan, a.rozmiar);
    case "opcja":
      return ustawOpcje(stan, a.id, a.ilosc);
    case "przelacz":
      return przelaczOpcje(stan, a.id);
    case "rozliczenie":
      return ustawRozliczenie(stan, a.rozliczenie);
    case "pv":
      return ustawPv(stan, a.pvKwp);
    case "dopasujDoPv":
      return dopasujRozmiarDoPv(stan);
    case "sytuacja":
      return ustawSytuacje(stan, a.sytuacja);
    case "wczytaj":
      return normalizuj({ ...stan, ...a.stan });
    case "reset":
      return STAN_POCZATKOWY;
  }
}

export type Ustawienia = {
  /** Stan startowy (np. z `odkoduj(location.search)` po stronie serwera). */
  poczatkowy?: Partial<Stan>;
  /** Zapisuj konfigurację w adresie strony (`?l=deye&z=m…`), żeby dało się wysłać link. Domyślnie tak. */
  synchronizujUrl?: boolean;
};

export function useKonfigurator({ poczatkowy, synchronizujUrl = true }: Ustawienia = {}) {
  const [stan, dispatch] = useReducer(reduktor, poczatkowy, (p) => normalizuj({ ...STAN_POCZATKOWY, ...p }));

  // Po stronie przeglądarki: jeśli adres niesie konfigurację, wczytaj ją raz na starcie.
  useEffect(() => {
    if (!synchronizujUrl || typeof window === "undefined") return;
    const q = window.location.search;
    if (q.length > 1) dispatch({ typ: "wczytaj", stan: odkoduj(q) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kod = useMemo(() => zakoduj(stan), [stan]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (synchronizujUrl) {
      const url = `${window.location.pathname}?${kod}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", url);
    }
    // Inne części strony (formularz wyceny) nasłuchują, żeby dopisać wybrany zestaw do zgłoszenia.
    // Wysyłka w mikrozadaniu: przy pierwszym renderze słuchacze z dalszych komponentów rejestrują się w tym samym
    // przebiegu efektów, więc wysłane od razu zdarzenie by ich ominęło.
    const detail: ZdarzenieKonfiguracji = { kod, dane: doFormularza(stan) };
    queueMicrotask(() => window.dispatchEvent(new CustomEvent<ZdarzenieKonfiguracji>(ZDARZENIE_KONFIGURACJI, { detail })));
  }, [kod, stan, synchronizujUrl]);

  const wyliczenie = useMemo(() => wylicz(stan), [stan]);
  const opcje = useMemo(() => opcjeDlaStanu(stan), [stan]);
  const polecany = useMemo(() => polecanyRozmiar(stan.linia, stan.pvKwp), [stan.linia, stan.pvKwp]);
  const daneFormularza = useCallback(() => doFormularza(stan), [stan]);

  return {
    stan,
    wyliczenie,
    /** Wszystkie opcje ze statusem (dostępna / w cenie / brak), ceną, limitem i wybraną ilością. */
    opcje,
    /** Rozmiar polecany dla podanej mocy PV (null = za duża instalacja na gotowy zestaw). */
    polecanyRozmiar: polecany,
    /** Kod konfiguracji do linku i do formularza. */
    kod,
    /** Płaskie pola do dopisania do zgłoszenia. */
    daneFormularza,
    dispatch,
    akcje: {
      ustawLinie: (linia: LiniaId) => dispatch({ typ: "linia", linia }),
      ustawRozmiar: (rozmiar: RozmiarId) => dispatch({ typ: "rozmiar", rozmiar }),
      ustawOpcje: (id: OpcjaId, ilosc: number) => dispatch({ typ: "opcja", id, ilosc }),
      przelaczOpcje: (id: OpcjaId) => dispatch({ typ: "przelacz", id }),
      ustawRozliczenie: (rozliczenie: Rozliczenie) => dispatch({ typ: "rozliczenie", rozliczenie }),
      ustawPv: (pvKwp: number | string | null) => dispatch({ typ: "pv", pvKwp }),
      dopasujDoPv: () => dispatch({ typ: "dopasujDoPv" }),
      ustawSytuacje: (sytuacja: Sytuacja) => dispatch({ typ: "sytuacja", sytuacja }),
      reset: () => dispatch({ typ: "reset" }),
    },
  };
}

export type Konfigurator = ReturnType<typeof useKonfigurator>;
