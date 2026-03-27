import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function extractAggregateStats() {
  console.log("Extracting aggregate ConduitScore statistics...\n");

  try {
    // Query 1: Overall scan volume and date range
    const scanVolume = await prisma.scan.aggregate({
      where: {
        status: "completed",
        overallScore: { not: null },
      },
      _count: true,
      _min: { createdAt: true },
      _max: { createdAt: true },
    });

    console.log("=== Scan Volume ===");
    console.log(`Total completed scans: ${scanVolume._count}`);
    console.log(
      `Date range: ${scanVolume._min.createdAt?.toISOString().split("T")[0]} to ${scanVolume._max.createdAt?.toISOString().split("T")[0]}`
    );

    // Query 2: Score distribution (overall)
    const allScans = await prisma.scan.findMany({
      where: {
        status: "completed",
        overallScore: { not: null },
      },
      select: {
        overallScore: true,
        createdAt: true,
        user: {
          select: {
            subscriptionTier: true,
          },
        },
      },
    });

    const scores = allScans
      .map((s) => s.overallScore!)
      .filter((s) => s !== null && s !== undefined)
      .sort((a, b) => a - b);

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const medianScore = scores[Math.floor(scores.length / 2)];

    console.log("\n=== Overall Score Distribution ===");
    console.log(`Average score: ${avgScore.toFixed(1)}`);
    console.log(`Median score: ${medianScore}`);
    console.log(
      `Min: ${Math.min(...scores)}, Max: ${Math.max(...scores)}`
    );

    // Query 3: Score by tier
    const byTier: Record<string, number[]> = {};
    allScans.forEach((scan) => {
      const tier = scan.user?.subscriptionTier || "unknown";
      if (!byTier[tier]) byTier[tier] = [];
      if (scan.overallScore !== null && scan.overallScore !== undefined) {
        byTier[tier].push(scan.overallScore);
      }
    });

    console.log("\n=== Scores by Subscription Tier ===");
    Object.entries(byTier).forEach(([tier, tierScores]) => {
      if (tierScores.length > 0) {
        const avg =
          tierScores.reduce((a, b) => a + b, 0) / tierScores.length;
        console.log(
          `${tier} (n=${tierScores.length}): avg=${avg.toFixed(1)}, min=${Math.min(...tierScores)}, max=${Math.max(...tierScores)}`
        );
      }
    });

    // Query 4: Sample size for recent scans (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCount = await prisma.scan.count({
      where: {
        status: "completed",
        overallScore: { not: null },
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    console.log("\n=== Recent Activity (Last 30 days) ===");
    console.log(`Completed scans: ${recentCount}`);

    // Export as JSON for use in PR
    const exportData = {
      extractedAt: new Date().toISOString(),
      totalScans: scanVolume._count,
      dateRange: {
        start: scanVolume._min.createdAt
          ?.toISOString()
          .split("T")[0],
        end: scanVolume._max.createdAt
          ?.toISOString()
          .split("T")[0],
      },
      overallStats: {
        avgScore: parseFloat(avgScore.toFixed(1)),
        medianScore,
        minScore: Math.min(...scores),
        maxScore: Math.max(...scores),
      },
      byTier: Object.entries(byTier).reduce(
        (acc, [tier, tierScores]) => {
          if (tierScores.length > 0) {
            const avg =
              tierScores.reduce((a, b) => a + b, 0) /
              tierScores.length;
            acc[tier] = {
              count: tierScores.length,
              avg: parseFloat(avg.toFixed(1)),
              median: tierScores[Math.floor(tierScores.length / 2)],
              min: Math.min(...tierScores),
              max: Math.max(...tierScores),
            };
          }
          return acc;
        },
        {} as Record<string, any>
      ),
      recentScansLast30Days: recentCount,
    };

    console.log("\n=== JSON Export ===");
    console.log(JSON.stringify(exportData, null, 2));

    // Save to file for reference
    const fs = await import("fs");
    fs.writeFileSync(
      "seo-audit-stats.json",
      JSON.stringify(exportData, null, 2)
    );
    console.log("\nStats saved to seo-audit-stats.json");
  } catch (error) {
    console.error("Error querying database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

extractAggregateStats();
