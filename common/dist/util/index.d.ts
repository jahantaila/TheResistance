export declare class MersenneTwister {
    private N;
    private M;
    private MATRIX_A;
    private UPPER_MASK;
    private LOWER_MASK;
    private mt;
    private mti;
    constructor(seed: number);
    private init_genrand;
    private genrand_int32;
    random(): number;
    randInt(min: number, max?: number): number;
}
export declare function shuffle<T>(arr: T[], seed: number): void;
export declare function nameStr(num: number): string;
export declare function count<T>(arr: T[], val: T): number;
export declare function plural(num: number, text: string, pluralStr?: string): string;
export declare function last<T>(arr: T[]): T | null;
export declare function range(min: number, max?: number): number[];
