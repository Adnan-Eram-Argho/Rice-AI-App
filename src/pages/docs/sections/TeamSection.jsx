import { motion } from "framer-motion";
import { Mail, Globe, Link, Award, Users } from "lucide-react";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Adnan Eram Argho",
      role: "Founder & Lead AI Engineer",
      email: "adnan.argho@example.com",
      github: "https://github.com/Adnan-Eram-Argho",
      linkedin: "https://linkedin.com/in/adnan-argho",
      bio: "AI researcher specializing in computer vision for agriculture. Led development of EfficientNet-B0 + CBAM architecture achieving 94% accuracy. Built complete offline PWA with configuration-driven architecture.",
      image:
        "https://ui-avatars.com/api/?name=Adnan+Eram+Argho&background=16a34a&color=fff&size=256",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Meet the Team
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          A multidisciplinary team combining AI expertise, agricultural science,
          and user-centered design
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Profile Image - Uniform styling */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  // Fallback to UI Avatars if image fails
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=16a34a&color=fff&size=256`;
                }}
              />

              {/* Achievement Badge */}
              <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            {/* Member Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-emerald-600 font-medium mb-3">
                {member.role}
              </p>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                {member.bio}
              </p>

              {/* Contact Links */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Email"
                >
                  <Mail className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="GitHub"
                >
                  <Globe className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="LinkedIn"
                >
                  <Link className="w-4 h-4 text-slate-600" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Stats */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">1</div>
            <p className="text-sm text-slate-700">Core Team Member</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">1</div>
            <p className="text-sm text-slate-700">Expertise Areas</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">2</div>
            <p className="text-sm text-slate-700">Languages Supported</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">∞</div>
            <p className="text-sm text-slate-700">Vision & Passion</p>
          </div>
        </div>
      </div>

      {/* Future Team / Join Us Section */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg border-2 border-dashed border-emerald-300 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Growing Team
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Currently led by founder Adnan Eram Argho, we're actively seeking
            passionate individuals to join our mission.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">
                🤝 Full-Stack Developer
              </h4>
              <p className="text-sm text-slate-700">
                React, PWA, and cloud infrastructure expertise needed for V5+
                features
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">
                🌾 Agricultural Scientist
              </h4>
              <p className="text-sm text-slate-700">
                Plant pathology expert to validate datasets and treatment
                protocols
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">
                🎨 UX/UI Designer
              </h4>
              <p className="text-sm text-slate-700">
                Design intuitive interfaces for rural farmers with low digital
                literacy
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Interested in joining?</strong> Contact us at{" "}
              <a
                href="mailto:adnaneramargho@gmail.com"
                className="underline hover:text-blue-700"
              >
                adnaneramargho@gmail.com
              </a>{" "}
              or visit our{" "}
              <a
                href="https://github.com/Adnan-Eram-Argho/Rice-AI-App"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-700"
              >
                GitHub repository
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Advisors Section
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Academic Advisors</h3>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Sher-e-Bangla Agricultural University (SAU)</h4>
              <p className="text-sm text-slate-600 mb-2">
                Department of Plant Pathology provides expert validation for disease identification and treatment protocols
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Dataset Validation</span>
                <span>•</span>
                <span>Treatment Verification</span>
                <span>•</span>
                <span>Field Testing Support</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
