export const CATEGORY_NAMES = {
  shoes: "Shoes",
  luxuryWatch: "Luxury Watch",
  handbags: "HandBags and Bag",
  shirts: "Shirts & Tshirt",
  sunglasses: "Sunglasses",
  girlsSandals: "Girls Sandals and jutti",
  perfumes: "Perfumes",
  loafers: "Loafers",
  tracksuits: "Cordset & Tracksuit",
  bottomwear: "Jeans & Trouser & Trackpant",
  other: "Other",
};

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/https?:\/\/[^/]+\//g, " ")
    .replace(/footshoppers|cartpe|html|npi\d+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productText(product) {
  return normalizeText(
    [
      product.name,
      product.slug,
      product.productUrl,
      product.description,
      product.brand,
      Array.isArray(product.tags) ? product.tags.join(" ") : product.tags,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

const handbagPriorityPatterns = [
  /\bhandbag\b/,
  /\bhand bag\b/,
  /\bshoulder bag\b/,
  /\btote\b/,
  /\bduffle\b/,
  /\bwallet\b/,
  /\bclutch\b/,
  /\bsling bag\b/,
  /\blaptop bag\b/,
  /\bmessenger bag\b/,
  /\bbackpack\b/,
  /\bcrossbody\b/,
  /\bcross body\b/,
  /\btop handle\b/,
  /\bkeepall\b/,
  /\bspeedy\b/,
  /\bcapucines\b/,
  /\bshopper\b/,
  /\bpolene\b/,
];

const bottomwearPriorityPatterns = [
  /\btrouser\b/,
  /\btrousers\b/,
  /\btrackpant\b/,
  /\btrack pant\b/,
  /\btrack pants\b/,
];

const rules = [
  {
    category: CATEGORY_NAMES.perfumes,
    patterns: [
      /\bperfume\b/,
      /\bfragrance\b/,
      /\bcologne\b/,
      /\bhugo boss\b/,
      /\bedp\b/,
      /\bedt\b/,
      /\beau de\b/,
      /\b100 ?ml\b/,
      /\b90 ?ml\b/,
      /\b75 ?ml\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.tracksuits,
    patterns: [
      /\btracksuit\b/,
      /\btrack suit\b/,
      /\bcordset\b/,
      /\bcord set\b/,
      /\bco ord\b/,
      /\bco ords\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.shoes,
    patterns: [
      /\bsneaker\b/,
      /\bsneakers\b/,
      /\btrainer\b/,
      /\btrainers\b/,
      /\bjordan\b/,
      /\bjorden\b/,
      /\bair force\b/,
      /\bairforce\b/,
      /\bair max\b/,
      /\bairmax\b/,
      /\bair more\b/,
      /\buptempo\b/,
      /\bdunk\b/,
      /\brunner\b/,
      /\brunning\b/,
      /\btraining\b/,
      /\bbasketball\b/,
      /\bfranchise slide\b/,
      /\bmule trainer\b/,
      /\bnikee air\b/,
      /\bnik e air\b/,
      /\byeezy slide\b/,
      /\byeezy slides\b/,
      /\byeezy\b/,
      /\byeezy boost\b/,
      /\byezzy\b/,
      /\badida s yeezy\b/,
      /\baddidas yeezy\b/,
      /\baddidas xlg\b/,
      /\baddida s xlg\b/,
      /\badidas xlg\b/,
      /\bxlg storm edge\b/,
      /\bstorm edge\b/,
      /\bhovr phantom\b/,
      /\bunder armour hovr\b/,
      /\bunde r armour hovr\b/,
      /\bunder armou r hovr\b/,
      /\badiddas edge runner\b/,
      /\baddida s edge\b/,
      /\bnew balancee xc\b/,
      /\bcrocs\b/,
      /\bcroc s\b/,
      /\bcroccs\b/,
      /\bcrocccs\b/,
      /\bcroccss\b/,
      /\bcroc literide\b/,
      /\bcroc sandal\b/,
      /\bclog\b/,
      /\bclogs\b/,
      /\bliteride\b/,
      /\blite ride\b/,
      /\bskechers\b/,
      /\bhyper burst\b/,
      /\baero burst\b/,
      /\bslip ins\b/,
      /\bmax cushion\b/,
      /\bpuma rsx\b/,
      /\bpuma leadcat\b/,
      /\bleadcat\b/,
      /\btoys hot wheels\b/,
      /\bnk calm mule\b/,
      /\bnike calm mule\b/,
      /\bthe north face never stop\b/,
      /\bthe northh face\b/,
      /\bthe nort h face\b/,
      /\bthee north face\b/,
      /\bthe north fac e\b/,
      /\bthe north fac ee\b/,
      /\bugg m tasman\b/,
      /\blouis vuitton miami mule\b/,
      /\blouis vuitton premium luxury quality mule\b/,
      /\bonitsuka tiger .*sabot\b/,
      /\bbalenciaga speed .*mule\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.girlsSandals,
    patterns: [
      /\bpump\b/,
      /\bpumps\b/,
      /\bheel\b/,
      /\bheels\b/,
      /\bhigh heeled\b/,
      /\bmid heel\b/,
      /\bplatform heel\b/,
      /\bwedge\b/,
      /\bespadrille\b/,
      /\bslingback\b/,
      /\bwomens leather mid heel mules\b/,
      /\bwomen.*mules\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.loafers,
    patterns: [
      /\bloafer\b/,
      /\bloafers\b/,
      /\bmocassin\b/,
      /\bmoccasin\b/,
      /\bbabouche\b/,
      /\bsummer walk\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.shirts,
    patterns: [
      /\bt ?shirt\b/,
      /\btshirt\b/,
      /\bpolo\b/,
      /\bcollar neck\b/,
      /\bfull sleeves\b/,
      /\bhalf sleeves\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.girlsSandals,
    patterns: [
      /\bpump\b/,
      /\bpumps\b/,
      /\bheel\b/,
      /\bheels\b/,
      /\bhigh heeled\b/,
      /\bmid heel\b/,
      /\bplatform heel\b/,
      /\bwedge\b/,
      /\bespadrille\b/,
      /\bslingback\b/,
      /\bwomens leather mid heel mules\b/,
      /\bwomen.*mules\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.shoes,
    patterns: [
      /\bsneaker\b/,
      /\bsneakers\b/,
      /\btrainer\b/,
      /\btrainers\b/,
      /\bjordan\b/,
      /\bjorden\b/,
      /\bair force\b/,
      /\bairforce\b/,
      /\bair max\b/,
      /\bairmax\b/,
      /\bdunk\b/,
      /\brunner\b/,
      /\brunning\b/,
      /\btraining\b/,
      /\bbasketball\b/,
      /\bfranchise slide\b/,
      /\bmule trainer\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.girlsSandals,
    patterns: [
      /\bsandal\b/,
      /\bsandals\b/,
      /\bjutti\b/,
      /\bjutti\b/,
      /\bjutti\b/,
      /\bflip flop\b/,
      /\bflipflop\b/,
      /\bslide\b/,
      /\bslides\b/,
      /\bmule\b/,
      /\bmules\b/,
      /\bpump\b/,
      /\bpumps\b/,
      /\bheel\b/,
      /\bheels\b/,
      /\bslingback\b/,
      /\bslipper\b/,
      /\bslippers\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.luxuryWatch,
    patterns: [
      /\bwatch\b/,
      /\bwatches\b/,
      /\bchronograph\b/,
      /\bautomatic\b/,
      /\bskeleton\b/,
      /\bg shock\b/,
      /\bdaytona\b/,
      /\bpatek\b/,
      /\bhublot\b/,
      /\brad o\b/,
      /\brado\b/,
      /\bseiko\b/,
      /\bfossi l\b/,
      /\bfossil\b/,
      /\btag heuer\b/,
      /\bcalibre\b/,
      /\bopen heart\b/,
      /\ball working\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.sunglasses,
    patterns: [
      /\bsunglass\b/,
      /\bsunglasses\b/,
      /\bshade\b/,
      /\bshades\b/,
      /\bshaded\b/,
      /\btom ?ford\b/,
      /\bgucci \d{3,4}\b/,
      /\bmarc jacobs \d{3,4}\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.shirts,
    patterns: [
      /\bt ?shirt\b/,
      /\btshirt\b/,
      /\bshirt\b/,
      /\bpolo\b/,
      /\bcollar neck\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.handbags,
    patterns: handbagPriorityPatterns,
  },
  {
    category: CATEGORY_NAMES.shoes,
    patterns: [
      /\bshoe\b/,
      /\bshoes\b/,
      /\bsneaker\b/,
      /\bsneakers\b/,
      /\btrainer\b/,
      /\btrainers\b/,
      /\bjordan\b/,
      /\bjorden\b/,
      /\bair force\b/,
      /\bairforce\b/,
      /\bair max\b/,
      /\bairmax\b/,
      /\bdunk\b/,
      /\brunner\b/,
      /\brunning\b/,
      /\btraining\b/,
      /\bbasketball\b/,
      /\bonitsuka\b/,
      /\bmexico 66\b/,
      /\bnew balance\b/,
      /\basics?\b/,
      /\basics? s\b/,
      /\basics gel\b/,
      /\basics? gel\b/,
      /\basics?\b/,
      /\breebok\b/,
      /\bpumaa?\b/,
      /\badidas\b/,
      /\bnik e\b/,
      /\bnikee\b/,
      /\bhoka\b/,
      /\bon cloud\b/,
      /\bcloudsurfer\b/,
      /\bvomero\b/,
      /\bblazer\b/,
      /\bpalermo\b/,
    ],
  },
  {
    category: CATEGORY_NAMES.bottomwear,
    patterns: [
      /\bjeans\b/,
    ],
  },
];

export function inferProductCategory(product) {
  const text = productText(product);

  if (hasAny(text, handbagPriorityPatterns)) {
    return CATEGORY_NAMES.handbags;
  }

  if (hasAny(text, bottomwearPriorityPatterns)) {
    return CATEGORY_NAMES.bottomwear;
  }

  const matchedRule = rules.find((rule) => hasAny(text, rule.patterns));

  return matchedRule?.category || CATEGORY_NAMES.other;
}
