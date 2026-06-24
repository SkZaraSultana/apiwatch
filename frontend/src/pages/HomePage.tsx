import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import PremiumCard from "../components/ui/PremiumCard";
import {
  FiMonitor,
  FiAlertCircle,
  FiTrendingUp,
  FiLock,
  FiGlobe,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
  FiCode,
    FiActivity,
  FiBriefcase,
  FiSettings,
  FiCheckSquare,
  FiBook,
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

const floatVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
  animate: {
    y: [0, -20, 0],
    transition: { duration: 3, ease: "easeInOut" as const, repeat: Infinity },
  },
};

const HomePage = () => {
  return (
    <div className="relative overflow-hidden bg-cream">
      {/* Gradient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-plum-coral rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-coral-peach rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500 rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center"
          >
            {/* Left content */}
            <motion.div variants={itemVariants} className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full w-fit"
              >
                <span className="text-sm font-semibold text-plum-600">
                  ✨ Catch API issues before your customers do
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-slate leading-tight mb-4"
              >
                API monitoring designed for modern teams
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-600 mb-5 leading-relaxed max-w-xl"
              >
                Real-time health checks, incident detection, and security intelligence for APIs that support your operations. Get clear uptime visibility, performance insights, and incident context in one dashboard.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 mb-4"
              >
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Create Account <FiArrowRight />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn How It Works
                  </Button>
                </Link>
              </motion.div>

              <motion.p variants={itemVariants} className="text-sm text-slate-500">
                Create an account and start monitoring API health and incidents quickly.
              </motion.p>
            </motion.div>

            {/* Right side - Animated cards */}
            <motion.div variants={floatVariants} className="hidden lg:grid grid-cols-2 gap-6 auto-rows-max">
              {/* Uptime Monitoring */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className="rounded-2xl bg-white shadow-premium p-6 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FiCheckCircle className="text-emerald-600" size={20} />
                  </div>
                  <span className="font-semibold text-dark-slate">Uptime Monitoring</span>
                </div>
                <p className="text-sm text-slate-600">
                  Monitor uptime and response health across your API portfolio.
                </p>
              </motion.div>

              {/* Performance Trends */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
                className="rounded-2xl bg-gradient-plum-coral text-white shadow-premium p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FiTrendingUp size={20} />
                  </div>
                  <span className="font-semibold">Performance Trends</span>
                </div>
                <p className="text-sm text-white/80">
                  Track latency and response patterns over time.
                </p>
              </motion.div>

              {/* Instant Alerts */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
                className="col-span-2 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-premium p-6 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <FiAlertCircle className="text-coral-500" size={20} />
                  </div>
                  <span className="font-semibold text-dark-slate">Instant Alerts</span>
                </div>
                <p className="text-sm text-slate-600">
                  Get notified within seconds of detecting incidents.
                </p>
              </motion.div>
            </motion.div>

            {/* Tablet & Mobile - Stacked */}
            <motion.div variants={containerVariants} className="lg:hidden grid md:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                variants={itemVariants}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className="rounded-2xl bg-white shadow-premium p-6 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FiCheckCircle className="text-emerald-600" size={20} />
                  </div>
                  <span className="font-semibold text-dark-slate">Uptime Monitoring</span>
                </div>
                <p className="text-sm text-slate-600">
                  Monitor uptime and response health across your API portfolio.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
                className="rounded-2xl bg-gradient-plum-coral text-white shadow-premium p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FiTrendingUp size={20} />
                  </div>
                  <span className="font-semibold">Performance Trends</span>
                </div>
                <p className="text-sm text-white/80">
                  Track latency and response patterns over time.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
                className="md:col-span-2 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-premium p-6 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <FiAlertCircle className="text-coral-500" size={20} />
                  </div>
                  <span className="font-semibold text-dark-slate">Instant Alerts</span>
                </div>
                <p className="text-sm text-slate-600">
                  Get notified within seconds of detecting incidents.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-slate-200"
          >
            {[
              { number: "6", label: "Monitoring regions" },
              { number: "24/7", label: "Continuous checks" },
              { number: "API-first", label: "Integration ready" },
              { number: "Live", label: "Performance insight" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-plum-coral mb-2">
                  {stat.number}
                </div>
                <p className="text-sm md:text-base text-slate-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-gold-100 rounded-full">
              <span className="text-sm font-semibold text-gold-600">FEATURES</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-dark-slate mb-4">
              Everything You Need to Monitor APIs
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive monitoring suite designed for modern DevOps teams.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FiMonitor size={28} />,
                title: "Real-Time Monitoring",
                description: "Continuous checks from 6 global regions detect issues before your users do.",
              },
              {
                icon: <FiTrendingUp size={28} />,
                title: "Performance Analytics",
                description: "Track latency, response codes, and performance trends with beautiful dashboards.",
              },
              {
                icon: <FiAlertCircle size={28} />,
                title: "Incident Detection",
                description: "Automatic anomaly detection and smart escalation for critical issues.",
              },
              {
                icon: <FiLock size={28} />,
                title: "Security Intelligence",
                description: "Monitor SSL certificates, detect suspicious patterns, and track security events.",
              },
              {
                icon: <FiGlobe size={28} />,
                title: "Status Pages",
                description: "Beautiful public status pages to keep customers informed in real-time.",
              },
              {
                icon: <FiZap size={28} />,
                title: "Instant Notifications",
                description: "Get alerted via email, SMS, Slack, PagerDuty, and webhooks.",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <PremiumCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  hover
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Preview */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-plum-100 rounded-full">
              <span className="text-sm font-semibold text-plum-600">HOW IT WORKS</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-dark-slate mb-4">
              Simple, Powerful Monitoring
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-2xl mb-12">
              Set up API monitoring in minutes and keep configuration manageable across teams.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Monitors",
                  description: "Add your API endpoints with custom headers, request bodies, and authentication.",
                },
                {
                  step: "02",
                  title: "Configure Alerts",
                  description: "Set thresholds for uptime, latency, and error rates. Route to your team.",
                },
                {
                  step: "03",
                  title: "Monitor & Analyze",
                  description: "Watch real-time data, generate reports, and continuously improve.",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="absolute -top-8 left-0 text-6xl font-bold text-plum-100">
                    {item.step}
                  </div>
                  <div className="pt-8">
                    <h3 className="text-2xl font-bold text-dark-slate mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Built for Every Team Section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-2 bg-coral-100 rounded-full">
              <span className="text-sm font-semibold text-coral-500">FOR EVERY TEAM</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-dark-slate mb-4">
              Built for Every Team
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-3xl mx-auto">
              Whether you're building a startup, managing enterprise services, or learning API development, APIWatch helps you stay informed and in control.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FiCode size={28} />,
                title: "Developers",
                description: "Monitor APIs while building applications and quickly identify issues during development.",
                bgColor: "bg-blue-50",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: <FiActivity size={28} />,
                title: "Startups",
                description: "Ensure reliable services from day one with continuous monitoring and clear performance insights.",
                bgColor: "bg-emerald-50",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
              },
              {
                icon: <FiBriefcase size={28} />,
                title: "Businesses",
                description: "Maintain high service availability for customers by tracking API health and detecting failures early.",
                bgColor: "bg-purple-50",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: <FiSettings size={28} />,
                title: "DevOps Teams",
                description: "Keep production environments stable by monitoring critical endpoints and reviewing operational metrics.",
                bgColor: "bg-orange-50",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
              },
              {
                icon: <FiCheckSquare size={28} />,
                title: "QA & Testing Teams",
                description: "Validate API reliability during testing, deployments, and regression cycles with automated monitoring.",
                bgColor: "bg-rose-50",
                iconBg: "bg-rose-100",
                iconColor: "text-rose-600",
              },
              {
                icon: <FiBook size={28} />,
                title: "Students & Learning",
                description: "Practice real-world API monitoring concepts using an intuitive dashboard designed for learning and experimentation.",
                bgColor: "bg-indigo-50",
                iconBg: "bg-indigo-100",
                iconColor: "text-indigo-600",
              },
            ].map((team, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className={`h-full ${team.bgColor} rounded-2xl shadow-premium p-8 border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                  <div className={`${team.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <div className={team.iconColor}>
                      {team.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-dark-slate mb-3">
                    {team.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {team.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl bg-gradient-plum-coral text-white p-12 md:p-16 text-center"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Monitor with Confidence?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Begin monitoring your APIs with a single platform that combines reliability, alerts, and analytics.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-white text-plum-600 hover:bg-slate-100 w-full sm:w-auto"
                >
                  Create Account
                </Button>
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-white font-semibold transition hover:bg-white/10"
              >
                Learn More →
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
