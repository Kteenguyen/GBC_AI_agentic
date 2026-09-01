import React from 'react';

// 1. Developer / Coder Icon (Crisp High-Fidelity IDE Screen)
export const DeveloperLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="28" height="22" rx="4" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M2 9.5H30" stroke="#334155" strokeWidth="1.5" />
    {/* Mac OS Window Dots */}
    <circle cx="6" cy="6.8" r="1.3" fill="#EF4444" />
    <circle cx="10" cy="6.8" r="1.3" fill="#F59E0B" />
    <circle cx="14" cy="6.8" r="1.3" fill="#10B981" />
    {/* Code Brackets </> */}
    <path d="M10 14.5L6.5 18L10 21.5" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 14.5L25.5 18L22 21.5" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.5 13.5L14.5 22.5" stroke="#A855F7" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="11" y="27" width="10" height="2" rx="1" fill="#64748B" />
  </svg>
);

// 2. Official GitHub Logo (High-contrast Invertocat)
export const GitHubLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#181717" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#FFFFFF" />
  </svg>
);

// 3. Official Jenkins Logo (Authentic Butler with Hat & Red Bowtie)
export const JenkinsLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="16" cy="16" r="15" fill="#F4F2ED" stroke="#D33833" strokeWidth="1.5" />
    {/* Hat */}
    <path d="M10 9C11 6 13 5 16 5C19 5 21 6 22 9L23.5 10H8.5L10 9Z" fill="#383D45" />
    <ellipse cx="16" cy="10" rx="8" ry="1.5" fill="#D33833" />
    {/* Head */}
    <circle cx="16" cy="14" r="5" fill="#FCE1C2" />
    {/* Hair */}
    <path d="M11.5 12C11 14 11 16 12 17C12.5 15.5 13 14 13.5 13" stroke="#D8C2A7" strokeWidth="1" strokeLinecap="round" />
    <path d="M20.5 12C21 14 21 16 20 17C19.5 15.5 19 14 18.5 13" stroke="#D8C2A7" strokeWidth="1" strokeLinecap="round" />
    {/* Eyes & Mustache */}
    <circle cx="14.2" cy="13.5" r="0.8" fill="#24292E" />
    <circle cx="17.8" cy="13.5" r="0.8" fill="#24292E" />
    <path d="M14 16C15 16.8 17 16.8 18 16" stroke="#9E7A56" strokeWidth="1" strokeLinecap="round" />
    {/* Tuxedo Body */}
    <path d="M8 26C9 20 12 19 16 19C20 19 23 20 24 26H8Z" fill="#24292E" />
    {/* White Shirt Collar */}
    <path d="M13.5 19L16 23L18.5 19H13.5Z" fill="#FFFFFF" />
    {/* Red Bowtie */}
    <path d="M13.5 20L16 21.2L18.5 20L17.5 22.5L16 21.8L14.5 22.5L13.5 20Z" fill="#D33833" />
    <circle cx="16" cy="21.2" r="0.8" fill="#B02520" />
  </svg>
);

// 4. Official OWASP Logo (Security Shield with Check)
export const OwaspLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0B132B" stroke="#00A1DF" strokeWidth="1.5" />
    {/* Shield */}
    <path d="M16 5L24 9V16C24 21.5 20.5 25.5 16 27C11.5 25.5 8 21.5 8 16V9L16 5Z" fill="url(#owaspGrad)" stroke="#00E5FF" strokeWidth="1.5" />
    {/* Checkmark */}
    <path d="M12 16L15 19L20 13" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="owaspGrad" x1="8" y1="5" x2="24" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0077B6" />
        <stop offset="1" stopColor="#00B4D8" />
      </linearGradient>
    </defs>
  </svg>
);

// 5. Official SonarQube Logo (Vibrant Tri-Color Waves)
export const SonarQubeLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
    {/* Tri-color Waves */}
    <path d="M7 23C10 18 15 14 23 15" stroke="#4B9FD5" strokeWidth="3" strokeLinecap="round" />
    <path d="M9 25C13 21 18 19 25 21" stroke="#CB3837" strokeWidth="3" strokeLinecap="round" />
    <path d="M11 17C14 13 18 11 24 11" stroke="#56B685" strokeWidth="3" strokeLinecap="round" />
    <circle cx="7" cy="23" r="2" fill="#4B9FD5" />
    <circle cx="9" cy="25" r="2" fill="#CB3837" />
    <circle cx="11" cy="17" r="2" fill="#56B685" />
  </svg>
);

// 6. Official Trivy Logo (Aqua Security Hexagon Target)
export const TrivyLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0B132B" stroke="#1395BA" strokeWidth="1.5" />
    {/* Hexagon Shield */}
    <polygon points="16 6 26 11.5 26 22.5 16 28 6 22.5 6 11.5" fill="#1395BA" fillOpacity="0.2" stroke="#00FFFF" strokeWidth="1.8" />
    {/* Target Reticle */}
    <circle cx="16" cy="16" r="5" stroke="#00FFFF" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="2" fill="#00FFFF" />
    <line x1="16" y1="8" x2="16" y2="11" stroke="#00FFFF" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="16" y1="21" x2="16" y2="24" stroke="#00FFFF" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="8" y1="16" x2="11" y2="16" stroke="#00FFFF" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="21" y1="16" x2="24" y2="16" stroke="#00FFFF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 7. Official Docker Logo (Blue Whale with Cargo Containers)
export const DockerLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
    {/* Whale Body */}
    <path d="M28 17C27.2 15.5 25.5 15 24.5 15C24.2 13 22.5 11.8 20.8 11.8H19.8V15H16.8V12.5H14.2V15H11.6V12.5H9V15H6.4V12.5H3.8V15H2.5C1.5 15 .6 15.8.6 16.8C.6 22 5 25 12 25C21 25 27 21 28 17Z" fill="#2496ED" />
    {/* Containers */}
    <rect x="6.8" y="12.8" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="9.4" y="12.8" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="12" y="12.8" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="14.6" y="12.8" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="9.4" y="10.2" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="12" y="10.2" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="14.6" y="10.2" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    <rect x="12" y="7.6" width="2" height="2" fill="#0284C7" stroke="#FFF" strokeWidth="0.4" rx="0.3" />
    {/* Whale Eye */}
    <circle cx="24" cy="18" r="0.9" fill="#FFFFFF" />
  </svg>
);

// 8. Official ArgoCD Logo (Mascot Robot with Tentacles)
export const ArgoCDLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#FFF5F1" stroke="#EF6B48" strokeWidth="1.5" />
    {/* Mascot Head */}
    <circle cx="16" cy="13" r="6" fill="#EF6B48" />
    {/* Eyes */}
    <ellipse cx="13.5" cy="12.5" rx="1.5" ry="2" fill="#FFFFFF" />
    <ellipse cx="18.5" cy="12.5" rx="1.5" ry="2" fill="#FFFFFF" />
    <circle cx="13.5" cy="12.5" r="0.8" fill="#1E293B" />
    <circle cx="18.5" cy="12.5" r="0.8" fill="#1E293B" />
    {/* Tentacles */}
    <path d="M10 18C10 21 12 23 13.5 21C14.5 19.5 15.5 22 17 21C18.5 19.5 19.5 22 21 20C22 19 22.5 18 23 17" stroke="#EF6B48" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 9. Official Kubernetes Logo (Royal Blue Ship Wheel)
export const KubernetesLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#326CE5" />
    {/* Outer Wheel */}
    <polygon points="16 5 25.5 9.5 28 20 21 27 11 27 4 20 6.5 9.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
    {/* Spokes & Hub */}
    <circle cx="16" cy="16" r="3.5" fill="#326CE5" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="16" y1="5" x2="16" y2="12.5" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="25.5" y1="9.5" x2="19" y2="14" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="28" y1="20" x2="19.5" y2="17" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="21" y1="27" x2="17.5" y2="19.5" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="11" y1="27" x2="14.5" y2="19.5" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="4" y1="20" x2="12.5" y2="17" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="6.5" y1="9.5" x2="13" y2="14" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

// 10. Live App Logo (Web Application Browser Window)
export const MyAppLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
    <rect x="6" y="8" width="20" height="16" rx="3" fill="#064E3B" stroke="#10B981" strokeWidth="1.2" />
    <circle cx="9.5" cy="11.5" r="1" fill="#EF4444" />
    <circle cx="12.5" cy="11.5" r="1" fill="#F59E0B" />
    <circle cx="15.5" cy="11.5" r="1" fill="#10B981" />
    <path d="M10 18L13 21L21 13" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 11. Official Prometheus Logo (Flame Torch)
export const PrometheusLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#FFF1EE" stroke="#E6522C" strokeWidth="1.5" />
    {/* Torch Base */}
    <path d="M12 24H20L18.5 21H13.5L12 24Z" fill="#383D45" />
    <path d="M13.5 21H18.5V17H13.5V21Z" fill="#E6522C" />
    {/* Flame */}
    <path d="M16 6C16 6 12 11 12 14.5C12 16.5 13.5 18 16 18C18.5 18 20 16.5 20 14.5C20 11 16 6 16 6Z" fill="#E6522C" />
    <path d="M16 10C16 10 14 13 14 15C14 16 15 17 16 17C17 17 18 16 18 15C18 13 16 10 16 10Z" fill="#FBBF24" />
  </svg>
);

// 12. Official Grafana Logo (Orange Curved Graph Swirl)
export const GrafanaLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#FFF7ED" stroke="#F46800" strokeWidth="1.5" />
    {/* Grafana Swirl */}
    <path d="M16 7C21 7 25 11 25 16C25 21 21 25 16 25C11 25 7 21 7 16C7 13.5 8 11.2 9.8 9.8" stroke="#F46800" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 11C18.8 11 21 13.2 21 16C21 18.8 18.8 21 16 21C13.2 21 11 18.8 11 16" stroke="#F46800" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="16" r="2.5" fill="#F46800" />
    <circle cx="23" cy="11" r="1.5" fill="#F59E0B" />
    <circle cx="21" cy="22" r="1.5" fill="#F59E0B" />
  </svg>
);

// 13. Official Gmail Logo (Google 4-Color Envelope)
export const GmailLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#EA4335" strokeWidth="1.5" />
    {/* Gmail M Shapes */}
    <path d="M7 11V22C7 22.5 7.5 23 8 23H10V14.5L16 19L22 14.5V23H24C24.5 23 25 22.5 25 22V11C25 10.2 24.1 9.8 23.5 10.3L16 16L8.5 10.3C7.9 9.8 7 10.2 7 11Z" fill="#EA4335" />
    <path d="M7 11V22C7 22.5 7.5 23 8 23H10V14.5L7 12V11Z" fill="#4285F4" />
    <path d="M25 11V22C25 22.5 24.5 23 24 23H22V14.5L25 12V11Z" fill="#34A853" />
    <path d="M7 11C7 10.2 7.9 9.8 8.5 10.3L10 11.5L7 13.8V11Z" fill="#FBBC05" />
    <path d="M25 11C25 10.2 24.1 9.8 23.5 10.3L22 11.5L25 13.8V11Z" fill="#FBBC05" />
  </svg>
);
