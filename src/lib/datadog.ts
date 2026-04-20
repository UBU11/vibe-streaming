/**
 * Datadog initialization helpers
 *
 * RUM (Real User Monitoring) is injected via a Script component
 * in the root layout. This module exports configuration helpers.
 *
 * APM tracing (dd-trace) should be initialized at the top of
 * next.config.ts or via a Node.js --require flag in production.
 */

export const datadogConfig = {
  applicationId: process.env.DATADOG_APPLICATION_ID ?? "",
  clientToken: process.env.DATADOG_CLIENT_TOKEN ?? "",
  site: "datadoghq.com",
  service: "vibe-streaming",
  env: process.env.NODE_ENV ?? "development",
  version: "1.0.0",
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input" as const,
};

/**
 * Generate the Datadog RUM initialization script
 * This is injected as an inline script in the root layout
 */
export function getDatadogRumScript(): string {
  const isPlaceholder = (val: string) =>
    !val || val.startsWith("your-") || val.length < 10;

  if (
    isPlaceholder(datadogConfig.applicationId) ||
    isPlaceholder(datadogConfig.clientToken)
  ) {
    return "// Datadog RUM: No valid credentials configured — skipping initialization";
  }

  return `
    (function(h,o,u,n,d) {
      h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
      d=o.createElement(u);d.async=1;d.src=n
      n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
    })(window,document,'script','https://www.datadoghq-browser-agent.com/us1/v5/datadog-rum.js','DD_RUM')
    window.DD_RUM.onReady(function() {
      window.DD_RUM.init({
        clientToken: '${datadogConfig.clientToken}',
        applicationId: '${datadogConfig.applicationId}',
        site: '${datadogConfig.site}',
        service: '${datadogConfig.service}',
        env: '${datadogConfig.env}',
        version: '${datadogConfig.version}',
        sessionSampleRate: ${datadogConfig.sessionSampleRate},
        sessionReplaySampleRate: ${datadogConfig.sessionReplaySampleRate},
        trackUserInteractions: ${datadogConfig.trackUserInteractions},
        trackResources: ${datadogConfig.trackResources},
        trackLongTasks: ${datadogConfig.trackLongTasks},
        defaultPrivacyLevel: '${datadogConfig.defaultPrivacyLevel}',
      });
    })
  `;
}
