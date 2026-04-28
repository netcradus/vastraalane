const BRAND_ALIASES = [
  ["nike", ["nike", "nikee", "nik3", "nik e", "n1ke"]],
  ["adidas", ["adidas", "addidas", "adidaas", "adiddas", "adida s"]],
  ["gucci", ["gucci", "gucc", "guc ci", "guccl"]],
  ["rolex", ["rolex", "rollex", "rolexx", "role x", "r0lex"]],
  ["louisvuitton", ["louis vuitton", "louisvuitton", "lv", "louis vitton", "louis vuiton"]],
  ["coach", ["coach"]],
  ["dolcegabbana", ["dolce gabbana", "dolcegabbana", "dolcen gabban", "d g", "dg"]],
  ["birkenstock", ["birkenstock", "birken stock"]],
  ["toryburch", ["tory burch", "toryburch"]],
  ["celine", ["celine", "celine clemence", "clemence"]],
  ["michaelkors", ["michael kors", "michaelkors", "mk"]],
  ["christianlouboutin", ["christian louboutin", "louboutin", "loubitin"]],
  ["loropiana", ["loro piana", "loro piano", "loropiana"]],
  ["tissot", ["tissot", "tisso t"]],
  ["carrera", ["carrera"]],
  ["zara", ["zara", "zar hs"]],
  ["audemarspiguet", ["audemars piguet", "audemar piguet", "ap"]],
  ["bvlgari", ["bvlgari", "bulgari"]],
  ["fendi", ["fendi", "fen di"]],
  ["fragment", ["fragment", "frag ment"]],
  ["union", ["union", "union la"]],
  ["prada", ["prada", "prad4"]],
  ["versace", ["versace", "versa ce", "versacce"]],
  ["tommyhilfiger", ["tommy hilfiger", "tommy", "hilfiger"]],
  ["hugo boss", ["hugo boss", "hugo", "boss"]],
  ["balenciaga", ["balenciaga", "balenciagaa"]],
  ["puma", ["puma", "pumaa"]],
  ["jordan", ["jordan", "jorden"]],
  ["newbalance", ["new balance", "newbalance", "new balanc", "newbalnce"]],
  ["skechers", ["skechers", "skecher", "sketchers"]],
  ["crocs", ["crocs", "crocs", "croccs", "croccss", "croc s"]],
  ["onitsuka", ["onitsuka", "onitsuka tiger"]],
  ["ugg", ["ugg", "uggg"]],
  ["fossil", ["fossil", "fossi l"]],
  ["rado", ["rado", "rad o"]],
  ["seiko", ["seiko"]],
  ["hublot", ["hublot"]],
  ["patekphilippe", ["patek philippe", "patek", "philippe"]],
  ["tagheuer", ["tag heuer", "tagheuer"]],
  ["cartier", ["cartier"]],
  ["burberry", ["burberry"]],
  ["chanel", ["chanel", "channel"]],
  ["dior", ["dior"]],
  ["hermes", ["hermes"]],
  ["ysl", ["ysl", "ysl saint laurent", "saint laurent"]],
  ["armani", ["armani", "giorgio armani"]],
];

const GENERIC_PATTERNS = [
  { generic: "running shoes", patterns: [/\brunning shoes?\b/, /\brunning\b/] },
  { generic: "track pants", patterns: [/\btrack pants?\b/, /\btrackpant\b/] },
  { generic: "trousers", patterns: [/\btrousers?\b/, /\btrouser\b/] },
  { generic: "jeans", patterns: [/\bjeans\b/] },
  { generic: "t-shirt", patterns: [/\bt ?shirts?\b/, /\btshirt\b/] },
  { generic: "shirt", patterns: [/\bshirts?\b/, /\bpolo\b/] },
  { generic: "handbag", patterns: [/\bhand ?bags?\b/, /\bshoulder bag\b/, /\bcrossbody\b/, /\bcross body\b/] },
  { generic: "sling bag", patterns: [/\bsling bag\b/, /\bsling\b/] },
  { generic: "wallet", patterns: [/\bwallet\b/] },
  { generic: "sunglasses", patterns: [/\bsunglasses?\b/, /\bshades?\b/] },
  { generic: "sunglasses", patterns: [/\bsunglas\b/, /\bsunglases\b/, /\beyewear\b/] },
  { generic: "watch", patterns: [/\bwatches?\b/, /\bwatch\b/, /\bchronograph\b/, /\bquartz\b/, /\broyal oak\b/] },
  { generic: "perfume", patterns: [/\bperfumes?\b/, /\bfragrance\b/, /\bcologne\b/, /\bedp\b/, /\bedt\b/] },
  { generic: "sandals", patterns: [/\bsandals?\b/, /\bjutti\b/, /\bchappal\b/] },
  { generic: "flip flops", patterns: [/\bflip flops?\b/, /\bslides?\b/, /\bcrocs\b/, /\bclogs?\b/] },
  { generic: "loafers", patterns: [/\bloafers?\b/, /\bmoccasin\b/, /\bmocassin\b/] },
  { generic: "mules", patterns: [/\bmules?\b/, /\bmule\b/] },
  { generic: "sneakers", patterns: [/\bsneakers?\b/, /\btrainer\b/, /\btrainers\b/, /\bshoe\b/, /\bshoes\b/, /\bsock donna\b/] },
  { generic: "tracksuit", patterns: [/\btracksuits?\b/, /\btrack suit\b/, /\bcordset\b/, /\bcord set\b/] },
  { generic: "handbag", patterns: [/\bbags?\b/, /\bpochette\b/, /\bpochete\b/] },
];

const CATEGORY_FALLBACKS = [
  { match: /\bwatch|luxury watch\b/, generic: "watch" },
  { match: /\bshoe|loafer|sandal|jutti|crocs|flipflop|slipper|mule\b/, generic: "footwear" },
  { match: /\bbag|wallet|sunglasses|handbags and bag\b/, generic: "accessory" },
  { match: /\bperfume|fragrance\b/, generic: "perfume" },
  { match: /\bshirt|tshirt|tracksuit|jeans|trouser|trackpant\b/, generic: "apparel" },
];

function inferCategorySpecificGeneric(name = "", category = "") {
  const source = String(name || "").toLowerCase();
  const normalizedCategory = String(category || "").toLowerCase();

  if (normalizedCategory.includes("flipflops/crocs")) {
    if (/\b(crocs|croc s|croccs|crocccs|croccss|clog|clogs|literide|lite ride|bayaband|echo|mega crush)\b/.test(source)) {
      return "crocs";
    }

    if (/\b(slide|slides|flip flop|flip flops|slipper|slippers)\b/.test(source)) {
      return "flip flops";
    }

    return "crocs";
  }

  if (normalizedCategory.includes("loafers")) {
    return "loafers";
  }

  if (normalizedCategory.includes("cordset") || normalizedCategory.includes("tracksuit")) {
    if (/\b(tracksuit|track suit)\b/.test(source)) {
      return "tracksuit";
    }

    if (/\b(cordset|cord set|co ord|co ords|co-ord)\b/.test(source)) {
      return "cordset";
    }

    return "tracksuit";
  }

  if (normalizedCategory.includes("jeans") || normalizedCategory.includes("trouser") || normalizedCategory.includes("trackpant")) {
    if (/\b(trackpant|track pant|track pants|lowers)\b/.test(source)) {
      return "track pants";
    }

    if (/\btrouser|trousers\b/.test(source)) {
      return "trousers";
    }

    if (/\bjeans?\b/.test(source)) {
      return "jeans";
    }

    return "track pants";
  }

  return "";
}

function normalizeLeetspeak(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/[@$]/g, "a");
}

function canonicalize(value = "") {
  return normalizeLeetspeak(value)
    .replace(/[^a-z]+/g, "")
    .replace(/(.)\1{2,}/g, "$1$1")
    .trim();
}

function levenshtein(a = "", b = "") {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) table[row][0] = row;
  for (let col = 0; col < cols; col += 1) table[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      table[row][col] = Math.min(
        table[row - 1][col] + 1,
        table[row][col - 1] + 1,
        table[row - 1][col - 1] + cost
      );
    }
  }

  return table[rows - 1][cols - 1];
}

function looksLikeBrand(span = "") {
  const candidate = canonicalize(span);
  if (!candidate || candidate.length < 2) return false;

  return BRAND_ALIASES.some(([brand, aliases]) => {
    const knownForms = [brand, ...aliases].map(canonicalize).filter(Boolean);

    return knownForms.some((form) => {
      if (!form) return false;
      if (candidate === form) return true;
      if (candidate.includes(form) || form.includes(candidate)) {
        return Math.min(candidate.length, form.length) >= 2;
      }

      const distance = levenshtein(candidate, form);
      if (Math.max(candidate.length, form.length) <= 5) {
        return distance <= 1;
      }

      return distance <= 2;
    });
  });
}

function inferGenericName(name = "", category = "") {
  const categorySpecificGeneric = inferCategorySpecificGeneric(name, category);
  if (categorySpecificGeneric) return categorySpecificGeneric;

  const source = `${name} ${category}`.toLowerCase();
  const directMatch = GENERIC_PATTERNS.find((entry) => entry.patterns.some((pattern) => pattern.test(source)));
  if (directMatch) return directMatch.generic;

  const categoryMatch = CATEGORY_FALLBACKS.find((entry) => entry.match.test(String(category || "").toLowerCase()));
  return categoryMatch?.generic || "accessory";
}

function findBrandSpan(name = "") {
  const tokenPattern = /[A-Za-z0-9]+(?:[._!'-][A-Za-z0-9]+)*/g;
  const tokens = [...String(name).matchAll(tokenPattern)].map((match) => ({
    value: match[0],
    start: match.index,
    end: (match.index || 0) + match[0].length,
  }));

  let bestMatch = null;

  for (let start = 0; start < tokens.length; start += 1) {
    for (let width = 3; width >= 1; width -= 1) {
      const endIndex = start + width - 1;
      if (!tokens[endIndex]) continue;

      const spanStart = tokens[start].start;
      const spanEnd = tokens[endIndex].end;
      const spanText = String(name).slice(spanStart, spanEnd);

      if (!looksLikeBrand(spanText)) {
        continue;
      }

      const score = width * 100 - start;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { start: spanStart, end: spanEnd, score };
      }
    }
  }

  return bestMatch;
}

function normalizeSpacing(value = "") {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.)])/g, "$1")
    .replace(/([(])\s+/g, "$1")
    .trim();
}

function canonicalPhrase(value = "") {
  return canonicalize(String(value).replace(/\s+/g, ""));
}

function buildGenericVariants(genericName = "") {
  const base = normalizeSpacing(genericName);
  const variants = new Set([canonicalPhrase(base)]);

  if (base.endsWith("s")) {
    variants.add(canonicalPhrase(base.slice(0, -1)));
  } else {
    variants.add(canonicalPhrase(`${base}s`));
  }

  if (base.includes(" ")) {
    variants.add(canonicalPhrase(base.replace(/\s+/g, "")));
  }

  return variants;
}

export function normalizeCatalogProductName(name = "", category = "") {
  const sourceName = String(name || "").trim();
  if (!sourceName) {
    return sourceName;
  }

  const genericName = inferGenericName(sourceName, category);
  const brandSpan = findBrandSpan(sourceName);

  if (!brandSpan) {
    return normalizeSpacing(sourceName);
  }

  const before = sourceName.slice(0, brandSpan.start).trimEnd();
  const after = sourceName.slice(brandSpan.end).trimStart();
  const genericVariants = buildGenericVariants(genericName);

  if (!after) {
    return genericName;
  }

  const afterCanonical = canonicalPhrase(after);
  if ([...genericVariants].some((variant) => variant && afterCanonical.startsWith(variant))) {
    return normalizeSpacing(`${before} ${after}`);
  }

  return normalizeSpacing(`${before} ${genericName} ${after}`);
}
