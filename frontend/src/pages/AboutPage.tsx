import { motion } from "framer-motion";
import PremiumCard from "../components/ui/PremiumCard";
import {
  FiTarget,
  FiEye,
  FiHeart,
  FiServer,
  FiGlobe,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const AboutPage = () => {
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
              <span className="text-sm font-semibold text-plum-600">OUR STORY</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-dark-slate mb-6">
              Built for teams that need predictable API reliability.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-slate-600 mb-8 leading-relaxed">
              APIWatch gives engineering teams a single place to track uptime, detect incidents, and analyze API performance. Replace manual checks and disconnected alerts with a consistent monitoring workflow.
            </motion.p>
          </motion.div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-block mb-4 p-3 bg-plum-100 rounded-lg">
                <FiTarget className="text-plum-600" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-dark-slate mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                To empower engineering teams with clear visibility into API reliability, enabling them to detect and respond to incidents faster. We believe every team deserves monitoring capabilities that are reliable and easy to manage.
              </p>
              <p className="text-slate-600">
                We're committed to making reliability monitoring accessible and easy to use.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="inline-block mb-4 p-3 bg-coral-100 rounded-lg">
                <FiEye className="text-coral-500" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-dark-slate mb-4">Our Vision</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Over time, APIWatch aims to become a trusted monitoring platform for global APIs. We envision a world where reliability is expected, and teams deploy with confidence in their systems.
              </p>
              <p className="text-slate-600">
                We're building the future of API observability—combining simplicity with power.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-gold-100 rounded-full">
              <span className="text-sm font-semibold text-gold-600">CORE VALUES</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-4">
              What We Stand For
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FiHeart size={28} />,
                title: "Reliability First",
                description: "We obsess over uptime because your API's availability affects your business directly. We treat reliability as a feature, not an afterthought.",
              },
              {
                icon: <FiServer size={28} />,
                title: "Developer-Centric",
                description: "Built by developers, for developers. Our platform is intuitive, powerful, and designed with developer experience at its core.",
              },
              {
                icon: <FiGlobe size={28} />,
                title: "Global Coverage",
                description: "Monitoring agents are deployed across multiple regions so you can compare API health from different geographies.",
              },
            ].map((value, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <PremiumCard
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  hover
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Enterprise Architecture */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-12"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">ARCHITECTURE</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-6">
              Built on scalable infrastructure
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-3xl">
              Our platform is architected for scale, reliability, and security. Every component is designed to support a high volume of checks while keeping dashboards responsive.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-card">
              <h3 className="text-2xl font-bold text-dark-slate mb-4">Distributed Network</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex gap-3">
                  <span className="text-plum-500 font-bold">•</span>
                  <span>6 regional check points globally</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-plum-500 font-bold">•</span>
                  <span>30ms average check latency</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-plum-500 font-bold">•</span>
                  <span>Redundant infrastructure across zones</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-plum-500 font-bold">•</span>
                  <span>Redundant availability across multiple regions</span>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-100 shadow-card">
              <h3 className="text-2xl font-bold text-dark-slate mb-4">Security & Compliance</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex gap-3">
                  <span className="text-coral-500 font-bold">•</span>
                  <span>Security controls aligned with enterprise operations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-coral-500 font-bold">•</span>
                  <span>Data protection and audit-ready logging</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-coral-500 font-bold">•</span>
                  <span>Encryption in transit and at rest</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-coral-500 font-bold">•</span>
                  <span>Continuous review of security controls</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </section>

        {/* Monitoring Philosophy */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-gold-100 rounded-full">
              <span className="text-sm font-semibold text-gold-600">PHILOSOPHY</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-6">
              Our Monitoring Philosophy
            </motion.h2>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 md:p-12 border border-slate-100 shadow-card mb-8">
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                We believe that good monitoring isn't just about collecting data—it's about empowering your team to act decisively when things go wrong. Our philosophy is built on three pillars:
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Accuracy",
                    description: "No false alarms. Every alert is carefully curated to be actionable and relevant to your team.",
                  },
                  {
                    title: "Clarity",
                    description: "Complex data visualized simply. Engineers should understand what's happening at a glance.",
                  },
                  {
                    title: "Speed",
                    description: "Detect incidents in seconds, not minutes. The faster you know, the faster you can respond.",
                  },
                ].map((pillar, idx) => (
                  <div key={idx} className="border-l-4 border-plum-500 pl-6">
                    <h4 className="text-lg font-bold text-dark-slate mb-2">{pillar.title}</h4>
                    <p className="text-slate-600">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Technology Stack */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">TECHNOLOGY</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-6">
              Our Technology Stack
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-card">
                <h3 className="text-xl font-bold text-dark-slate mb-6">Backend</h3>
                <div className="space-y-2 text-slate-600">
                  <p><span className="font-semibold">Runtime:</span> Node.js with Express</p>
                  <p><span className="font-semibold">Database:</span> MongoDB (distributed)</p>
                  <p><span className="font-semibold">Queue:</span> Redis for real-time processing</p>
                  <p><span className="font-semibold">Search:</span> Elasticsearch for analytics</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-card">
                <h3 className="text-xl font-bold text-dark-slate mb-6">Frontend</h3>
                <div className="space-y-2 text-slate-600">
                  <p><span className="font-semibold">Framework:</span> React 19 + TypeScript</p>
                  <p><span className="font-semibold">Styling:</span> Tailwind CSS</p>
                  <p><span className="font-semibold">Animations:</span> Framer Motion</p>
                  <p><span className="font-semibold">Charts:</span> Recharts for visualizations</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Global Infrastructure */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-gold-100 rounded-full">
              <span className="text-sm font-semibold text-gold-600">INFRASTRUCTURE</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-6">
              Global Infrastructure
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-3xl mb-12">
              We operate monitoring checkpoints in 6 strategically located regions, enabling us to test your APIs from where your users are.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              {[
                { region: "North America", status: "Primary" },
                { region: "Europe", status: "Primary" },
                { region: "Asia Pacific", status: "Primary" },
                { region: "South America", status: "Secondary" },
                { region: "Middle East", status: "Secondary" },
                { region: "Africa", status: "Planned" },
              ].map((location, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-6 rounded-xl bg-white border border-slate-100 text-center shadow-card"
                >
                  <p className="font-semibold text-dark-slate mb-2">{location.region}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      location.status === "Primary"
                        ? "bg-emerald-100 text-emerald-700"
                        : location.status === "Secondary"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {location.status}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Future Roadmap */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">ROADMAP</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-dark-slate mb-6">
              What's Coming Next
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="space-y-6"
            >
              {[
                {
                  period: "Q1 2026",
                  items: [
                    "AI-powered anomaly detection",
                    "Advanced performance benchmarking",
                    "Custom webhook integrations",
                  ],
                },
                {
                  period: "Q2 2026",
                  items: [
                    "Multi-team collaboration features",
                    "Mobile app launch",
                    "Advanced cost optimization",
                  ],
                },
                {
                  period: "Q3-Q4 2026",
                  items: [
                    "AI incident prediction",
                    "Enterprise SSO (SAML/OAuth)",
                    "API marketplace",
                  ],
                },
              ].map((quarter, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-8 rounded-2xl bg-gradient-to-r from-plum-50 to-coral-50 border border-plum-100"
                >
                  <h3 className="text-xl font-bold text-dark-slate mb-4">{quarter.period}</h3>
                  <ul className="grid md:grid-cols-3 gap-6">
                    {quarter.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex gap-3">
                        <span className="text-plum-600 font-bold">✓</span>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
              Build with APIWatch
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              We are focused on delivering dependable API monitoring and incident visibility that teams can rely on.
            </motion.p>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
