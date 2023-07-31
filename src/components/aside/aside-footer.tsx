const footerLinks = [
  ["Terms of Service", ""],
  ["Privacy", ""],
  ["Contact Us", ""],
] as const;

export function AsideFooter(): JSX.Element {
  return (
    <footer className="sticky flex flex-col gap-3 text-sm text-center top-16 text-light-secondary dark:text-dark-secondary">
      <nav className="flex flex-wrap justify-center gap-2">
        {footerLinks.map(([linkName, href], index) => (
          <a
            className="custom-underline"
            target="_blank"
            rel="noreferrer"
            href={href}
            key={index}
          >
            {linkName}
          </a>
        ))}
      </nav>
      <p>© 4Real 2023</p>
    </footer>
  );
}
