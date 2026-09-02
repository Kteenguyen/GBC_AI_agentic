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
    <path d="M7 11V22C7 22.5 7.5 23 8 23H10V14.5L16 19L22 14.5V23H24C24.5 23 25 22.5 25 22V11C25 10.2 24.1 9.8 23.5 10.3L16 16L8.5 10.3C7.9 9.8 7 10.2 7 11Z" fill="#EA4335" />
    <path d="M7 11V22C7 22.5 7.5 23 8 23H10V14.5L7 12V11Z" fill="#4285F4" />
    <path d="M25 11V22C25 22.5 24.5 23 24 23H22V14.5L25 12V11Z" fill="#34A853" />
    <path d="M7 11C7 10.2 7.9 9.8 8.5 10.3L10 11.5L7 13.8V11Z" fill="#FBBC05" />
    <path d="M25 11C25 10.2 24.1 9.8 23.5 10.3L22 11.5L25 13.8V11Z" fill="#FBBC05" />
  </svg>
);

// 14. Official GitLab CI/CD Logo (Geometric Tanuki Fox)
export const GitLabLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#FFF5EE" stroke="#FC6D26" strokeWidth="1.5" />
    <path d="M16 25.5L20.8 10.8H11.2L16 25.5Z" fill="#E24329" />
    <path d="M16 25.5L11.2 10.8H6L16 25.5Z" fill="#FC6D26" />
    <path d="M6 10.8L4.2 16.3C4 16.9 4.2 17.5 4.7 17.9L16 25.5L6 10.8Z" fill="#FCA326" />
    <path d="M6 10.8H11.2L8.6 2.8C8.3 2 7.2 2 6.9 2.8L6 10.8Z" fill="#E24329" />
    <path d="M16 25.5L20.8 10.8H26L16 25.5Z" fill="#FC6D26" />
    <path d="M26 10.8L27.8 16.3C28 16.9 27.8 17.5 27.3 17.9L16 25.5L26 10.8Z" fill="#FCA326" />
    <path d="M26 10.8H20.8L23.4 2.8C23.7 2 24.8 2 25.1 2.8L26 10.8Z" fill="#E24329" />
  </svg>
);

// 15. Official Woodpecker CI Logo (Geometric Bird Crest)
export const WoodpeckerLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0A1826" stroke="#23C4F8" strokeWidth="1.5" />
    <path d="M8 23L16 7L24 23H8Z" fill="none" stroke="#23C4F8" strokeWidth="1.8" />
    <path d="M16 7L21 17H11L16 7Z" fill="#23C4F8" />
    <circle cx="16" cy="14" r="1.5" fill="#0A1826" />
    <path d="M16 17L21 23H11L16 17Z" fill="#00E5FF" />
  </svg>
);

// 16. Official Drone CI by Harness Logo (Quadcopter Drone)
export const DroneLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0B132B" stroke="#2496ED" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="4.5" fill="#2496ED" />
    <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
    <line x1="12" y1="12" x2="8" y2="8" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="12" x2="24" y2="8" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="20" x2="8" y2="24" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="20" x2="24" y2="24" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="8" r="2.5" fill="#2496ED" stroke="#00E5FF" strokeWidth="1" />
    <circle cx="24" cy="8" r="2.5" fill="#2496ED" stroke="#00E5FF" strokeWidth="1" />
    <circle cx="8" cy="24" r="2.5" fill="#2496ED" stroke="#00E5FF" strokeWidth="1" />
    <circle cx="24" cy="24" r="2.5" fill="#2496ED" stroke="#00E5FF" strokeWidth="1" />
  </svg>
);

// 17. Official Act / GitHub Actions Logo (Actions Rocket)
export const ActLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#181F2E" stroke="#2088FF" strokeWidth="1.5" />
    <path d="M12 9L21 16L12 23V9Z" fill="#2088FF" />
    <circle cx="12" cy="9" r="2.5" fill="#79C0FF" />
    <circle cx="12" cy="23" r="2.5" fill="#79C0FF" />
    <circle cx="21" cy="16" r="3" fill="#58A6FF" />
  </svg>
);

// 18. Official Gitea Logo (Teapot Tea Cup)
export const GiteaLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#F0FDF4" stroke="#609926" strokeWidth="1.5" />
    <path d="M10 13C10 11.5 12.5 10 16 10C19.5 10 22 11.5 22 13V20C22 23.5 19.5 25 16 25C12.5 25 10 23.5 10 20V13Z" fill="#609926" />
    <path d="M22 14H24.5C25.5 14 26 15 26 16C26 17 25.5 18 24.5 18H22" stroke="#609926" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="13.5" cy="15" r="1" fill="#FFFFFF" />
    <circle cx="18.5" cy="15" r="1" fill="#FFFFFF" />
  </svg>
);

// 19. Official Snyk Logo (Snyk Guard Dog)
export const SnykLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#141E33" stroke="#4C54D2" strokeWidth="1.5" />
    <path d="M9 10L14 7L16 11L18 7L23 10L22 17L16 24L10 17L9 10Z" fill="#4C54D2" />
    <circle cx="13" cy="14" r="1.2" fill="#FFFFFF" />
    <circle cx="19" cy="14" r="1.2" fill="#FFFFFF" />
  </svg>
);

// 20. Official Semgrep Logo (Magnifying Paw Search)
export const SemgrepLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0F172A" stroke="#2B7FFF" strokeWidth="1.5" />
    <circle cx="14.5" cy="14.5" r="5.5" stroke="#2B7FFF" strokeWidth="2.2" fill="none" />
    <line x1="18.5" y1="18.5" x2="24" y2="24" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="14.5" cy="14.5" r="2" fill="#38BDF8" />
  </svg>
);

// 21. Official Grype Logo (Anchore Grype Shield)
export const GrypeLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0A1628" stroke="#00D084" strokeWidth="1.5" />
    <path d="M16 6L23 10V16C23 21 19.5 24.5 16 26C12.5 24.5 9 21 9 16V10L16 6Z" fill="#00D084" fillOpacity="0.2" stroke="#00D084" strokeWidth="1.8" />
    <circle cx="16" cy="14" r="3" stroke="#00D084" strokeWidth="1.5" />
    <path d="M16 17V21M13 21H19" stroke="#00D084" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 22. Official Podman Logo (Purple Container Pod)
export const PodmanLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#241B35" stroke="#892CA0" strokeWidth="1.5" />
    <rect x="9" y="10" width="14" height="12" rx="3" fill="#892CA0" />
    <circle cx="13" cy="14" r="1.5" fill="#FFFFFF" />
    <circle cx="19" cy="14" r="1.5" fill="#FFFFFF" />
    <circle cx="13" cy="18" r="1" fill="#C084FC" />
    <circle cx="19" cy="18" r="1" fill="#C084FC" />
  </svg>
);

// 23. Official Kaniko Logo (Google Kaniko Cube)
export const KanikoLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0F172A" stroke="#4285F4" strokeWidth="1.5" />
    <path d="M16 7L24 11.5V20.5L16 25L8 20.5V11.5L16 7Z" fill="none" stroke="#4285F4" strokeWidth="1.8" />
    <path d="M16 7V25M8 11.5L16 16L24 11.5" stroke="#34A853" strokeWidth="1.5" />
  </svg>
);

// 24. Official Flux CD Logo (CNCF Infinity Cycle)
export const FluxCDLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0B132B" stroke="#00D2D3" strokeWidth="1.5" />
    <path d="M12 16C12 13.5 13.5 12 16 12C18.5 12 20 13.5 20 16C20 18.5 21.5 20 24 20C26.5 20 28 18.5 28 16" stroke="#00D2D3" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M20 16C20 18.5 18.5 20 16 20C13.5 20 12 18.5 12 16C12 13.5 10.5 12 8 12C5.5 12 4 13.5 4 16" stroke="#54A0FF" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 25. Official OpenShift Logo (Red Hat OpenShift Ring)
export const OpenShiftLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#18191A" stroke="#EE0000" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="7" stroke="#EE0000" strokeWidth="2" strokeDasharray="3 3" fill="none" />
    <circle cx="16" cy="9" r="2" fill="#EE0000" />
    <circle cx="23" cy="16" r="2" fill="#EE0000" />
    <circle cx="16" cy="23" r="2" fill="#EE0000" />
    <circle cx="9" cy="16" r="2" fill="#EE0000" />
  </svg>
);

// 26. Official VictoriaMetrics Logo (VM Lettermark Chart)
export const VictoriaMetricsLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0A1128" stroke="#FF4D4D" strokeWidth="1.5" />
    <path d="M8 10L13 22L16 15L19 22L24 10" stroke="#FF4D4D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 27. Official Zabbix Logo (Zabbix Red Crest)
export const ZabbixLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="#D40000" />
    <path d="M10 10H22L11 22H23" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 28. Official Loki Logo (Grafana Loki Viking Ship)
export const LokiLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#0B1A18" stroke="#F46800" strokeWidth="1.5" />
    <path d="M7 18C10 22 22 22 25 18L23 15H9L7 18Z" fill="#F46800" />
    <line x1="16" y1="9" x2="16" y2="15" stroke="#FBBF24" strokeWidth="2" />
    <path d="M16 10L21 12.5L16 15V10Z" fill="#FBBF24" />
  </svg>
);

// 29. Official Alertmanager Logo (Prometheus Megaphone Alert)
export const AlertmanagerLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#1C1917" stroke="#EF4444" strokeWidth="1.5" />
    <path d="M10 13H13L18 9V23L13 19H10V13Z" fill="#EF4444" />
    <path d="M21 12C22.5 13.5 22.5 18.5 21 20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <path d="M23.5 10C26 13 26 19 23.5 22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Universal Official Tool Logo Dispatcher
export const OfficialToolIcon: React.FC<{ toolIdOrName: string; className?: string }> = ({ toolIdOrName, className = "w-7 h-7" }) => {
  const key = toolIdOrName.toLowerCase();
  if (key.includes('gitlab')) return <GitLabLogo className={className} />;
  if (key.includes('woodpecker')) return <WoodpeckerLogo className={className} />;
  if (key.includes('drone')) return <DroneLogo className={className} />;
  if (key.includes('act') || key.includes('github-actions') || key.includes('actions')) return <ActLogo className={className} />;
  if (key.includes('gitea')) return <GiteaLogo className={className} />;
  if (key.includes('jenkins')) return <JenkinsLogo className={className} />;
  if (key.includes('sonarqube') || key.includes('sonar')) return <SonarQubeLogo className={className} />;
  if (key.includes('owasp') || key.includes('dependency-check')) return <OwaspLogo className={className} />;
  if (key.includes('trivy')) return <TrivyLogo className={className} />;
  if (key.includes('snyk')) return <SnykLogo className={className} />;
  if (key.includes('semgrep')) return <SemgrepLogo className={className} />;
  if (key.includes('grype')) return <GrypeLogo className={className} />;
  if (key.includes('docker') || key.includes('buildkit')) return <DockerLogo className={className} />;
  if (key.includes('podman')) return <PodmanLogo className={className} />;
  if (key.includes('kaniko')) return <KanikoLogo className={className} />;
  if (key.includes('argocd') || key.includes('argo')) return <ArgoCDLogo className={className} />;
  if (key.includes('flux')) return <FluxCDLogo className={className} />;
  if (key.includes('openshift')) return <OpenShiftLogo className={className} />;
  if (key.includes('kubernetes') || key.includes('k8s')) return <KubernetesLogo className={className} />;
  if (key.includes('prometheus')) return <PrometheusLogo className={className} />;
  if (key.includes('grafana')) return <GrafanaLogo className={className} />;
  if (key.includes('victoriametrics') || key.includes('victoria')) return <VictoriaMetricsLogo className={className} />;
  if (key.includes('zabbix')) return <ZabbixLogo className={className} />;
  if (key.includes('loki')) return <LokiLogo className={className} />;
  if (key.includes('alertmanager') || key.includes('alert')) return <AlertmanagerLogo className={className} />;
  if (key.includes('gmail') || key.includes('mail')) return <GmailLogo className={className} />;
  return <DeveloperLogo className={className} />;
};
