import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// ── All Google Drive file IDs for APSC papers ──
interface PaperDef {
  fileId: string;
  label: string;
  year: number;
  paper: string;       // "Prelims" | "Mains"
  paperLabel: string;  // e.g. "Paper I", "GS Paper 1", "Essay"
}

const PAPERS: PaperDef[] = [
  // ── PRELIMS ──
  { fileId: "1T_b_0zynIl0ut5WRvIhie1Q62YmX-oFm", label: "APSC Prelims Paper I 2024",   year: 2024, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1PZGDk5J7i_PNs_ZBqtdynUdeCTnUiAdg", label: "APSC Prelims Paper II 2024",  year: 2024, paper: "Prelims", paperLabel: "Paper II" },
  { fileId: "1B2c6fKErcfAMNN1tOlObz90c7Injvb0H", label: "APSC Prelims Paper I 2023",   year: 2023, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1nBpp5OPlqzEKgSv4k3MONGv510JtB45C", label: "APSC Prelims Paper II 2023",  year: 2023, paper: "Prelims", paperLabel: "Paper II" },
  { fileId: "1CQiD5reseVxe1YpLN9lrciYo8fNK5av9", label: "APSC Prelims Paper I 2022",   year: 2022, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "19G9LerJ8yqQ7DWIgK_cCjlgCHltl9-ni", label: "APSC Prelims Paper II 2022",  year: 2022, paper: "Prelims", paperLabel: "Paper II" },
  { fileId: "1u8Lsmyq-nB0uQl9g-TftN0eSut-EDm-g", label: "APSC Prelims Paper I 2020",   year: 2020, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1vm453ZEn-RXTXaop6JL1aF_OhdMRBF6u", label: "APSC Prelims Paper II 2020",  year: 2020, paper: "Prelims", paperLabel: "Paper II" },
  { fileId: "1AHgO1C1pfVvUV-mS6w5jH4wu7p61fUas", label: "APSC Prelims Paper I 2018",   year: 2018, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1CvcDHK1FeoEsIR39AW2m9Ofh7HXdca0g", label: "APSC Prelims Paper I 2016",   year: 2016, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1NsWjRQbriavkhP3u18iRD7sl_GCCADBy", label: "APSC Prelims Paper I 2015",   year: 2015, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1yI2DVssIjVEqvQa6WNtC4egQZ4sJDACO", label: "APSC Prelims Paper I 2014",   year: 2014, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1GBHl6qIp-5AZ6bLHOv1ugprt5GC0kEQj", label: "APSC Prelims Paper I 2013",   year: 2013, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1HWJJJe9Td-3BQ5kj2WJdI0OxPABkfbZm", label: "APSC Prelims Paper I 2011",   year: 2011, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1UZGLhAXB-FadKVp7wNhN-Tp64rn-c0s2", label: "APSC Prelims Paper I 2006",   year: 2006, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "13woJEaNc_1AL0nIiJxd8gE4u6iM7uAe9", label: "APSC Prelims Paper I 2001",   year: 2001, paper: "Prelims", paperLabel: "Paper I" },
  { fileId: "1v-xF08gO92bieAmXpgf1_2HRQC45bbzh", label: "APSC Prelims Paper I 1998",   year: 1998, paper: "Prelims", paperLabel: "Paper I" },

  // ── MAINS 2020 ──
  { fileId: "1fp1dy9DUty4Pi9QPdAbQCW82yTbITYTZ", label: "APSC Mains Essay 2020",       year: 2020, paper: "Mains", paperLabel: "Essay" },
  { fileId: "1wASrH8UTKv7Fu1J4ko_CkoWB75R3LZ4O", label: "APSC Mains GS Paper 1 2020",  year: 2020, paper: "Mains", paperLabel: "GS Paper 1" },
  { fileId: "1ac0CNefzbZmwRxLsQs6UwXQQr3Y1WFvK", label: "APSC Mains GS Paper 2 2020",  year: 2020, paper: "Mains", paperLabel: "GS Paper 2" },
  { fileId: "1iVZV31WFpozx8g3dS3InGdfnd8XsEBbM", label: "APSC Mains GS Paper 3 2020",  year: 2020, paper: "Mains", paperLabel: "GS Paper 3" },
  { fileId: "1ha7vEHVmBmDrbsZtOZL378HwUcR2rbyS", label: "APSC Mains GS Paper 4 2020",  year: 2020, paper: "Mains", paperLabel: "GS Paper 4" },
  { fileId: "1eavOic_zfmhuI0hsU3BQXcesSOzoilgU", label: "APSC Mains GS Paper 5 2020",  year: 2020, paper: "Mains", paperLabel: "GS Paper 5" },

  // ── MAINS 2022 ──
  { fileId: "1So5SHLDawrc6H5s6N4YME7VfErXpdGEG", label: "APSC Mains Essay 2022",       year: 2022, paper: "Mains", paperLabel: "Essay" },
  { fileId: "1JVV2WbcCCg0vXnfR8nNTVErkiRziL6eK", label: "APSC Mains GS Paper 1 2022",  year: 2022, paper: "Mains", paperLabel: "GS Paper 1" },
  { fileId: "1z54zZU6dtuybaUC1Mzlvv2_7XHTnIGzJ", label: "APSC Mains GS Paper 2 2022",  year: 2022, paper: "Mains", paperLabel: "GS Paper 2" },
  { fileId: "1Hhln-4SVHGQ0-cgWimZj_AR5v9Qd8IKE", label: "APSC Mains GS Paper 3 2022",  year: 2022, paper: "Mains", paperLabel: "GS Paper 3" },
  { fileId: "1FTCtnuFbFJdTCOclEBU3GP5qKjz52jKu", label: "APSC Mains GS Paper 4 2022",  year: 2022, paper: "Mains", paperLabel: "GS Paper 4" },
  { fileId: "1y6VDN6NUwZrtrJm6xHku_G1WnBFi5CfT", label: "APSC Mains GS Paper 5 2022",  year: 2022, paper: "Mains", paperLabel: "GS Paper 5" },

  // ── MAINS 2023 ──
  { fileId: "1PKcGUirrHEHFA2dKPvn7-BKDj6tkPtVj", label: "APSC Mains Essay 2023",       year: 2023, paper: "Mains", paperLabel: "Essay" },
  { fileId: "1wC6sRaRxDAXYS0xVZsOXCYhJUCKrO8mj", label: "APSC Mains GS Paper 1 2023",  year: 2023, paper: "Mains", paperLabel: "GS Paper 1" },
  { fileId: "1TcYSJ-2uaSC-btr3vSSX-clYHW_wO0ra", label: "APSC Mains GS Paper 2 2023",  year: 2023, paper: "Mains", paperLabel: "GS Paper 2" },
  { fileId: "1icwsLxnrsfHBTGd05eKGGqYsx5-XGavB", label: "APSC Mains GS Paper 3 2023",  year: 2023, paper: "Mains", paperLabel: "GS Paper 3" },
  { fileId: "1K-sZzgzz-7UrrWS3MfyiMjrRpJZldm3y", label: "APSC Mains GS Paper 4 2023",  year: 2023, paper: "Mains", paperLabel: "GS Paper 4" },
  { fileId: "1fOk5IRcUf0LpK8i4KJJb-W_pR9sNd5et", label: "APSC Mains GS Paper 5 2023",  year: 2023, paper: "Mains", paperLabel: "GS Paper 5" },
];

const DOWNLOAD_DIR = path.resolve(__dirname, "..", "public", "downloads", "apsc-papers");

// Ensure download directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function downloadFile(fileId: string, outputPath: string): boolean {
  try {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    console.log(`  Downloading...`);
    execSync(
      `curl.exe -sL "${url}" -o "${outputPath}" --max-time 120 -A "Mozilla/5.0"`,
      { stdio: "pipe", timeout: 130000 }
    );
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
      const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
      console.log(`  ✓ ${sizeKB} KB`);
      return true;
    }
    console.log(`  ✗ File too small or missing`);
    return false;
  } catch (e) {
    console.log(`  ✗ Error: ${e}`);
    return false;
  }
}

async function main() {
  console.log(`Downloading ${PAPERS.length} APSC question papers...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < PAPERS.length; i++) {
    const p = PAPERS[i];
    const safeName = p.label.replace(/[\/\\?%*:|"<>]/g, "-");
    const outputPath = path.join(DOWNLOAD_DIR, `${safeName}.pdf`);

    // Skip if already downloaded
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
      console.log(`[${i + 1}/${PAPERS.length}] ${p.label} — already exists, skipping`);
      successCount++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${PAPERS.length}] ${p.label}... `);
    const ok = downloadFile(p.fileId, outputPath);
    if (ok) successCount++;
    else failCount++;
  }

  console.log(`\nDone! ${successCount} downloaded, ${failCount} failed.`);
  console.log(`Files saved to: ${DOWNLOAD_DIR}`);
}

main().catch(console.error);
