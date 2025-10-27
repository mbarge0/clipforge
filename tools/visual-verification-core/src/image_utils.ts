// tools/visual-verification-core/src/image_utils.ts
import fs from "fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/**
 * Compares two PNG files and returns a difference ratio (0.0–1.0)
 */
export async function compareImages(pathA: string, pathB: string): Promise<number> {
    if (!fs.existsSync(pathA) || !fs.existsSync(pathB)) return 1;

    const imgA = PNG.sync.read(fs.readFileSync(pathA));
    const imgB = PNG.sync.read(fs.readFileSync(pathB));

    const { width, height } = imgA;
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, width, height, {
        threshold: 0.1,
    });

    return mismatched / (width * height);
}