import { describe, it, expect } from "vitest";
import {
  calculateScore,
  capTotalSkor,
  computeGelar,
  computeGelarInfo,
  canUnlockNext,
} from "@/lib/services/learning";

describe("calculateScore", () => {
  it("memberikan nilai soal jika jawaban benar (case-insensitive)", () => {
    expect(calculateScore("a", "a", 10)).toBe(10);
    expect(calculateScore("b", "B", 20)).toBe(20);
    expect(calculateScore("c", " c ", null)).toBe(10);
  });

  it("memberikan 0 jika jawaban salah", () => {
    expect(calculateScore("a", "b", 10)).toBe(0);
    expect(calculateScore("d", "a", 25)).toBe(0);
  });
});

describe("capTotalSkor", () => {
  it("membatasi skor antara 0 dan 100", () => {
    expect(capTotalSkor(-5)).toBe(0);
    expect(capTotalSkor(0)).toBe(0);
    expect(capTotalSkor(75)).toBe(75);
    expect(capTotalSkor(100)).toBe(100);
    expect(capTotalSkor(150)).toBe(100);
  });
});

describe("computeGelar (termasuk batas 0, 20/21, 40/41, 60/61, 80/81, 100)", () => {
  it("mengembalikan gelar yang sesuai pada setiap batas nilai", () => {
    expect(computeGelar(0)).toBe("Belum Ada Gelar");
    expect(computeGelar(1)).toBe("Pemula Matematika");
    expect(computeGelar(20)).toBe("Pemula Matematika");
    expect(computeGelar(21)).toBe("Penjelajah Angka");
    expect(computeGelar(40)).toBe("Penjelajah Angka");
    expect(computeGelar(41)).toBe("Ahli Hitung Dasar");
    expect(computeGelar(60)).toBe("Ahli Hitung Dasar");
    expect(computeGelar(61)).toBe("Master Operasi Hitung");
    expect(computeGelar(80)).toBe("Master Operasi Hitung");
    expect(computeGelar(81)).toBe("Juara Matematika");
    expect(computeGelar(100)).toBe("Juara Matematika");
    expect(computeGelar(130)).toBe("Juara Matematika");
  });

  it("mengembalikan badge info yang sesuai", () => {
    expect(computeGelarInfo(85)).toEqual({ teks: "Juara Matematika", variant: "warning" });
    expect(computeGelarInfo(0)).toEqual({ teks: "Belum Ada Gelar", variant: "light" });
  });
});

describe("canUnlockNext (PRD 9.1 persentase >= 70%)", () => {
  it("membuka materi berikutnya jika skor >= 70% dari skor maksimum materi", () => {
    expect(canUnlockNext(70, 100)).toBe(true);
    expect(canUnlockNext(35, 50)).toBe(true); // 5 soal x 10 poin = 50, 35/50 = 70%
    expect(canUnlockNext(40, 50)).toBe(true);
  });

  it("menolak unlock jika skor < 70% atau skor maksimum 0", () => {
    expect(canUnlockNext(69, 100)).toBe(false);
    expect(canUnlockNext(30, 50)).toBe(false);
    expect(canUnlockNext(0, 50)).toBe(false);
    expect(canUnlockNext(10, 0)).toBe(false);
  });
});
