import { motion } from "framer-motion";
import PremiumCard from "../components/ui/PremiumCard";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import {
  FiCode,
  FiActivity,
  FiAlertTriangle,
  FiTrendingUp,
  FiRefreshCw,
  FiDivideSquare,
  FiLock,
  FiFileText,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const HowItWorksPage = () => {
  return (
    <div className="relative overflow-hidden bg-cream">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-plum-coral rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-coral-peach rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div variants={itemVariants} className="inline-block mb-6 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">HOW IT WORKS</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-dark-slate mb-6">
              How APIWatch monitors your APIs
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-slate-600 leading-relaxed">
              A practical guide to how APIWatch monitors endpoints, detects incidents, and keeps your team informed with actionable alerts and performance data.
            </motion.p>
          </motion.div>
        </section>

        {/* Main Flow */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-gold-100 rounded-full">
              <span className="text-sm font-semibold text-gold-600">THE PROCESS</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-12">
              The APIWatch Monitoring Lifecycle
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="space-y-8"
            >
              {[
                {
                  icon: <FiCode size={32} />,
                  step: "1. Monitor Creation",
                  title: "Define Your Endpoints",
                  description:
                    "Start by creating a monitor for your API. Specify the endpoint URL, HTTP method, headers, authentication, and request body. APIWatch supports REST, GraphQL, and SOAP endpoints.",
                  details: [
                    "Add custom headers and authentication",
                    "Test assertions (status code, response body)",
                    "Set check frequency (every 30 seconds to 24 hours)",
                    "Choose monitoring regions",
                  ],
                },
                {
                  icon: <FiRefreshCw size={32} />,
                  step: "2. Health Checks",
                  title: "Continuous Monitoring Begins",
                  description:
                    "From the moment you enable a monitor, APIWatch begins running checks. Distributed agents in 6 regions simultaneously test your API, measuring response time and validating responses.",
                  details: [
                    "Checks run from multiple global regions",
                    "Response time tracking (p50, p95, p99)",
                    "Status code validation",
                    "SSL certificate monitoring",
                    "Real-time status updates",
                  ],
                },
                {
                  icon: <FiActivity size={32} />,
                  step: "3. Data Collection",
                  title: "Metrics & Analysis",
                  description:
                    "Each check generates rich telemetry data: response times, status codes, error messages, and region-specific performance metrics. This data is aggregated in real-time.",
                  details: [
                    "Precise timing for each check",
                    "Region-by-region breakdown",
                    "Historical trend tracking",
                    "Pattern recognition",
                    "Performance baseline establishment",
                  ],
                },
                {
                  icon: <FiAlertTriangle size={32} />,
                  step: "4. Incident Detection",
                  title: "Issue Detection",
                  description:
                    "The platform continuously analyzes metrics against thresholds you define. When anomalies appear — downtime, latency spikes, or error rate increases — incidents are triggered.",
                  details: [
                    "Real-time anomaly detection",
                    "Threshold-based alerting",
                    "Multi-region consensus checking",
                    "Flapping prevention",
                    "Automatic recovery detection",
                  ],
                },
                {
                  icon: <FiAlertTriangle size={32} />,
                  step: "5. Alerting",
                  title: "Instant Notifications",
                  description:
                    "When an incident is detected, alerts are sent to your team through your preferred channels. Alerts include context to speed response.",
                  details: [
                    "Email alerts with full context",
                    "Slack/Teams integrations",
                    "SMS and PagerDuty escalation",
                    "Webhooks for custom workflows",
                    "Alert deduplication and grouping",
                  ],
                },
                {
                  icon: <FiTrendingUp size={32} />,
                  step: "6. Analysis & Reporting",
                  title: "Historical Context",
                  description:
                    "View beautiful dashboards showing uptime trends, performance history, and incident patterns. Generate reports for stakeholders and compliance audits.",
                  details: [
                    "Interactive dashboards",
                    "Monthly uptime reports",
                    "Performance trend analysis",
                    "Incident history timelines",
                    "Export capabilities",
                  ],
                },
              ].map((section, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-8 md:p-12 border border-slate-100 shadow-card"
                >
                  <div className="flex gap-6 mb-8">
                    <div className="flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-plum-coral text-white">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-plum-600 mb-2">{section.step}</p>
                      <h3 className="text-2xl font-bold text-dark-slate mb-3">{section.title}</h3>
                      <p className="text-lg text-slate-600 mb-6">{section.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {section.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="flex gap-3">
                            <span className="text-plum-500 font-bold flex-shrink-0">✓</span>
                            <span className="text-slate-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Key Features Deep Dive */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">CORE CAPABILITIES</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-4">
              Key Features Explained
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-3xl mb-12">
              Deep dive into the features that make APIWatch powerful.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-8"
            >
              {[
                {
                  icon: <FiDivideSquare size={28} />,
                  title: "Response Validation",
                  description: "Validate JSON responses against custom schemas. Test specific fields, array contents, and nested values to ensure your API returns exactly what you expect.",
                },
                {
                  icon: <FiBarChart2 size={28} />,
                  title: "Performance Analytics",
                  description: "Track response times with percentile distributions (p50, p95, p99). Identify performance trends and detect when your API starts degrading.",
                },
                {
                  icon: <FiLock size={28} />,
                  title: "Security Monitoring",
                  description: "Monitor SSL certificates with expiration warnings. Detect suspicious response headers and track security-related events automatically.",
                },
                {
                  icon: <FiFileText size={28} />,
                  title: "Incident Timelines",
                  description: "View detailed incident timelines showing exact timestamps of outages, recovery points, and performance anomalies. Includes contributing factors analysis.",
                },
                {
                  icon: <FiSettings size={28} />,
                  title: "Smart Alerts",
                  description: "Reduce alert fatigue with intelligent routing. Escalate critical issues to PagerDuty, notify teams via Slack, or trigger custom webhooks.",
                },
                {
                  icon: <FiBarChart2 size={28} />,
                  title: "Status Pages",
                  description: "Publish beautiful public status pages to keep customers informed. Automatic updates as incidents are detected and resolved.",
                },
              ].map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <PremiumCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    hover
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Best Practices */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-gold-100 rounded-full">
              <span className="text-sm font-semibold text-gold-600">BEST PRACTICES</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-12">
              Getting the Most Out of APIWatch
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="space-y-6"
            >
              {[
                {
                  title: "Monitor Your Critical Paths",
                  description: "Start by monitoring your most important APIs. Core payment flows, authentication endpoints, and customer-facing features should all have monitors.",
                },
                {
                  title: "Set Realistic Thresholds",
                  description: "Establish baseline performance metrics before setting alert thresholds. A 500ms response time might be normal for complex queries but abnormal for simple reads.",
                },
                {
                  title: "Use Multiple Regions",
                  description: "Monitor from multiple geographic regions to catch regional issues and CDN problems. Ensure latency is acceptable for users worldwide.",
                },
                {
                  title: "Validate Response Content",
                  description: "Don't just check status codes—validate the actual response data. A 200 OK with corrupted data is still a problem.",
                },
                {
                  title: "Integrate with Your Workflow",
                  description: "Connect APIWatch to Slack, PagerDuty, and your other tools. Incidents should flow directly into your incident response process.",
                },
                {
                  title: "Review Incidents Regularly",
                  description: "Schedule weekly reviews of incidents and uptime reports. Use this data to improve your API reliability over time.",
                },
              ].map((practice, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-8 rounded-2xl bg-gradient-to-r from-plum-50 to-coral-50 border border-plum-100"
                >
                  <h3 className="text-xl font-bold text-dark-slate mb-3 flex gap-3 items-center">
                    <span className="text-plum-600 font-bold text-2xl">{idx + 1}</span>
                    {practice.title}
                  </h3>
                  <p className="text-slate-700">{practice.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Technical Details */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">TECHNICAL</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-6">
              Technical Details
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-card">
                <h3 className="text-lg font-bold text-dark-slate mb-4">Check Frequency</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Every 30 seconds (standard)</li>
                  <li>• Every 60 seconds (recommended)</li>
                  <li>• Every 5 minutes (cost-effective)</li>
                  <li>• Custom intervals available</li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-card">
                <h3 className="text-lg font-bold text-dark-slate mb-4">Data Retention</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• 30-day detailed metrics</li>
                  <li>• 1-year summarized data</li>
                  <li>• Lifetime incident history</li>
                  <li>• Export anytime</li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-card">
                <h3 className="text-lg font-bold text-dark-slate mb-4">Availability Details</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Platform availability monitoring</li>
                  <li>• &lt;30s alert delivery</li>
                  <li>• Global redundancy</li>
                  <li>• Automatic failover</li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl bg-gradient-plum-coral text-white p-12 md:p-16 text-center"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Monitoring?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Set up an API monitor in minutes and get practical insight into your system's health.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white text-plum-600 hover:bg-slate-100 w-full sm:w-auto"
                >
                  Create Your Account
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorksPage;
