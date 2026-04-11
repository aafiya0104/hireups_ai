import Link from "next/link";

const links = [
  { href: "/tpo/dashboard", label: "Dashboard" },
  { href: "/tpo/companies", label: "Companies" },
  { href: "/tpo/alumni", label: "Alumni" },
  { href: "/tpo/outreach", label: "Outreach" },
  { href: "/tpo/analytics", label: "Analytics" },
  { href: "/tpo/drives", label: "Drives" },
];

export default function TpoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-2 rounded-[2rem] border border-white/10 bg-white/[0.03] p-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
