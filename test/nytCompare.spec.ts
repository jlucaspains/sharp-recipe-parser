import { parseIngredient } from "../src/index";
import { parse } from 'csv-parse/sync';
import * as fs from "fs";
import * as path from "path";

describe("Parse ingredient EN", () => {
    const csvFilePath = path.resolve(__dirname, 'nyt-ingredients-snapshot-2015-small.csv');

    const headers = ['index', 'input', 'name', 'qty', 'unit', 'comment'];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const result = parse(fileContent, {
        delimiter: ',',
        columns: headers,
        fromLine: 2,
        cast: true,
    });

    it.each(result as any[])(
        "parse %s",
        (item) => {
            console.log(item);
            const result = parseIngredient(item.input as string, "en");
            console.log(result);
            expect(result?.quantity ?? -1).toBe(item.qty);
            expect(result?.unit ?? -1).toBe(item.unit);
            expect(result?.ingredient ?? -1).toBe(item.name);
        }
    );
}); 