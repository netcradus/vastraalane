const { cleanBrandNames } = require("../utils/brandCleanup");

function isAuthorized(req) {
  const configuredToken = String(process.env.ADMIN_CLEAN_TOKEN || "").trim();
  if (!configuredToken) return true;

  const authHeader = String(req.headers.authorization || "");
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  return token === configuredToken;
}

exports.cleanBrands = async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const summary = await cleanBrandNames({
      batchSize: Math.min(Math.max(Number(req.body?.batchSize || 500), 50), 2000),
      logger: console,
    });

    return res.json({
      message: "Brand cleanup completed",
      summary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Brand cleanup failed" });
  }
};
