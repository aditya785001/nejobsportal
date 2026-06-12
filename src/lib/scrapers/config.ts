/**
 * Configuration for targeted job sites to scrape.
 * Each source defines how to fetch and parse job listings.
 */
export interface ScrapeSource {
  /** Short identifier for the source */
  id: string;
  /** Display name */
  name: string;
  /** Base URL of the site */
  baseUrl: string;
  /** URL template for category listing pages. {page} = page number */
  listingUrl: string;
  /** Selector/strategy to extract post URLs + titles from a listing page */
  strategy: "wordpress-generic";
  /** Whether this source is active */
  enabled: boolean;
}

export const JOB_SOURCES: ScrapeSource[] = [
  {
    id: "jobassam",
    name: "JobAssam.in",
    baseUrl: "https://jobassam.in",
    listingUrl: "https://jobassam.in/category/job/page/{page}/",
    strategy: "wordpress-generic",
    enabled: true,
  },
  // assamcareer.in currently redirects to spam — disabled until it's back
  // {
  //   id: "assamcareer",
  //   name: "AssamCareer.in",
  //   baseUrl: "https://assamcareer.in",
  //   listingUrl: "https://assamcareer.in/category/jobs/page/{page}/",
  //   strategy: "wordpress-generic",
  //   enabled: false,
  // },
];

/** Max age of posts to import during initial load (30 days) */
export const INITIAL_MAX_AGE_DAYS = 30;

/** When doing daily updates, only look at posts this recent */
export const DAILY_WINDOW_HOURS = 24;
