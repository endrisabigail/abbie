import { asset } from "./site.js";

export const education = {
  school: "University of North Texas",
  degree: "B.S. Computer Science",
  when: "Expected Dec 2026",
  where: "Denton, TX",
  coursework: ["Data Structures", "Software Engineering", "System Programming", "Algorithms"],
  badges: [
    { icon: "🏅", name: "Dean's List", detail: "Spring 2025" },
    { icon: "🐍", name: "Programming for Everybody", detail: "Getting Started with Python · May 2025" },
  ],
};

export const internship = {
  role: "Systems Engineer Intern",
  org: "Palo Alto Networks",
  where: "Plano, TX",
  when: "May 2026 – Aug 2026",
  bullets: [
    "Configured a Palo Alto PA-415 firewall running PAN-OS, routing outbound internet access and verifying stateful traffic filtering across Layer 3 interfaces via custom NAT rules and inter-zone security policies.",
    "Enforced strict network isolation to prevent lateral movement toward internal zones and applied a 60-minute DHCP lease allocation limit to minimize dynamic host exposure.",
    "Developed a full-stack project management web app (MERN, Firebase Auth, Socket.IO, custom 3D assets, integrated AI assistant) alongside the internship.",
    "Co-presented a live Cortex XSIAM product demonstration to a PANW VP with a fellow intern.",
  ],
  photos: [
    { src: asset("photos/panw/panw8.jpeg"), caption: "First day" },
    { src: asset("photos/panw/panw1.jpg"), caption: "Picture day" },
    { src: asset("photos/panw/panw2.jpg"), caption: "Picture day, round two" },
    { src: asset("photos/panw/panw3.jpg"), caption: "Intern awards with my manager" },
    { src: asset("photos/panw/panw4.jpg"), caption: "Company-wide intern spotlight" },
    { src: asset("photos/panw/panw5.jpg"), caption: "The intern class" },
    { src: asset("photos/panw/panw6.jpg"), caption: "Team dinner" },
    { src: asset("photos/panw/panw7.jpg"), caption: "Cool under pressure award" },
    { src: asset("photos/panw/panw9.jpg"), caption: "WWE night" },
  ],
};

export const capstone = {
  role: "UI/UX Developer",
  title: "Koda · UNT Sponsored Capstone",
  when: "2026",
  bullets: [
    "Designed and implemented the app's UI/UX, including the habitat backgrounds, animation code, 3D rendered avatars, and dark mode interface.",
    "Created the wireframes and proposed the tech stack the team built on (React, Node.js, Express, MongoDB).",
    "Built the login and registration flows with JWT-based authentication, form validation, and session handling.",
  ],
};

export const caam = {
  title: "CAAM-ITEAM Summer Outreach Program",
  org: "Center for Agile and Adaptive Additive Manufacturing · UNT",
  when: "June 2025",
  bullets: [
    "Completed an intensive week-long program on additive manufacturing and its applications in engineering.",
    "Attended modules on data science, cybersecurity, materials science, supply chain logistics, and diagnostics.",
    "Took part in hands-on lab sessions, applying classroom concepts to real manufacturing problems.",
  ],
  photos: [
    { src: asset("photos/caam/caam1.jpeg"), caption: "Certification" },
    { src: asset("photos/caam/caam2.jpeg"), caption: "Lab work" },
    { src: asset("photos/caam/caam3.jpeg"), caption: "Collaboration" },
  ],
};
