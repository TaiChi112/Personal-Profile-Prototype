import { source } from "./app/lib/source";

const pageEn = source.getPage(undefined, 'en');
console.log("EN Page:", pageEn ? pageEn.url : null);
