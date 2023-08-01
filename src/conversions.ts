const unitConversions = new Map<string, (input: number) => number>();

// temperature
unitConversions.set("c->f", (input) => (input * 9) / 5 + 32);
unitConversions.set("f->c", (input) => ((input - 32) * 5) / 9);

// weight (kg is base): lb, kg, oz, mg, g
const lbFactor = 2.20462;
const ozFactor = 35.274;
const mgFactor = 1000000;
const gFactor = 1000;
unitConversions.set("kg->lb", (input) => input * lbFactor);
unitConversions.set("kg->oz", (input) => input * ozFactor);
unitConversions.set("kg->mg", (input) => input * mgFactor);
unitConversions.set("kg->g", (input) => input * gFactor);

unitConversions.set("lb->kg", (input) => input / lbFactor);
unitConversions.set("lb->oz", (input) => (input / lbFactor) * ozFactor);
unitConversions.set("lb->mg", (input) => (input / lbFactor) * mgFactor);
unitConversions.set("lb->g", (input) => (input / lbFactor) * gFactor);

unitConversions.set("oz->kg", (input) => input / ozFactor);
unitConversions.set("oz->lb", (input) => (input / ozFactor) * lbFactor);
unitConversions.set("oz->mg", (input) => (input / ozFactor) * mgFactor);
unitConversions.set("oz->g", (input) => (input / ozFactor) * gFactor);

unitConversions.set("mg->kg", (input) => input / mgFactor);
unitConversions.set("mg->lb", (input) => (input / mgFactor) * lbFactor);
unitConversions.set("mg->oz", (input) => (input / mgFactor) * ozFactor);
unitConversions.set("mg->g", (input) => (input / mgFactor) * gFactor);

unitConversions.set("g->kg", (input) => input / gFactor);
unitConversions.set("g->lb", (input) => (input / gFactor) * lbFactor);
unitConversions.set("g->oz", (input) => (input / gFactor) * ozFactor);
unitConversions.set("g->mg", (input) => (input / gFactor) * mgFactor);

// length (in is base): in, cm
const cmFactor = 2.54;
unitConversions.set("in->cm", (input) => input * cmFactor);
unitConversions.set("cm->in", (input) => input / cmFactor);

export default unitConversions;
