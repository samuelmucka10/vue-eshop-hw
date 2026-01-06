export function stringifyEur(eur) {
    return `${Math.floor(eur/1)}${eur%1==0 ? "" : ","+String(Math.round((eur*100)%100)).padStart(2,"0")} €`;
}