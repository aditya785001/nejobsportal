/**
 * Next.js instrumentation hook.
 *
 * `register()` is called once when the server instance starts.
 * We use it to boot the daily auto-digest scheduler.
 */
import { startScheduler } from "@/lib/scheduler";

export function register() {
  startScheduler().catch((err) =>
    console.error("[Instrumentation] Scheduler failed:", err)
  );
}
