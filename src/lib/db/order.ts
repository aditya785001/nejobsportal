/**
 * Shared ordering helpers to put "expired" posts last across all pillars.
 *
 * Prisma's typed orderBy doesn't support raw CASE expressions, so we use a
 * two-query approach: active (non‑expired) posts first, then expired.
 * Pagination is computed across the combined result set.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type IncludeOf<T> = T extends { include: infer I } ? I : never;

/**
 * Generic two-query helper that returns active posts first, then expired ones.
 * The type parameter lets callers pass `include` and get properly typed results.
 */
async function paginateOrderedExpiredLast<T extends { include?: Record<string, unknown> }>(
  model: {
    count: (args: { where: Record<string, unknown> }) => Promise<number>;
    findMany: (args: T & { where: Record<string, unknown>; orderBy: Record<string, string>; skip: number; take: number }) => Promise<unknown[]>;
  },
  where: Record<string, unknown>,
  skip: number,
  take: number,
  dateField: string,
  expiryThreshold: Date,
  args: T,
): Promise<unknown[]> {
  const activeWhere = { ...where, [dateField]: { gte: expiryThreshold } };
  const expiredWhere = { ...where, [dateField]: { lt: expiryThreshold } };

  const activeCount = await model.count({ where: activeWhere });

  let results: unknown[];
  if (skip < activeCount) {
    const activeTake = Math.min(take, activeCount - skip);
    const active = await model.findMany({
      ...args,
      where: activeWhere,
      orderBy: { [dateField]: "desc" as const },
      skip,
      take: activeTake,
    });

    if (active.length < take) {
      const expired = await model.findMany({
        ...args,
        where: expiredWhere,
        orderBy: { [dateField]: "desc" as const },
        skip: 0,
        take: take - active.length,
      });
      results = [...active, ...expired];
    } else {
      results = active;
    }
  } else {
    results = await model.findMany({
      ...args,
      where: expiredWhere,
      orderBy: { [dateField]: "desc" as const },
      skip: skip - activeCount,
      take,
    });
  }

  return results;
}

// ─── Jobs ─────────────────────────────────────────────────────────────

export async function findJobsOrderedExpiredLast<I extends Prisma.JobPostInclude | undefined = undefined>(
  where: Prisma.JobPostWhereInput,
  skip: number,
  take: number,
  include?: I
): Promise<Prisma.JobPostGetPayload<{ include: I }>[]> {
  return paginateOrderedExpiredLast(
    prisma.jobPost,
    where as Record<string, unknown>,
    skip,
    take,
    "lastDate",
    new Date(),
    { include: include as Record<string, unknown> },
  ) as Promise<Prisma.JobPostGetPayload<{ include: I }>[]>;
}

// ─── Results ───────────────────────────────────────────────────────────

export async function findResultsOrderedExpiredLast<I extends Prisma.ResultPostInclude | undefined = undefined>(
  where: Prisma.ResultPostWhereInput,
  skip: number,
  take: number,
  include?: I
): Promise<Prisma.ResultPostGetPayload<{ include: I }>[]> {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
  return paginateOrderedExpiredLast(
    prisma.resultPost,
    where as Record<string, unknown>,
    skip,
    take,
    "declarationDate",
    threeMonthsAgo,
    { include: include as Record<string, unknown> },
  ) as Promise<Prisma.ResultPostGetPayload<{ include: I }>[]>;
}

// ─── Admissions ────────────────────────────────────────────────────────

export async function findAdmissionsOrderedExpiredLast<I extends Prisma.AdmissionPostInclude | undefined = undefined>(
  where: Prisma.AdmissionPostWhereInput,
  skip: number,
  take: number,
  include?: I
): Promise<Prisma.AdmissionPostGetPayload<{ include: I }>[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);
  return paginateOrderedExpiredLast(
    prisma.admissionPost,
    where as Record<string, unknown>,
    skip,
    take,
    "publishedAt",
    sixMonthsAgo,
    { include: include as Record<string, unknown> },
  ) as Promise<Prisma.AdmissionPostGetPayload<{ include: I }>[]>;
}

// ─── Scholarships ──────────────────────────────────────────────────────

export async function findScholarshipsOrderedExpiredLast<I extends Prisma.ScholarshipPostInclude | undefined = undefined>(
  where: Prisma.ScholarshipPostWhereInput,
  skip: number,
  take: number,
  include?: I
): Promise<Prisma.ScholarshipPostGetPayload<{ include: I }>[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);
  return paginateOrderedExpiredLast(
    prisma.scholarshipPost,
    where as Record<string, unknown>,
    skip,
    take,
    "publishedAt",
    sixMonthsAgo,
    { include: include as Record<string, unknown> },
  ) as Promise<Prisma.ScholarshipPostGetPayload<{ include: I }>[]>;
}
