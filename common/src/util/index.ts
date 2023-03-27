// https://gist.github.com/thiloplanz/6abf04f957197e9e3912
export class MersenneTwister {
  private N = 624;
  private M = 397;
  private MATRIX_A = 0x9908b0df;
  private UPPER_MASK = 0x80000000;
  private LOWER_MASK = 0x7fffffff;

  private mt = new Array(this.N);
  private mti = this.N + 1;

  constructor(seed: number) {
    this.init_genrand(seed);
  }

  private init_genrand(s: number) {
    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < this.N; this.mti++) {
      s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
        (s & 0x0000ffff) * 1812433253 +
        this.mti;

      this.mt[this.mti] >>>= 0;
    }
  }

  private genrand_int32() {
    var y;
    var mag01 = new Array(0x0, this.MATRIX_A);

    if (this.mti >= this.N) {
      var kk;

      if (this.mti == this.N + 1) this.init_genrand(5489);

      for (kk = 0; kk < this.N - this.M; kk++) {
        y =
          (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
        this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (; kk < this.N - 1; kk++) {
        y =
          (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
        this.mt[kk] =
          this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y =
        (this.mt[this.N - 1] & this.UPPER_MASK) |
        (this.mt[0] & this.LOWER_MASK);
      this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

      this.mti = 0;
    }

    y = this.mt[this.mti++];

    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  random() {
    return this.genrand_int32() * (1.0 / 4294967296.0);
  }

  randInt(min: number, max?: number) {
    if (!max) {
      max = min;
      min = 0;
    }
    return (this.genrand_int32() % (max - min)) + min;
  }
}

export function shuffle<T>(arr: T[], seed: number) {
  let s: number;
  const rand = new MersenneTwister(seed);
  for (let i = arr.length - 1; i >= 0; i--) {
    s = rand.randInt(i + 1);
    [arr[i], arr[s]] = [arr[s], arr[i]];
  }
}

export function nameStr(num: number) {
  return `{{name:${num}}}`;
}

export function count<T>(arr: T[], val: T) {
  return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
}

export function plural(num: number, text: string, pluralStr?: string) {
  if (!pluralStr) {
    pluralStr = text + "s";
  }
  return num + " " + (num === 1 ? text : pluralStr);
}

export function last<T>(arr: T[]): T | null {
  return arr[arr.length - 1] ?? null;
}

export function range(min: number, max?: number) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Array.from(Array(max - min)).map((_, i) => i + min);
}
