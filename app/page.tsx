"use client";

import { useState } from "react";

export default function HomePage() {
  const [ral, setRal] = useState(30000);
  const [contract, setContract] = useState("indeterminato");
  const [days, setDays] = useState(365);
  const [months, setMonths] = useState(13);

  const [result, setResult] = useState<any>(null);

  function contributiInps(ral: number) {
    return ral * 0.0919;
  }

  function irpefLorda(R: number) {
    if (R <= 28000) {
      return R * 0.23;
    }

    if (R <= 50000) {
      return (R - 28000) * 0.35 + 28000 * 0.23;
    }

    return (
      (R - 50000) * 0.43 +
      (50000 - 28000) * 0.35 +
      28000 * 0.23
    );
  }

  function detrazioneLavoroDipendente(
    R: number,
    G: number,
    contratto: string
  ) {
    let detIrpef = 0;

    if (R <= 15000) {
      detIrpef = (1955 * G) / 365;

      if (contratto === "determinato") {
        detIrpef = Math.max(detIrpef, 1380);
      } else if (contratto === "indeterminato") {
        detIrpef = Math.max(detIrpef, 690);
      }
    } else if (R <= 28000) {
      detIrpef =
        (1910 + (1190 * (28000 - R)) / 13000) *
        (G / 365);

      if (R > 25000) {
        detIrpef += 65;
      }
    } else if (R <= 50000) {
      detIrpef =
        ((1910 * (50000 - R)) / 22000) *
        (G / 365);

      if (R <= 35000) {
        detIrpef += 65;
      }
    }

    return detIrpef;
  }

  function addizionaleRegionaleEmiliaRomagna(R: number) {
    if (R <= 15000) {
      return R * 0.0133;
    }

    if (R <= 28000) {
      return (
        15000 * 0.0133 +
        (R - 15000) * 0.0193
      );
    }

    if (R <= 50000) {
      return (
        15000 * 0.0133 +
        (28000 - 15000) * 0.0193 +
        (R - 28000) * 0.0278
      );
    }

    return (
      15000 * 0.0133 +
      (28000 - 15000) * 0.0193 +
      (50000 - 28000) * 0.0278 +
      (R - 50000) * 0.0333
    );
  }

  function addizionaleComunaleBologna(R: number) {
    if (R <= 15000) {
      return 0;
    }

    return R * 0.008;
  }

  function calculate() {
    const contributi = contributiInps(ral);

    const R = ral - contributi;

    const grossIrpef = irpefLorda(R);

    const detrazione = detrazioneLavoroDipendente(
      R,
      days,
      contract
    );

    const netIrpef = Math.max(
      grossIrpef - detrazione,
      0
    );

    const regionale =
      addizionaleRegionaleEmiliaRomagna(R);

    const comunale =
      addizionaleComunaleBologna(R);

    const nettoAnnuale =
      R -
      netIrpef -
      regionale -
      comunale;

    const nettoMensile =
      nettoAnnuale / months;

    setResult({
      contributi,
      R,
      grossIrpef,
      detrazione,
      netIrpef,
      regionale,
      comunale,
      nettoAnnuale,
      nettoMensile,
    });
  }

  function euro(value: number) {
    return value.toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR",
    });
  }

  return (
    <main>
      <header>
        <strong>NETTO</strong>
        <span>Prototipo · Bologna</span>
      </header>

      <section>
        <div>
          <p>Calcolatore stipendio</p>

          <h1>Quanto vale davvero la tua RAL?</h1>

          <p>
            Ottieni una stima chiara dello stipendio netto e delle principali
            trattenute fiscali e contributive.
          </p>
        </div>

        <form>
          <h2>I tuoi dati</h2>

          <label htmlFor="ral">
            Retribuzione annua lorda (RAL)
          </label>

          <input
            id="ral"
            type="number"
            value={ral}
            onChange={(e) =>
              setRal(Number(e.target.value))
            }
          />

          <label htmlFor="contract">
            Tipo di contratto
          </label>

          <select
            id="contract"
            value={contract}
            onChange={(e) =>
              setContract(e.target.value)
            }
          >
            <option value="indeterminato">
              Tempo indeterminato
            </option>

            <option value="determinato">
              Tempo determinato
            </option>
          </select>

          <label htmlFor="days">
            Giorni lavorati nell’anno
          </label>

          <input
            id="days"
            type="number"
            min="1"
            max="365"
            value={days}
            onChange={(e) =>
              setDays(Number(e.target.value))
            }
          />

          <fieldset>
            <legend>Numero di mensilità</legend>

            {[12, 13, 14].map((number) => (
              <label key={number}>
                <input
                  type="radio"
                  name="months"
                  value={number}
                  checked={months === number}
                  onChange={() => setMonths(number)}
                />
                {number}
              </label>
            ))}
          </fieldset>

          <button
            type="button"
            onClick={calculate}
          >
            Calcola
          </button>
        </form>
      </section>

      {result && (
        <section className="results">
          <div className="result-main">
            <p>Netto annuale stimato</p>

            <h2>
              {euro(result.nettoAnnuale)}
            </h2>

            <p>
              Netto mensile stimato su {months} mensilità
            </p>

            <h3>
              {euro(result.nettoMensile)}
            </h3>
          </div>

          <div className="breakdown">
            <h2>Dettaglio</h2>

            <p>
              <span>RAL</span>
              <strong>{euro(ral)}</strong>
            </p>

            <p>
              <span>Contributi INPS</span>
              <strong>- {euro(result.contributi)}</strong>
            </p>

            <p>
              <span>Imponibile IRPEF</span>
              <strong>{euro(result.R)}</strong>
            </p>

            <p>
              <span>IRPEF lorda</span>
              <strong>{euro(result.grossIrpef)}</strong>
            </p>

            <p>
              <span>Detrazione lavoro dipendente</span>
              <strong>+ {euro(result.detrazione)}</strong>
            </p>

            <p>
              <span>IRPEF netta</span>
              <strong>- {euro(result.netIrpef)}</strong>
            </p>

            <p>
              <span>Addizionale Emilia-Romagna</span>
              <strong>- {euro(result.regionale)}</strong>
            </p>

            <p>
              <span>Addizionale Bologna</span>
              <strong>- {euro(result.comunale)}</strong>
            </p>
          </div>
        </section>
      )}

      <section className="methodology">
        <h2>Metodologia e assunzioni</h2>

        <p>
          Questo calcolatore è un prototipo semplificato e fornisce una stima
          indicativa della retribuzione netta.
        </p>

        <p>
          Il modello assume un dipendente del settore privato residente a
          Bologna, in Emilia-Romagna, senza particolari agevolazioni fiscali.
        </p>

        <p>
          I contributi previdenziali a carico del dipendente sono stimati
          utilizzando un’aliquota semplificata del 9,19%.
        </p>

        <p>
          Il calcolo reale può variare in base a CCNL, settore, benefit,
          ulteriori redditi, situazione personale e familiare, bonus,
          massimali contributivi e altre variabili fiscali.
        </p>
      </section>
    </main>
  );
}