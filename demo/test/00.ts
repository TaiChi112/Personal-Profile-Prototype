// Target
interface IGarbage {
    lightweight(): void;
    smallsize(): void;
}
// Adaptee
class ElectronicWaste {
    constructor(
        public type: string,
        public weightInKg: number,
        public dimensionsInCm: { length: number; width: number; height: number }
    ) { }
    specs(): string {
        return `${this.type} - ${this.weightInKg}kg - ${this.dimensionsInCm.length}x${this.dimensionsInCm.width}x${this.dimensionsInCm.height}cm`;
    }
}
// Adaptee
class PaperWaste {
    constructor(
        public category: string,
        public sheetCount: number,
        public areaInSqCm: number
    ) { }
    details(): string {
        return `${this.category} - ${this.sheetCount} sheets - ${this.areaInSqCm} sq.cm`;
    }
}
// Adapter 
class ElectronicWasteAdapter implements IGarbage {
    constructor(private eWaste: ElectronicWaste) { }
    lightweight(): void {
        console.log(`[Adapter] Electronic Waste Weight: ${this.eWaste.weightInKg} kg`);
    }
    smallsize(): void {
        const volume = this.eWaste.dimensionsInCm.length * this.eWaste.dimensionsInCm.width * this.eWaste.dimensionsInCm.height;
        console.log(`[Adapter] Electronic Waste Volume: ${volume} cubic cm`);
    }
}
class PaperWasteAdapter implements IGarbage {
    constructor(private pWaste: PaperWaste) { }
    lightweight(): void {
        console.log(`[Adapter] Paper Waste Sheets: ${this.pWaste.sheetCount} sheets`);
    }
    smallsize(): void {
        console.log(`[Adapter] Paper Waste Area: ${this.pWaste.areaInSqCm} sq.cm`);
    }
}
// Client
class WasteManagementSystem {
    processGarbage(garbage: IGarbage): void {
        garbage.lightweight();
        garbage.smallsize();
    }
}
// Usage
const rawWastes = [
    new ElectronicWaste("Old Laptop", 2.5, { length: 30, width: 20, height: 3 }),
    new PaperWaste("Newspaper", 100, 2000)
];

console.log("Before Adapter Wased:");
rawWastes.forEach(waste => {
    if (waste instanceof ElectronicWaste) {
        console.log(`Electronic Waste Specs: ${waste.specs()}`);
    }
    if (waste instanceof PaperWaste) {
        console.log(`Paper Waste Details: ${waste.details()}`);
    }
});

const adapters: IGarbage[] = [
    new ElectronicWasteAdapter(rawWastes[0] as ElectronicWaste),
    new PaperWasteAdapter(rawWastes[1] as PaperWaste)
];

const wasteSystem = new WasteManagementSystem();
adapters.forEach(adapter => {
    console.log("\nProcessing new waste item:");
    wasteSystem.processGarbage(adapter);
});

interface ISeparationStrategy {
    separate(garbage: IGarbage): IGarbage[];
}

class SmallSeparationStrategy implements ISeparationStrategy {
    separate(garbage: IGarbage): IGarbage[] {
        console.log("[Strategy] Separating small items...");
        // Logic to separate small items (mocked)
        return [garbage]; // In real case, would return multiple small items
    }
}
class LightSeparationStrategy implements ISeparationStrategy {
    separate(garbage: IGarbage): IGarbage[] {
        console.log("[Strategy] Separating lightweight items...");
        // Logic to separate lightweight items (mocked)
        return [garbage]; // In real case, would return multiple lightweight items
    }
}