# NETTO

NETTO è un prototipo web per stimare lo stipendio netto a partire dalla Retribuzione Annua Lorda (RAL).

L'obiettivo è fornire una stima semplice e leggibile del netto e delle principali trattenute fiscali e contributive.

## Funzionalità

L'utente può inserire:

- Retribuzione Annua Lorda (RAL)
- mesi lavorati nell'anno
- numero di mensilità, nel caso di un anno completo

Il calcolatore restituisce:

- netto annuale stimato
- netto medio per mensilità
- contributi INPS
- IRPEF netta
- addizionale regionale Emilia-Romagna
- addizionale comunale di Bologna

## Assunzioni

Il prototipo considera un caso standard:

- dipendente del settore privato
- contratto a tempo indeterminato
- residenza a Bologna, Emilia-Romagna
- nessuna agevolazione fiscale particolare
- contributi previdenziali stimati con aliquota semplificata del 9,19%

Il risultato è una stima indicativa.

Il calcolo reale può variare in base a CCNL, benefit, bonus, situazione personale e familiare, ulteriori redditi, massimali contributivi e altre variabili fiscali.

## Struttura principale

- `app/page.tsx` — logica del calcolatore e interfaccia principale
- `app/globals.css` — stile dell'applicazione
- `app/layout.tsx` — layout generale dell'app

Gli altri file presenti nella repository sono principalmente file di configurazione e dipendenze standard di Next.js.

## Tecnologie

- Next.js
- React
- TypeScript
- CSS

## Demo

https://netto-salary-calculator.vercel.app
